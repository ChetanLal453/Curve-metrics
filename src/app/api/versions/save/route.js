import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import pool from '../../../../lib/db.js'
import { requireAdmin } from '../../../../lib/require-admin.js'
import { databaseErrorResponse, parseJsonRow, tableExists, missingTableResponse } from '../../_utils/crud.js'

function normalizeVersionRow(row) {
  return {
    id: row.id,
    page_id: row.page_id,
    version_name: row.version_name || `Version ${row.version_number || 1}`,
    version_number: Number(row.version_number || 1),
    layout: row.layout || row.content || {},
    description: row.description || row.notes || '',
    created_by: row.created_by || null,
    created_at: row.created_at || null,
  }
}

export async function POST(request) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const pageId = body?.page_id
  if (!pageId) {
    return NextResponse.json({ success: false, error: 'page_id is required' }, { status: 400 })
  }

  const layout = body?.layout ?? body?.content
  if (layout === undefined) {
    return NextResponse.json({ success: false, error: 'layout is required' }, { status: 400 })
  }

  const description = body?.description ?? body?.notes ?? ''
  const createdBy = body?.created_by ?? 'system'

  try {
    if (!(await tableExists('page_versions'))) {
      return missingTableResponse('page_versions')
    }

    const [pages] = await pool.query('SELECT id FROM pages WHERE id = ? LIMIT 1', [pageId])
    if (!pages.length) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
    }

    const [versionRows] = await pool.query(
      'SELECT COALESCE(MAX(version_number), 0) AS max_version FROM page_versions WHERE page_id = ?',
      [pageId],
    )
    const versionNumber = Number(versionRows[0]?.max_version || 0) + 1
    const versionName = body?.version_name || body?.name || `Version ${versionNumber}`
    const versionId = body?.id || randomUUID()
    const serializedLayout = JSON.stringify(layout)

    await pool.query(
      `INSERT INTO page_versions (
        id,
        page_id,
        version_name,
        version_number,
        content,
        layout,
        description,
        notes,
        created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [versionId, pageId, versionName, versionNumber, serializedLayout, serializedLayout, description, description, createdBy],
    )

    const [rows] = await pool.query(
      `SELECT
        id,
        page_id,
        version_name,
        version_number,
        content,
        layout,
        description,
        notes,
        created_by,
        created_at
      FROM page_versions
      WHERE id = ?
      LIMIT 1`,
      [versionId],
    )

    const version = normalizeVersionRow(parseJsonRow(rows[0], ['content', 'layout']))

    return NextResponse.json({ success: true, data: version, version, message: 'Version saved successfully' }, { status: 201 })
  } catch (error) {
    return databaseErrorResponse(error)
  }
}
