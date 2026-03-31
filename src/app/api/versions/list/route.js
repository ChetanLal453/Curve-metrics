import { NextResponse } from 'next/server'
import pool from '../../../../lib/db.js'
import { requireAdmin } from '../../../../lib/require-admin.js'
import {
  databaseErrorResponse,
  getExistingColumns,
  missingTableResponse,
  parseJsonRows,
  parsePaginationParams,
  tableExists,
} from '../../_utils/crud.js'

function normalizeVersionRow(row) {
  return {
    id: row.id,
    page_id: row.page_id,
    version_name: row.version_name || row.name || `Version ${row.version_number || 1}`,
    version_number: Number(row.version_number || 1),
    layout: row.layout || row.content || {},
    description: row.description || row.notes || '',
    created_by: row.created_by || null,
    created_at: row.created_at || null,
  }
}

export async function GET(request) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  const { searchParams } = new URL(request.url)
  const pageId = searchParams.get('page_id')

  if (!pageId) {
    return NextResponse.json({ success: false, error: 'page_id is required' }, { status: 400 })
  }

  try {
    if (!(await tableExists('page_versions'))) {
      return missingTableResponse('page_versions')
    }

    const versionColumns = await getExistingColumns('page_versions')
    const { limit, offset, applyPagination } = parsePaginationParams(request, { defaultLimit: 50, maxLimit: 200 })
    const [countRows] = await pool.query('SELECT COUNT(*) AS total FROM page_versions WHERE page_id = ?', [pageId])
    const values = [pageId]
    let query = `SELECT
      id,
      page_id,
      ${versionColumns.includes('version_name') ? 'version_name' : versionColumns.includes('name') ? 'name AS version_name' : 'NULL AS version_name'},
      version_number,
      ${versionColumns.includes('layout') ? 'layout' : 'NULL AS layout'},
      ${versionColumns.includes('content') ? 'content' : 'NULL AS content'},
      ${versionColumns.includes('description') ? 'description' : 'NULL AS description'},
      ${versionColumns.includes('notes') ? 'notes' : 'NULL AS notes'},
      ${versionColumns.includes('created_by') ? 'created_by' : 'NULL AS created_by'},
      created_at
    FROM page_versions
    WHERE page_id = ?
    ORDER BY version_number DESC, created_at DESC`

    if (applyPagination && limit !== null) {
      query += ' LIMIT ? OFFSET ?'
      values.push(limit, offset)
    }

    const [rows] = await pool.query(
      query,
      values,
    )

    const versions = parseJsonRows(rows, ['content', 'layout']).map(normalizeVersionRow)

    return NextResponse.json({
      success: true,
      data: versions,
      versions,
      total: Number(countRows[0]?.total || 0),
      limit,
      offset,
    })
  } catch (error) {
    return databaseErrorResponse(error)
  }
}
