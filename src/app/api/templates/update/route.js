import { NextResponse } from 'next/server'
import pool from '../../../../lib/db.js'
import { requireAdmin } from '../../../../lib/require-admin.js'
import {
  databaseErrorResponse,
  getExistingColumns,
  parseJsonRow,
  tableExists,
  missingTableResponse,
} from '../../_utils/crud.js'

function normalizeLayout(layout, content) {
  return layout ?? content ?? {}
}

function normalizeTemplateRow(row) {
  return {
    ...row,
    layout: row.layout || row.content || {},
    content: row.content || row.layout || {},
    tags: Array.isArray(row.tags) ? row.tags : [],
  }
}

export async function PUT(request) {
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

  const id = body?.id
  if (!id) {
    return NextResponse.json({ success: false, error: 'Template ID is required' }, { status: 400 })
  }

  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  if (!name) {
    return NextResponse.json({ success: false, error: 'Template name is required' }, { status: 400 })
  }

  const layout = normalizeLayout(body?.layout, body?.content)
  const description = body?.description ?? ''
  const category = body?.category ?? 'general'
  const thumbnail = body?.thumbnail ?? ''
  const tags = Array.isArray(body?.tags) ? body.tags : []

  try {
    if (!(await tableExists('custom_templates'))) {
      return missingTableResponse('custom_templates')
    }

    const columns = await getExistingColumns('custom_templates')
    const [existingRows] = await pool.query('SELECT id FROM custom_templates WHERE id = ? LIMIT 1', [id])
    if (!existingRows.length) {
      return NextResponse.json({ success: false, error: 'Template not found' }, { status: 404 })
    }

    const payload = {
      name,
      description,
      category,
      thumbnail,
      layout: JSON.stringify(layout),
      content: JSON.stringify(layout),
      tags: JSON.stringify(tags),
    }
    const updateFields = Object.keys(payload).filter((field) => columns.includes(field))

    await pool.query(
      `UPDATE custom_templates
       SET ${updateFields.map((field) => `${field} = ?`).join(', ')}, updated_at = NOW()
       WHERE id = ?`,
      [...updateFields.map((field) => payload[field]), id],
    )

    const selectFields = [
      'id',
      'name',
      columns.includes('description') ? 'description' : 'NULL AS description',
      columns.includes('category') ? 'category' : 'NULL AS category',
      columns.includes('thumbnail') ? 'thumbnail' : 'NULL AS thumbnail',
      columns.includes('layout') ? 'layout' : 'NULL AS layout',
      columns.includes('content') ? 'content' : 'NULL AS content',
      columns.includes('tags') ? 'tags' : 'NULL AS tags',
      columns.includes('created_at') ? 'created_at' : 'NULL AS created_at',
      columns.includes('updated_at') ? 'updated_at' : 'NULL AS updated_at',
    ]
    const [rows] = await pool.query(
      `SELECT
        ${selectFields.join(', ')}
      FROM custom_templates
      WHERE id = ?
      LIMIT 1`,
      [id],
    )

    const template = normalizeTemplateRow(parseJsonRow(rows[0], ['layout', 'content', 'tags']))

    return NextResponse.json({
      success: true,
      data: template,
      template,
      message: 'Template updated successfully',
    })
  } catch (error) {
    return databaseErrorResponse(error)
  }
}
