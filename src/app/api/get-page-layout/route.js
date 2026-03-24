import pool from '../../../lib/db.js'
import { normalizeLayout } from '../../../lib/layout-sync.js'
import { requireAdmin } from '../../../lib/require-admin.js'

function safeParseJson(value, fallback) {
  if (value == null || value === '') return fallback
  if (typeof value === 'object' && !Buffer.isBuffer(value)) return value

  try {
    const raw = Buffer.isBuffer(value) ? value.toString('utf8') : value
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export async function GET(request) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  try {
    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('page_id')
    const slug = searchParams.get('slug')

    if (!pageId && !slug) {
      return Response.json({ success: false, error: 'page_id or slug is required' }, { status: 400 })
    }

    const [pages] = pageId
      ? await pool.execute('SELECT id, slug, title, name, layout FROM pages WHERE id = ? LIMIT 1', [pageId])
      : await pool.execute('SELECT id, slug, title, name, layout FROM pages WHERE slug = ? LIMIT 1', [slug])

    if (!pages.length) {
      return Response.json({ success: false, error: 'Page not found' }, { status: 404 })
    }

    const page = pages[0]
    const layout = normalizeLayout(safeParseJson(page.layout, null), page)

    return Response.json({
      success: true,
      page: {
        id: page.id,
        slug: page.slug || `page-${page.id}`,
        title: page.title || page.name,
        name: page.name || page.title,
      },
      layout,
      sections: Array.isArray(layout.sections) ? layout.sections : [],
      count: Array.isArray(layout.sections) ? layout.sections.length : 0,
    })
  } catch (error) {
    console.error('Error in get-page-layout:', error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get page layout',
      },
      { status: 500 },
    )
  }
}
