import pool from '../../../lib/db.js'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || ''
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = `
      SELECT id, filename, original_filename, url, type, size, alt, tags, uploaded_at
      FROM media_library
      WHERE 1=1
    `
    const params = []

    if (search) {
      query += ' AND (original_filename LIKE ? OR alt LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    if (type) {
      query += ' AND type LIKE ?'
      params.push(`${type}%`)
    }

    query += ' ORDER BY uploaded_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const [rows] = await pool.execute(query, params)

    // Parse tags JSON if needed
    const media = rows.map(row => ({
      ...row,
      tags: row.tags ? (typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags) : []
    }))

    return Response.json({
      success: true,
      media,
      total: media.length
    })

  } catch (error) {
    console.error('Error fetching media:', error)
    return Response.json({
      success: false,
      error: 'Failed to fetch media'
    }, { status: 500 })
  }
}
