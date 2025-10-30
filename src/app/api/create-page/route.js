import pool from '../../../lib/db.js';
import { randomUUID } from 'crypto';

export async function POST(request) {
  try {
    const body = await request.text();
    let data;
    try {
      data = JSON.parse(body);
    } catch (e) {
      return Response.json({
        success: false,
        error: 'Invalid JSON in request body'
      }, { status: 400 });
    }
    const { name } = data;

    if (!name) {
      return Response.json({
        success: false,
        error: 'name is required'
      }, { status: 400 });
    }

    // Generate unique slug from name
    let slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    let counter = 1;
    let originalSlug = slug;
    while (true) {
      const [existing] = await pool.execute('SELECT id FROM pages WHERE slug = ?', [slug]);
      if (existing.length === 0) break;
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    // Generate UUID for layout
    const layoutId = randomUUID();

    // Create initial layout
    const initialLayout = {
      id: layoutId,
      name: name,
      sections: []
    };

    // Insert new page with layout
    const [result] = await pool.execute(
      'INSERT INTO pages (slug, title, name, layout) VALUES (?, ?, ?, ?)',
      [slug, name, name, JSON.stringify(initialLayout)]
    );

    const pageId = result.insertId;

    return Response.json({
      success: true,
      page: {
        id: pageId,
        name: name,
        slug: slug,
        layout: initialLayout
      }
    });
  } catch (error) {
    console.error('Error creating page:', error);
    return Response.json({
      success: false,
      error: error.message || 'Failed to create page'
    }, { status: 500 });
  }
}
