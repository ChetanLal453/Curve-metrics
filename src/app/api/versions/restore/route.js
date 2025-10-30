import pool from '../../../lib/db.js'

export async function POST(request) {
  try {
    const { version_id } = await request.json()

    if (!version_id) {
      return Response.json({
        success: false,
        error: 'version_id is required'
      }, { status: 400 })
    }

    // Get the version data
    const [versionRows] = await pool.execute(
      'SELECT * FROM page_versions WHERE id = ?',
      [version_id]
    )

    if (versionRows.length === 0) {
      return Response.json({
        success: false,
        error: 'Version not found'
      }, { status: 404 })
    }

    const version = versionRows[0]
    const layout = JSON.parse(version.layout)

    // Update the page with the version's layout
    await pool.execute(
      'UPDATE pages SET layout = ?, updated_at = NOW() WHERE id = ?',
      [JSON.stringify(layout), version.page_id]
    )

    return Response.json({
      success: true,
      layout,
      message: 'Version restored successfully'
    })

  } catch (error) {
    console.error('Error restoring version:', error)
    return Response.json({
      success: false,
      error: 'Failed to restore version'
    }, { status: 500 })
  }
}
