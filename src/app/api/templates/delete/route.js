import { NextResponse } from 'next/server'
import pool from '../../../../lib/db.js'
import { requireAdmin } from '../../../../lib/require-admin.js'
import { databaseErrorResponse, missingTableResponse, tableExists } from '../../_utils/crud.js'

export async function DELETE(request) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ success: false, error: 'Template ID is required' }, { status: 400 })
  }

  try {
    if (!(await tableExists('custom_templates'))) {
      return missingTableResponse('custom_templates')
    }

    const [rows] = await pool.query('SELECT id FROM custom_templates WHERE id = ? LIMIT 1', [id])
    if (!rows.length) {
      return NextResponse.json({ success: false, error: 'Template not found' }, { status: 404 })
    }

    await pool.query('DELETE FROM custom_templates WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      data: { id },
      message: 'Template deleted successfully',
    })
  } catch (error) {
    return databaseErrorResponse(error)
  }
}
