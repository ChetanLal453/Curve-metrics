import db from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { sections } = req.body

    if (!Array.isArray(sections) || sections.length === 0) {
      return res.status(400).json({ error: 'Sections array is required' })
    }

    // Update each section
    for (const section of sections) {
      if (!section.id) continue

      await db.query(
        'UPDATE sections SET name = ?, type = ?, content = ?, settings = ?, sort_order = ?, updated_at = NOW() WHERE id = ?',
        [
          section.name,
          section.type,
          JSON.stringify(section.content || {}),
          JSON.stringify(section.settings || {}),
          section.sortOrder || 0,
          section.id
        ]
      )
    }

    res.status(200).json({
      message: 'Sections updated successfully',
      count: sections.length
    })
  } catch (error) {
    console.error('Error bulk updating sections:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
