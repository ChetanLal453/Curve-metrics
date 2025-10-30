import db from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { pageId, format = 'json' } = req.body

    if (!pageId) {
      return res.status(400).json({ error: 'Page ID is required' })
    }

    // Get the page
    const [pageRows] = await db.query(
      'SELECT * FROM pages WHERE id = ?',
      [pageId]
    )

    if (pageRows.length === 0) {
      return res.status(404).json({ error: 'Page not found' })
    }

    const page = pageRows[0]

    // Get sections
    const [sections] = await db.query(
      'SELECT * FROM sections WHERE page_id = ? ORDER BY sort_order',
      [pageId]
    )

    const exportData = {
      page: {
        id: page.id,
        name: page.name,
        slug: page.slug,
        settings: JSON.parse(page.settings || '{}'),
        exportedAt: new Date().toISOString()
      },
      sections: sections.map(section => ({
        id: section.id,
        name: section.name,
        type: section.type,
        content: JSON.parse(section.content || '{}'),
        settings: JSON.parse(section.settings || '{}'),
        sortOrder: section.sort_order
      }))
    }

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Disposition', `attachment; filename="${page.slug}-export.json"`)
      res.status(200).json(exportData)
    } else {
      // For other formats, you could implement CSV, XML, etc.
      res.status(400).json({ error: 'Unsupported export format' })
    }
  } catch (error) {
    console.error('Error exporting page:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
