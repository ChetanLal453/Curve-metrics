import pool from '../../../lib/db.js'

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return Response.json({
        success: false,
        error: 'Template ID is required'
      }, { status: 400 })
    }

    // Check if template exists
    const [rows] = await pool.execute(
      'SELECT id FROM custom_templates WHERE id = ?',
      [id]
    )

    if (rows.length === 0) {
      return Response.json({
        success: false,
        error: 'Template not found'
      }, { status: 404 })
    }

    // Delete template
    await pool.execute('DELETE FROM custom_templates WHERE id = ?', [id])

    return Response.json({
      success: true,
      message: 'Template deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting template:', error)
    return Response.json({
      success: false,
      error: 'Failed to delete template'
    }, { status: 500 })
  }
}
