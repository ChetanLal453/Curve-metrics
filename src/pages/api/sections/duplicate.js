import db from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { sectionId, pageId, newName } = req.body

    if (!sectionId) {
      return res.status(400).json({ error: 'Section ID is required' })
    }

    // Get the original section
    const [originalSection] = await db.query(
      'SELECT * FROM sections WHERE id = ?',
      [sectionId]
    )

    if (originalSection.length === 0) {
      return res.status(404).json({ error: 'Section not found' })
    }

    const section = originalSection[0]

    // Determine target page
    const targetPageId = pageId || section.page_id

    // Get max sort order for the target page
    const [maxOrder] = await db.query(
      'SELECT MAX(sort_order) as maxOrder FROM sections WHERE page_id = ?',
      [targetPageId]
    )

    const newSortOrder = (maxOrder[0].maxOrder || 0) + 1

    // Create duplicate section
    const duplicateName = newName || `${section.name} (Copy)`
    const [result] = await db.query(
      'INSERT INTO sections (page_id, name, type, content, settings, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [
        targetPageId,
        duplicateName,
        section.type,
        section.content,
        section.settings,
        newSortOrder
      ]
    )

    res.status(201).json({
      message: 'Section duplicated successfully',
      sectionId: result.insertId,
      name: duplicateName,
      pageId: targetPageId
    })
  } catch (error) {
    console.error('Error duplicating section:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
