import db from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { sectionId, newPageId, newSortOrder } = req.body

    if (!sectionId || !newPageId) {
      return res.status(400).json({ error: 'Section ID and new page ID are required' })
    }

    // Check if section exists
    const [sectionRows] = await db.query(
      'SELECT * FROM sections WHERE id = ?',
      [sectionId]
    )

    if (sectionRows.length === 0) {
      return res.status(404).json({ error: 'Section not found' })
    }

    // Check if target page exists
    const [pageRows] = await db.query(
      'SELECT id FROM pages WHERE id = ?',
      [newPageId]
    )

    if (pageRows.length === 0) {
      return res.status(404).json({ error: 'Target page not found' })
    }

    // Update section's page and sort order
    const sortOrder = newSortOrder !== undefined ? newSortOrder : 0

    await db.query(
      'UPDATE sections SET page_id = ?, sort_order = ?, updated_at = NOW() WHERE id = ?',
      [newPageId, sortOrder, sectionId]
    )

    // Reorder other sections in the target page if sort order was specified
    if (newSortOrder !== undefined) {
      // Move other sections down
      await db.query(
        'UPDATE sections SET sort_order = sort_order + 1 WHERE page_id = ? AND id != ? AND sort_order >= ?',
        [newPageId, sectionId, sortOrder]
      )
    }

    res.status(200).json({
      message: 'Section moved successfully',
      sectionId,
      newPageId,
      newSortOrder: sortOrder
    })
  } catch (error) {
    console.error('Error moving section:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
