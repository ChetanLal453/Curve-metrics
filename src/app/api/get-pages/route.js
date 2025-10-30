import pool from '../../../lib/db.js';

export async function GET() {
  try {
    // Try to select with disabled column first
    let query = 'SELECT id, slug, title FROM pages ORDER BY title';
    let pages;

    try {
      [pages] = await pool.execute(
        'SELECT id, slug, title, disabled FROM pages ORDER BY title'
      );
    } catch (columnError) {
      // If disabled column doesn't exist, select without it
      [pages] = await pool.execute(query);
      // Add disabled: false to each page
      pages = pages.map(page => ({ ...page, disabled: false }));
    }

    return Response.json({
      success: true,
      pages: pages
    });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return Response.json({
      success: false,
      error: 'Failed to fetch pages'
    }, { status: 500 });
  }
}
