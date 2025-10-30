import pool from '../../../lib/db.js';

export async function POST(request) {
  try {
    const { page_id, layout } = await request.json();

    if (!page_id) {
      return Response.json({
        success: false,
        error: 'page_id is required'
      }, { status: 400 });
    }

    // Update the layout in the database
    await pool.execute(
      'UPDATE pages SET layout = ? WHERE id = ?',
      [JSON.stringify(layout), page_id]
    );

    return Response.json({
      success: true,
      message: 'Page layout saved successfully'
    });
  } catch (error) {
    console.error('Error saving page layout:', error);
    return Response.json({
      success: false,
      error: 'Failed to save page layout'
    }, { status: 500 });
  }
}
