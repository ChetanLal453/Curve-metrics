import { NextResponse } from 'next/server'
import pool from '../../../../lib/db.js'
import { requireAdmin } from '../../../../lib/require-admin.js'
import {
  databaseErrorResponse,
  getExistingColumns,
  parseJsonValue,
  pickDefined,
  tableExists,
  missingTableResponse,
} from '../../_utils/crud.js'
import { normalizeLayout, saveLayoutForPage } from '../../../../lib/layout-sync.js'
import { clearPublicPageBundleCache } from '../../../../lib/public-page-cache.js'

function parsePageId(pageId) {
  const parsed = Number.parseInt(pageId, 10)
  return Number.isNaN(parsed) ? null : parsed
}

function normalizePageRow(page) {
  return {
    id: page.id,
    slug: page.slug,
    title: page.title || page.name || '',
    name: page.name || page.title || '',
    status: page.status || null,
    disabled: Boolean(page.disabled),
    header_slug: page.header_slug ?? null,
    footer_slug: page.footer_slug ?? null,
    banner_slug: page.banner_slug ?? null,
    meta_title: page.meta_title ?? null,
    meta_description: page.meta_description ?? null,
    meta_image: page.meta_image ?? null,
    published_at: page.published_at ?? null,
    updated_at: page.updated_at ?? null,
    layout: parseJsonValue(page.layout, {}),
    published_layout: parseJsonValue(page.published_layout, null),
  }
}

function hasLayoutSections(layout) {
  return Boolean(layout && Array.isArray(layout.sections) && layout.sections.length > 0)
}

async function getPageSelectClause() {
  const columns = await getExistingColumns('pages')
  const selectFields = [
    'id',
    'slug',
    'title',
    'name',
    'layout',
    columns.includes('published_layout') ? 'published_layout' : 'NULL AS published_layout',
    'status',
    'disabled',
    'header_slug',
    'footer_slug',
    'banner_slug',
    columns.includes('meta_title') ? 'meta_title' : 'NULL AS meta_title',
    columns.includes('meta_description') ? 'meta_description' : 'NULL AS meta_description',
    columns.includes('meta_image') ? 'meta_image' : 'NULL AS meta_image',
    columns.includes('published_at') ? 'published_at' : 'NULL AS published_at',
    'updated_at',
  ]

  return selectFields.join(',\n        ')
}

export async function GET(_request, { params }) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  const pageId = parsePageId(params?.page_id)
  if (pageId === null) {
    return NextResponse.json({ success: false, error: 'Invalid page ID' }, { status: 400 })
  }

  try {
    if (!(await tableExists('pages'))) {
      return missingTableResponse('pages')
    }

    const selectClause = await getPageSelectClause()
    const [rows] = await pool.query(`SELECT
        ${selectClause}
      FROM pages
      WHERE id = ?
      LIMIT 1`, [pageId])

    if (!rows.length) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
    }

    const normalizedPage = normalizePageRow(rows[0])

    if (!hasLayoutSections(normalizedPage.layout)) {
      if (hasLayoutSections(normalizedPage.published_layout)) {
        normalizedPage.layout = normalizeLayout(normalizedPage.published_layout, normalizedPage)
      } else if (await tableExists('page_versions')) {
        const versionColumns = await getExistingColumns('page_versions')
        if (versionColumns.includes('page_id')) {
          const selectLayoutExpr = versionColumns.includes('layout')
            ? 'layout'
            : versionColumns.includes('content')
              ? 'content AS layout'
              : 'NULL AS layout'
          const orderBy =
            versionColumns.includes('version_number') && versionColumns.includes('created_at')
              ? 'ORDER BY version_number DESC, created_at DESC'
              : versionColumns.includes('version_number')
                ? 'ORDER BY version_number DESC'
                : versionColumns.includes('created_at')
                  ? 'ORDER BY created_at DESC'
                  : ''

          const [versionRows] = await pool.query(
            `SELECT ${selectLayoutExpr}
             FROM page_versions
             WHERE page_id = ?
             ${orderBy}
             LIMIT 1`,
            [pageId],
          )

          if (Array.isArray(versionRows) && versionRows.length > 0) {
            const recoveredLayout = parseJsonValue(versionRows[0].layout, null)
            if (hasLayoutSections(recoveredLayout)) {
              normalizedPage.layout = normalizeLayout(recoveredLayout, normalizedPage)
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      page: normalizedPage,
    })
  } catch (error) {
    return databaseErrorResponse(error)
  }
}

export async function DELETE(_request, { params }) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  const pageId = parsePageId(params?.page_id)
  if (pageId === null) {
    return NextResponse.json({ success: false, error: 'Invalid page ID' }, { status: 400 })
  }

  try {
    if (!(await tableExists('pages'))) {
      return missingTableResponse('pages')
    }

    const [pages] = await pool.query('SELECT slug FROM pages WHERE id = ? LIMIT 1', [pageId])
    if (!pages.length) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
    }

    if (pages[0].slug === 'home') {
      return NextResponse.json({ success: false, error: 'Cannot delete home page' }, { status: 403 })
    }

    await pool.query('DELETE FROM pages WHERE id = ?', [pageId])
    clearPublicPageBundleCache(pages[0].slug)

    return NextResponse.json({ success: true, data: { id: pageId } })
  } catch (error) {
    return databaseErrorResponse(error)
  }
}

export async function PUT(request, { params }) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  const pageId = parsePageId(params?.page_id)
  if (pageId === null) {
    return NextResponse.json({ success: false, error: 'Invalid page ID' }, { status: 400 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const payload = pickDefined(body, [
    'title',
    'name',
    'layout',
    'disabled',
    'status',
    'header_slug',
    'footer_slug',
    'banner_slug',
    'meta_title',
    'meta_description',
    'meta_image',
    'published_at',
    'scheduled_for',
  ])

  if (!Object.keys(payload).length) {
    return NextResponse.json({ success: false, error: 'Nothing to update' }, { status: 400 })
  }

  try {
    if (!(await tableExists('pages'))) {
      return missingTableResponse('pages')
    }

    const [pages] = await pool.query('SELECT id, slug FROM pages WHERE id = ? LIMIT 1', [pageId])
    if (!pages.length) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'layout')) {
      const normalizedLayout = normalizeLayout(payload.layout, {
        id: pageId,
        name: payload.name || payload.title || '',
      })
      const { layout, ...extraPageFields } = payload

      await saveLayoutForPage({
        pageId,
        layout: normalizedLayout,
        pageName: payload.name || payload.title || '',
        extraPageFields,
      })
    } else {
      const fields = Object.keys(payload)
      const values = fields.map((field) => payload[field])
      values.push(pageId)

      await pool.query(
        `UPDATE pages SET ${fields.map((field) => `${field} = ?`).join(', ')}, updated_at = NOW() WHERE id = ?`,
        values,
      )
      clearPublicPageBundleCache(pages[0].slug)
    }

    const selectClause = await getPageSelectClause()
    const [rows] = await pool.query(`SELECT
        ${selectClause}
      FROM pages
      WHERE id = ?
      LIMIT 1`, [pageId])

    return NextResponse.json({
      success: true,
      page: rows[0] ? normalizePageRow(rows[0]) : null,
    })
  } catch (error) {
    return databaseErrorResponse(error)
  }
}
