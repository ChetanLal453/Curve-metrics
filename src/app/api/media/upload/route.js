import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import pool from '../../../lib/db.js'
import { randomUUID } from 'crypto'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files')

    if (!files || files.length === 0) {
      return Response.json({
        success: false,
        error: 'No files provided'
      }, { status: 400 })
    }

    const uploaded = []

    for (const file of files) {
      if (!(file instanceof File)) {
        continue
      }

      // Generate unique filename
      const fileExtension = file.name.split('.').pop()
      const uniqueName = `${randomUUID()}.${fileExtension}`
      const uploadDir = join(process.cwd(), 'admin', 'public', 'uploads')

      // Ensure upload directory exists
      try {
        await mkdir(uploadDir, { recursive: true })
      } catch (error) {
        // Directory might already exist
      }

      const filePath = join(uploadDir, uniqueName)
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Save file to disk
      await writeFile(filePath, buffer)

      // Save to database
      const [result] = await pool.execute(
        'INSERT INTO media_library (filename, original_filename, url, type, size, uploaded_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [
          uniqueName,
          file.name,
          `/uploads/${uniqueName}`,
          file.type,
          file.size
        ]
      )

      uploaded.push({
        id: result.insertId,
        filename: uniqueName,
        original_filename: file.name,
        url: `/uploads/${uniqueName}`,
        type: file.type,
        size: file.size,
        uploaded_at: new Date().toISOString()
      })
    }

    return Response.json({
      success: true,
      uploaded,
      message: `Successfully uploaded ${uploaded.length} file(s)`
    })

  } catch (error) {
    console.error('Error uploading media:', error)
    return Response.json({
      success: false,
      error: 'Failed to upload media'
    }, { status: 500 })
  }
}
