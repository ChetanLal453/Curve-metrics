import { unlink } from 'fs/promises'
import { join } from 'path'
import pool from '../../../lib/db.js'

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return Response.json({
        success: false,
        error: 'Media ID is required'
      }, { status: 400 })
    }

    // Get media info from database
    const [rows] = await pool.execute(
      'SELECT filename FROM media_library WHERE id = ?',
      [id]
    )

    if (rows.length === 0) {
      return Response.json({
        success: false,
        error: 'Media not found'
      }, { status: 404 })
    }

    const media = rows[0]

    // Delete file from disk
    try {
      const filePath = join(process.cwd(), 'admin', 'public', 'uploads', media.filename)
      await unlink(filePath)
    } catch (fileError) {
      console.warn('Could not delete file from disk:', fileError)
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await pool.execute('DELETE FROM media_library WHERE id = ?', [id])

    return Response.json({
      success: true,
      message: 'Media deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting media:', error)
    return Response.json({
      success: false,
      error: 'Failed to delete media'
    }, { status: 500 })
  }
}
