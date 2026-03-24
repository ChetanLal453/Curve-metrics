import { NextResponse } from 'next/server'
import pool from '../../../lib/db.js'
import { databaseErrorResponse, missingTableResponse, parsePaginationParams, tableExists } from '../_utils/crud.js'
import { requireAdmin } from '../../../lib/require-admin.js'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3001',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
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

    const { limit, offset, applyPagination } = parsePaginationParams(request, { maxLimit: 200 })
    const [countRows] = await pool.query('SELECT COUNT(*) AS total FROM pages')
    const values = []
    let query = `SELECT
      id,
      slug,
      title,
      disabled,
      header_slug,
      footer_slug,
      banner_slug
    FROM pages
    ORDER BY title`

    if (applyPagination && limit !== null) {
      query += ' LIMIT ? OFFSET ?'
      values.push(limit, offset)
    }

    const [pages] = await pool.query(query, values)

    return NextResponse.json(
      {
        success: true,
        pages,
        total: Number(countRows[0]?.total || 0),
        limit: limit ?? pages.length,
        offset,
      },
      { headers: corsHeaders },
    )
  } catch (error) {
    const response = databaseErrorResponse(error)
    Object.entries(corsHeaders).forEach(([key, value]) => response.headers.set(key, value))
    return response
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}
