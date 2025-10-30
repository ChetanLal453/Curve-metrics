import pool from '../../../lib/db.js'

export async function PUT(request) {
  try {
    const { id, alt, tags } = await request.json()

    if (!id) {
      return Response.json({
        success: false,
        error: 'Media ID is required'
      }, { status: 400 })
    }

    // Update media in database
    await pool.execute(
      'UPDATE media_library SET alt = ?, tags = ?, updated_at = NOW() WHERE id = ?',
      [alt || null, JSON.stringify(tags || []), id]
    )

    // Fetch updated media
    const [rows] = await pool.execute(
      'SELECT id, filename, original_filename, url, type, size, alt, tags, uploaded_at FROM media_library WHERE id = ?',
      [id]
    )

    if (rows.length === 0) {
      return Response.json({
        success: false,
        error: 'Media not found'
      }, { status: 404 })
    }

    const media = {
      ...rows[0],
      tags: rows[0].tags ? (typeof rows[0].tags === 'string' ? JSON.parse(rows[0].tags) : rows[0].tags) : []
    }

    return Response.json({
      success: true,
      media,
      message: 'Media updated successfully'
    })

  } catch (error) {
    console.error('Error updating media:', error)
    return Response.json({
      success: false,
      error: 'Failed to update media'
    }, { status: 500 })
  }
}
