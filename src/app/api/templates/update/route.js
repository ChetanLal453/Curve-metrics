import pool from '../../../lib/db.js'

export async function PUT(request) {
  try {
    const { id, name, description, category, thumbnail, layout, tags } = await request.json()

    if (!id) {
      return Response.json({
        success: false,
        error: 'Template ID is required'
      }, { status: 400 })
    }

    // Update template
    await pool.execute(
      'UPDATE custom_templates SET name = ?, description = ?, category = ?, thumbnail = ?, layout = ?, tags = ?, updated_at = NOW() WHERE id = ?',
      [
        name,
        description || '',
        category || 'general',
        thumbnail || '',
        JSON.stringify(layout || { sections: [] }),
        JSON.stringify(tags || []),
        id
      ]
    )

    // Fetch updated template
    const [rows] = await pool.execute(
      'SELECT * FROM custom_templates WHERE id = ?',
      [id]
    )

    if (rows.length === 0) {
      return Response.json({
        success: false,
        error: 'Template not found'
      }, { status: 404 })
    }

    const template = {
      ...rows[0],
      layout: JSON.parse(rows[0].layout),
      tags: JSON.parse(rows[0].tags)
    }

    return Response.json({
      success: true,
      template,
      message: 'Template updated successfully'
    })

  } catch (error) {
    console.error('Error updating template:', error)
    return Response.json({
      success: false,
      error: 'Failed to update template'
    }, { status: 500 })
  }
}
