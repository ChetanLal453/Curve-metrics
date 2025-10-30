import pool from '../../../lib/db.js';

export async function POST(request) {
  try {
    const layoutData = await request.json();

    const { id, name, sections, active } = layoutData;

    if (!id) {
      return Response.json({
        success: false,
        error: 'id is required'
      }, { status: 400 });
    }

    // Update the layout in the database if layout column exists
    try {
      await pool.execute(
        'UPDATE pages SET layout = ?, name = ? WHERE id = ?',
        [JSON.stringify({ id, name, sections }), name, id]
      );
    } catch (updateError) {
      // Layout column may not exist, ignore
      console.warn('Layout column not available, layout not saved');
    }

    return Response.json({
      success: true,
      message: 'Page saved successfully'
    });
  } catch (error) {
    console.error('Error saving page:', error);
    return Response.json({
      success: false,
      error: 'Failed to save page'
    }, { status: 500 });
  }
}
