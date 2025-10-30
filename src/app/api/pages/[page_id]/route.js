import pool from '../../../../lib/db.js';

export async function DELETE(request, { params }) {
  const { page_id } = params;
  try {
    // Check if page exists and is not critical
    const [pages] = await pool.execute('SELECT slug FROM pages WHERE id = ?', [page_id]);
    if (pages.length === 0) {
      return Response.json({ success: false, error: 'Page not found' }, { status: 404 });
    }

    const page = pages[0];
    if (page.slug === 'home') {
      return Response.json({ success: false, error: 'Cannot delete home page' }, { status: 403 });
    }

    // Delete the page
    await pool.execute('DELETE FROM pages WHERE id = ?', [page_id]);

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    return Response.json({ success: false, error: 'Failed to delete page' }, { status: 500 });
  }
}
