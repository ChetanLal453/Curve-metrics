import { NextResponse } from 'next/server'
import pool from '../../../../../lib/db.js'
import { requireAdmin } from '../../../../../lib/require-admin.js'
import { databaseErrorResponse, missingTableResponse, tableExists } from '../../../_utils/crud.js'
import { normalizeLayout } from '../../../../../lib/layout-sync.js'

function parsePageId(pageId) {
  const parsed = Number.parseInt(pageId, 10)
  return Number.isNaN(parsed) ? null : parsed
}

export async function POST(_request, { params }) {
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

    const [rows] = await pool.query(
      `SELECT id, slug, title, name, layout, published_layout, published_at
       FROM pages
       WHERE id = ?
       LIMIT 1`,
      [pageId],
    )

    if (!rows.length) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
    }

    const page = rows[0]
    const draftLayout = normalizeLayout(page.layout, page)

    if (!Array.isArray(draftLayout.sections) || draftLayout.sections.length === 0) {
      return NextResponse.json({ success: false, error: 'Cannot publish an empty layout' }, { status: 400 })
    }

    await pool.query(
      'UPDATE pages SET published_layout = ?, published_at = NOW(), status = ?, updated_at = NOW() WHERE id = ?',
      [JSON.stringify(draftLayout), 'published', pageId],
    )

    const [updatedRows] = await pool.query(
      `SELECT id, slug, title, name, layout, published_layout, published_at, updated_at
       FROM pages
       WHERE id = ?
       LIMIT 1`,
      [pageId],
    )

    const updatedPage = updatedRows[0]

    return NextResponse.json({
      success: true,
      data: {
        id: updatedPage.id,
        slug: updatedPage.slug,
        published_at: updatedPage.published_at ?? null,
        updated_at: updatedPage.updated_at ?? null,
        published_layout: normalizeLayout(updatedPage.published_layout ?? updatedPage.layout, updatedPage),
      },
      page: {
        id: updatedPage.id,
        slug: updatedPage.slug,
        published_at: updatedPage.published_at ?? null,
      },
    })
  } catch (error) {
    return databaseErrorResponse(error)
  }
}
