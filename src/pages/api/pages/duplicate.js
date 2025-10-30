import db from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { pageId, newName } = req.body

    if (!pageId) {
      return res.status(400).json({ error: 'Page ID is required' })
    }

    // Get the original page
    const [originalPage] = await db.query(
      'SELECT * FROM pages WHERE id = ?',
      [pageId]
    )

    if (originalPage.length === 0) {
      return res.status(404).json({ error: 'Page not found' })
    }

    const page = originalPage[0]

    // Create duplicate page
    const duplicateName = newName || `${page.name} (Copy)`
    const [result] = await db.query(
      'INSERT INTO pages (name, slug, layout, settings, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [
        duplicateName,
        `${page.slug}-copy-${Date.now()}`,
        page.layout,
        page.settings
      ]
    )

    const newPageId = result.insertId

    // Duplicate sections
    const [sections] = await db.query(
      'SELECT * FROM sections WHERE page_id = ?',
      [pageId]
    )

    for (const section of sections) {
      await db.query(
        'INSERT INTO sections (page_id, name, type, content, settings, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [
          newPageId,
          section.name,
          section.type,
          section.content,
          section.settings,
          section.sort_order
        ]
      )
    }

    res.status(201).json({
      message: 'Page duplicated successfully',
      pageId: newPageId,
      name: duplicateName
    })
  } catch (error) {
    console.error('Error duplicating page:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
