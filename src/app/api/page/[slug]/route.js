import pool from '../../../../lib/db.js';

export async function GET(request, { params }) {
  const { slug } = params;
  try {
    const [pages] = await pool.execute('SELECT id FROM pages WHERE slug = ?', [slug]);
    if (pages.length === 0) return Response.json({ error: 'Page not found' }, { status: 404 });

    const pageId = pages[0].id;
    const [sections] = await pool.execute('SELECT section_type, content FROM sections WHERE page_id = ? AND enabled = 1 ORDER BY `order`', [pageId]);

    const data = sections.map(sec => ({
      type: sec.section_type,
      content: JSON.parse(sec.content)
    }));

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
