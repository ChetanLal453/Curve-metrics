import pool from '../../../lib/db.js';

export async function GET() {
  try {
    const [pages] = await pool.execute('SELECT id FROM pages WHERE slug = ?', ['home']);
    if (pages.length === 0) return Response.json([]);

    const pageId = pages[0].id;
    const [sections] = await pool.execute('SELECT content FROM sections WHERE page_id = ? AND section_type = ? AND enabled = 1 ORDER BY `order` LIMIT 1', [pageId, 'choose']);

    if (sections.length === 0) return Response.json([]);

    const content = JSON.parse(sections[0].content);
    return Response.json(content.services || []);
  } catch (error) {
    console.error(error);
    return Response.json([]);
  }
}
