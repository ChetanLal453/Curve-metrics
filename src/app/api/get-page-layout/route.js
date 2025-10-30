import pool from '../../../lib/db.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get('page_id');

  if (!pageId) {
    return Response.json({
      success: false,
      error: 'page_id parameter is required'
    }, { status: 400 });
  }

  try {
    // First try to get the layout from the pages.layout field
    const [pages] = await pool.execute(
      'SELECT * FROM pages WHERE id = ?',
      [pageId]
    );

    let layoutJson = null;
    if (pages.length > 0) {
      if (pages[0].layout) {
        layoutJson = pages[0].layout;
      }
    }

    if (layoutJson) {
      try {
        const layout = JSON.parse(layoutJson);
        return Response.json({
          success: true,
          layout: layout
        });
      } catch (parseError) {
        // Invalid JSON, fall back to sections conversion
      }
    }

    // If no layout in pages.layout, convert sections to layout
    const [sections] = await pool.execute(
      'SELECT section_type, content, `order` FROM sections WHERE page_id = ? AND enabled = 1 ORDER BY `order`',
      [pageId]
    );

    // Convert sections to PageLayout format
    const layout = {
      id: `page-${pageId}`,
      name: 'Page Layout',
      sections: sections.map((sec, index) => ({
        id: `section-${pageId}-${index}`,
        name: sec.section_type,
        type: 'custom',
        container: {
          id: `container-${pageId}-${index}`,
          rows: [{
            id: `row-${pageId}-${index}`,
            columns: [{
              id: `col-${pageId}-${index}`,
              width: 100,
              components: [{
                id: `comp-${pageId}-${sec.section_type}-${index}`,
                type: 'section',
                label: sec.section_type,
                props: {
                  type: sec.section_type,
                  content: sec.content
                }
              }]
            }]
          }]
        }
      }))
    };

    return Response.json({
      success: true,
      layout: layout
    });
  } catch (error) {
    console.error('Error fetching page layout:', error);
    return Response.json({
      success: false,
      error: 'Failed to fetch page layout'
    }, { status: 500 });
  }
}
