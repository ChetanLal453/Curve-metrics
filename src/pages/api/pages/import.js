import db from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { importData, newName } = req.body

    if (!importData || !importData.page || !importData.sections) {
      return res.status(400).json({ error: 'Invalid import data' })
    }

    const pageData = importData.page
    const sectionsData = importData.sections

    // Create new page
    const pageName = newName || `${pageData.name} (Imported)`
    const [pageResult] = await db.query(
      'INSERT INTO pages (name, slug, layout, settings, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [
        pageName,
        `${pageData.slug}-imported-${Date.now()}`,
        JSON.stringify({}),
        JSON.stringify(pageData.settings || {})
      ]
    )

    const newPageId = pageResult.insertId

    // Import sections
    for (const section of sectionsData) {
      await db.query(
        'INSERT INTO sections (page_id, name, type, content, settings, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [
          newPageId,
          section.name,
          section.type,
          JSON.stringify(section.content || {}),
          JSON.stringify(section.settings || {}),
          section.sortOrder || 0
        ]
      )
    }

    res.status(201).json({
      message: 'Page imported successfully',
      pageId: newPageId,
      name: pageName,
      sectionsCount: sectionsData.length
    })
  } catch (error) {
    console.error('Error importing page:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
