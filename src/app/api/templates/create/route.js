import pool from '../../../lib/db.js'
import { randomUUID } from 'crypto'

export async function POST(request) {
  try {
    const { name, description, category, thumbnail, layout, tags } = await request.json()

    if (!name) {
      return Response.json({
        success: false,
        error: 'Template name is required'
      }, { status: 400 })
    }

    const id = randomUUID()

    // Insert template
    const [result] = await pool.execute(
      'INSERT INTO custom_templates (id, name, description, category, thumbnail, layout, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [
        id,
        name,
        description || '',
        category || 'general',
        thumbnail || '',
        JSON.stringify(layout || { sections: [] }),
        JSON.stringify(tags || [])
      ]
    )

    // Fetch the created template
    const [rows] = await pool.execute(
      'SELECT * FROM custom_templates WHERE id = ?',
      [id]
    )

    const template = {
      ...rows[0],
      layout: JSON.parse(rows[0].layout),
      tags: JSON.parse(rows[0].tags)
    }

    return Response.json({
      success: true,
      template,
      message: 'Template created successfully'
    })

  } catch (error) {
    console.error('Error creating template:', error)
    return Response.json({
      success: false,
      error: 'Failed to create template'
    }, { status: 500 })
  }
}
