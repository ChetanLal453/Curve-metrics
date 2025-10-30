import pool from '../../../lib/db.js';

export async function GET() {
  try {
    const [pages] = await pool.execute('SELECT id FROM pages WHERE slug = ?', ['home']);
    if (pages.length === 0) return Response.json({ error: 'Page not found' }, { status: 404 });

    const pageId = pages[0].id;
    const [sections] = await pool.execute('SELECT content FROM sections WHERE page_id = ? AND section_type = ? AND enabled = 1 ORDER BY `order` LIMIT 1', [pageId, 'banner']);

    if (sections.length === 0) return Response.json({});

    return Response.json(JSON.parse(sections[0].content));
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
