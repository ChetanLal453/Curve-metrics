import pool from '../../../lib/db.js'
import { randomUUID } from 'crypto'

export async function POST(request) {
  try {
    const { page_id, name, description, layout } = await request.json()

    if (!page_id) {
      return Response.json({
        success: false,
        error: 'page_id is required'
      }, { status: 400 })
    }

    // Get the next version number for this page
    const [versionRows] = await pool.execute(
      'SELECT MAX(version_number) as max_version FROM page_versions WHERE page_id = ?',
      [page_id]
    )

    const nextVersionNumber = (versionRows[0]?.max_version || 0) + 1

    const versionId = randomUUID()

    // Insert version
    await pool.execute(
      'INSERT INTO page_versions (id, page_id, version_number, name, description, layout, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [
        versionId,
        page_id,
        nextVersionNumber,
        name || `Version ${nextVersionNumber}`,
        description || '',
        JSON.stringify(layout || { sections: [] }),
        'admin' // In a real app, this would come from authentication
      ]
    )

    // Fetch the created version
    const [rows] = await pool.execute(
      'SELECT * FROM page_versions WHERE id = ?',
      [versionId]
    )

    const version = {
      ...rows[0],
      layout: JSON.parse(rows[0].layout)
    }

    return Response.json({
      success: true,
      version,
      message: 'Version saved successfully'
    })

  } catch (error) {
    console.error('Error saving version:', error)
    return Response.json({
      success: false,
      error: 'Failed to save version'
    }, { status: 500 })
  }
}
