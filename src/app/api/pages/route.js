import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import pool from '../../../lib/db.js'
import { getExistingColumns, missingTableResponse, parsePaginationParams, tableExists } from '../_utils/crud.js'
import { requireAdmin } from '../../../lib/require-admin.js'
import { clearPublicPageBundleCache } from '../../../lib/public-page-cache.js'

function normalizeStatus(page) {
  if (page.status === 'published') {
    return 'live'
  }

  if (page.status) {
    return page.status
  }

  return page.disabled ? 'draft' : 'live'
}

export async function GET(request) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  try {
    if (!(await tableExists('pages'))) {
      return missingTableResponse('pages')
    }

    const columns = await getExistingColumns('pages', [
      'id',
      'slug',
      'title',
      'name',
      'status',
      'disabled',
      'header_slug',
      'footer_slug',
      'banner_slug',
    ])

    const { limit, offset, applyPagination } = parsePaginationParams(request, { maxLimit: 200 })
    const [countRows] = await pool.query('SELECT COUNT(*) AS total FROM pages')
    const values = []
    let query = `SELECT ${columns.join(', ')} FROM pages ORDER BY COALESCE(title, name, slug) ASC`

    if (applyPagination && limit !== null) {
      query += ' LIMIT ? OFFSET ?'
      values.push(limit, offset)
    }

    const [rows] = await pool.query(query, values)

    const pages = rows.map((page) => ({
      id: page.id,
      slug: page.slug || '',
      title: page.title || page.name || page.slug || 'Untitled Page',
      name: page.name || page.title || page.slug || 'Untitled Page',
      label: page.title || page.name || page.slug || 'Untitled Page',
      disabled: Boolean(page.disabled),
      header_slug: page.header_slug ?? null,
      footer_slug: page.footer_slug ?? null,
      banner_slug: page.banner_slug ?? null,
      url: page.slug === 'home' ? '/' : `/${page.slug || ''}`.replace(/\/+/g, '/'),
      status: normalizeStatus(page),
    }))

    return NextResponse.json({
      success: true,
      pages,
      total: Number(countRows[0]?.total || 0),
      limit: limit ?? pages.length,
      offset,
    })
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch pages' }, { status: 500 })
  }
}

export async function POST(request) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  try {
    if (!(await tableExists('pages'))) {
      return missingTableResponse('pages')
    }

    const body = await request.json()
    const name = String(body?.name || body?.title || '').trim()

    if (!name) {
      return NextResponse.json({ success: false, error: 'name is required' }, { status: 400 })
    }

    let slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    slug = slug || `page-${Date.now()}`
    const originalSlug = slug
    let counter = 1

    while (true) {
      const [existing] = await pool.execute('SELECT id FROM pages WHERE slug = ? LIMIT 1', [slug])
      if (!existing.length) {
        break
      }

      slug = `${originalSlug}-${counter}`
      counter += 1
    }

    const initialLayout = {
      id: randomUUID(),
      name,
      sections: [],
    }

    const [result] = await pool.execute(
      'INSERT INTO pages (slug, title, name, layout) VALUES (?, ?, ?, ?)',
      [slug, name, name, JSON.stringify(initialLayout)],
    )

    clearPublicPageBundleCache(slug)

    return NextResponse.json(
      {
        success: true,
        page: {
          id: result.insertId,
          slug,
          title: name,
          name,
          disabled: false,
          layout: initialLayout,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json({ success: false, error: 'Failed to create page' }, { status: 500 })
  }
}
