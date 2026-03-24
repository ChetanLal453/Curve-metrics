import { normalizeLayout, saveLayoutForPage } from '../../../lib/layout-sync.js'
import { requireAdmin } from '../../../lib/require-admin.js'

export async function POST(request) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  try {
    const data = await request.json()
    const pageId = data.page_id
    const layout = normalizeLayout(data.layout || data, { id: pageId, name: data.name })

    if (!pageId) {
      return Response.json({ success: false, error: 'page_id required' }, { status: 400 })
    }

    const syncResult = await saveLayoutForPage({
      pageId,
      layout,
      pageName: layout.name || data.name || '',
    })

    return Response.json({
      success: true,
      message: 'Page layout saved successfully',
      layout,
      page_id: pageId,
      sections_count: Array.isArray(layout.sections) ? layout.sections.length : 0,
      components_count: Array.isArray(layout.sections)
        ? layout.sections.reduce((total, section) => {
            if (!section?.container?.rows) {
              return total
            }

            return (
              total +
              section.container.rows.reduce(
                (rowTotal, row) =>
                  rowTotal +
                  (Array.isArray(row?.columns)
                    ? row.columns.reduce(
                        (columnTotal, column) => columnTotal + (Array.isArray(column?.components) ? column.components.length : 0),
                        0,
                      )
                    : 0),
                0,
              )
            )
          }, 0)
        : 0,
      synced_sections: syncResult.count,
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save layout',
      },
      { status: 500 },
    )
  }
}
