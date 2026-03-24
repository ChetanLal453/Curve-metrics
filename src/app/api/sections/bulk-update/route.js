import { getPageLayoutRecord, saveLayoutForPage } from '../../../../lib/layout-sync.js'
import { requireAdmin } from '../../../../lib/require-admin.js'

export async function PUT(request) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  try {
    const { pageId, slug, sections } = await request.json()

    if (!Array.isArray(sections) || sections.length === 0) {
      return Response.json({ success: false, error: 'Sections array is required' }, { status: 400 })
    }

    const record = await getPageLayoutRecord(pageId ? { pageId } : { slug })
    if (!record) {
      return Response.json({ success: false, error: 'Page not found' }, { status: 404 })
    }

    const layout = {
      ...record.layout,
      sections,
    }

    await saveLayoutForPage({
      pageId: record.page.id,
      layout,
      pageName: layout.name,
    })

    return Response.json({
      success: true,
      message: 'Sections updated successfully',
      count: sections.length,
    })
  } catch (error) {
    console.error('Error bulk updating sections:', error)
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
