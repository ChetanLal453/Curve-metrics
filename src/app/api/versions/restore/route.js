import { NextResponse } from 'next/server'
import pool from '../../../../lib/db.js'
import { requireAdmin } from '../../../../lib/require-admin.js'
import { databaseErrorResponse, getExistingColumns, parseJsonValue, tableExists, missingTableResponse } from '../../_utils/crud.js'
import { normalizeLayout, saveLayoutForPage } from '../../../../lib/layout-sync.js'

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

  const versionId = body?.version_id
  if (!versionId) {
    return NextResponse.json({ success: false, error: 'version_id is required' }, { status: 400 })
  }

  try {
    if (!(await tableExists('page_versions'))) {
      return missingTableResponse('page_versions')
    }

    const versionColumns = await getExistingColumns('page_versions')
    const selectFields = [
      'id',
      'page_id',
      versionColumns.includes('version_name') ? 'version_name' : versionColumns.includes('name') ? 'name AS version_name' : 'NULL AS version_name',
      'version_number',
      versionColumns.includes('layout') ? 'layout' : 'NULL AS layout',
      versionColumns.includes('content') ? 'content' : 'NULL AS content',
    ]

    const [versionRows] = await pool.query(
      `SELECT ${selectFields.join(', ')} FROM page_versions WHERE id = ? LIMIT 1`,
      [versionId],
    )

    if (!versionRows.length) {
      return NextResponse.json({ success: false, error: 'Version not found' }, { status: 404 })
    }

    const version = versionRows[0]
    const layout = normalizeLayout(parseJsonValue(version.layout ?? version.content, { sections: [] }), {
      id: version.page_id,
      name: version.version_name,
    })

    await saveLayoutForPage({
      pageId: version.page_id,
      layout,
      pageName: version.version_name,
    })

    return NextResponse.json({
      success: true,
      data: {
        page_id: version.page_id,
        version_id: version.id,
        version_name: version.version_name,
        version_number: version.version_number,
        layout,
      },
      layout,
      message: 'Version restored successfully',
    })
  } catch (error) {
    return databaseErrorResponse(error)
  }
}
