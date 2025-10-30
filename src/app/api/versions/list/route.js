import pool from '../../../lib/db.js'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('page_id')

    if (!pageId) {
      return Response.json({
        success: false,
        error: 'page_id is required'
      }, { status: 400 })
    }

    const [rows] = await pool.execute(
      'SELECT id, page_id, version_number, name, description, created_by, created_at FROM page_versions WHERE page_id = ? ORDER BY version_number DESC',
      [pageId]
    )

    return Response.json({
      success: true,
      versions: rows
    })

  } catch (error) {
    console.error('Error fetching versions:', error)
    return Response.json({
      success: false,
      error: 'Failed to fetch versions'
    }, { status: 500 })
  }
}
