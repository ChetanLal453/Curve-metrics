import { NextResponse } from 'next/server'
import pool from '../../../../lib/db.js'
import { requireAdmin } from '../../../../lib/require-admin.js'
import {
  databaseErrorResponse,
  getExistingColumns,
  parseJsonRows,
  tableExists,
  missingTableResponse,
} from '../../_utils/crud.js'

function safeParseInteger(value, fallback) {
  const parsed = Number.parseInt(value ?? '', 10)
  return Number.isNaN(parsed) ? fallback : parsed
}

function normalizeTemplateRow(row) {
  return {
    ...row,
    layout: row.layout || row.content || {},
    content: row.content || row.layout || {},
    tags: Array.isArray(row.tags) ? row.tags : [],
  }
}

export async function GET(request) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const limit = safeParseInteger(searchParams.get('limit'), 50)
  const offset = safeParseInteger(searchParams.get('offset'), 0)

  try {
    if (!(await tableExists('custom_templates'))) {
      return missingTableResponse('custom_templates')
    }

    const columns = await getExistingColumns('custom_templates')
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

    let query = `
      SELECT
        ${selectFields.join(', ')}
      FROM custom_templates
      WHERE 1 = 1
    `
    const values = []

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)'
      values.push(`%${search}%`, `%${search}%`)
    }

    if (category && category !== 'all') {
      query += ' AND category = ?'
      values.push(category)
    }

    query += ' ORDER BY updated_at DESC LIMIT ? OFFSET ?'
    values.push(Math.max(limit, 1), Math.max(offset, 0))

    const [rows] = await pool.query(query, values)
    const templates = parseJsonRows(rows, ['layout', 'content', 'tags']).map(normalizeTemplateRow)

    return NextResponse.json({
      success: true,
      data: templates,
      templates,
      total: templates.length,
    })
  } catch (error) {
    return databaseErrorResponse(error)
  }
}
