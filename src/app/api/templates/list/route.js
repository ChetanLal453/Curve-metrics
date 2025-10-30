import pool from '../../../lib/db.js'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = `
      SELECT id, name, description, category, thumbnail, tags, created_at, updated_at
      FROM custom_templates
      WHERE 1=1
    `
    const params = []

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    if (category && category !== 'all') {
      query += ' AND category = ?'
      params.push(category)
    }

    query += ' ORDER BY updated_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const [rows] = await pool.execute(query, params)

    // Parse tags JSON
    const templates = rows.map(row => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : []
    }))

    return Response.json({
      success: true,
      templates,
      total: templates.length
    })

  } catch (error) {
    console.error('Error fetching templates:', error)
    return Response.json({
      success: false,
      error: 'Failed to fetch templates'
    }, { status: 500 })
  }
}
