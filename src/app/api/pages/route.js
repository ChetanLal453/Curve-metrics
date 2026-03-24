import { NextResponse } from 'next/server'
import pool from '../../../lib/db.js'
import { getExistingColumns, missingTableResponse, parsePaginationParams, tableExists } from '../_utils/crud.js'
import { requireAdmin } from '../../../lib/require-admin.js'

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
      name: page.title || page.name || page.slug || 'Untitled Page',
      label: page.title || page.name || page.slug || 'Untitled Page',
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
