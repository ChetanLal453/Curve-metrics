import pool from '../../../../../lib/db.js';

export async function POST(request, { params }) {
  const { page_id } = params;
  try {
    const body = await request.text();
    let data;
    try {
      data = JSON.parse(body);
    } catch (e) {
      return Response.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
    }
    const { disabled } = data;

    if (typeof disabled !== 'boolean') {
      return Response.json({ success: false, error: 'disabled must be boolean' }, { status: 400 });
    }

    // Check if page exists and is not critical
    const [pages] = await pool.execute('SELECT slug FROM pages WHERE id = ?', [page_id]);
    if (pages.length === 0) {
      return Response.json({ success: false, error: 'Page not found' }, { status: 404 });
    }

    const page = pages[0];
    if (page.slug === 'home') {
      return Response.json({ success: false, error: 'Cannot disable home page' }, { status: 403 });
    }

    // Update the disabled status - handle if column doesn't exist yet
    try {
      await pool.execute('UPDATE pages SET disabled = ? WHERE id = ?', [disabled, page_id]);
    } catch (columnError) {
      // If disabled column doesn't exist, return error asking for migration
      return Response.json({
        success: false,
        error: 'Database migration required: ALTER TABLE pages ADD COLUMN disabled BOOLEAN DEFAULT FALSE;'
      }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error updating page status:', error);
    return Response.json({ success: false, error: 'Failed to update page status' }, { status: 500 });
  }
}
