import { normalizeLayout, saveLayoutForPage } from '../../../lib/layout-sync.js'
import { requireAdmin } from '../../../lib/require-admin.js'

export async function POST(request) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  try {
    const payload = await request.json()
    const { id, name, sections = [], active } = payload

    if (!id) {
      return Response.json({ success: false, error: 'id is required' }, { status: 400 })
    }

    const layout = normalizeLayout({ id, name, sections }, { id, name })
    await saveLayoutForPage({
      pageId: id,
      layout,
      pageName: name || '',
      extraPageFields: active === undefined ? {} : { active },
    })

    return Response.json({
      success: true,
      message: 'Page saved successfully',
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save page',
      },
      { status: 500 },
    )
  }
}
