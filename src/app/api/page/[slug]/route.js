import pool from '../../../../lib/db.js'
import { getExistingColumns } from '../../_utils/crud.js'

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

export async function GET(request, { params }) {
  try {
    const { slug } = params
    const columns = await getExistingColumns('pages')
    const selectFields = [
      'id',
      'slug',
      'title',
      'name',
      'status',
      'layout',
      columns.includes('published_layout') ? 'published_layout' : 'NULL AS published_layout',
      'header_slug',
      'footer_slug',
      'banner_slug',
      columns.includes('meta_title') ? 'meta_title' : 'NULL AS meta_title',
      columns.includes('meta_description') ? 'meta_description' : 'NULL AS meta_description',
      columns.includes('meta_image') ? 'meta_image' : 'NULL AS meta_image',
      columns.includes('published_at') ? 'published_at' : 'NULL AS published_at',
    ]

    const [pages] = await pool.execute(
      `SELECT ${selectFields.join(', ')} FROM pages WHERE slug = ? LIMIT 1`,
      [slug],
    )

    if (!pages.length) {
      return Response.json({ success: false, error: 'Page not found' }, { status: 404 })
    }

    const page = pages[0]
    const liveLayout = safeParseJson(page.published_layout, null) || safeParseJson(page.layout, null)
    const draftLayout = safeParseJson(page.layout, null)
    let formattedSections = Array.isArray(liveLayout?.sections)
      ? liveLayout.sections
      : Array.isArray(draftLayout?.sections)
        ? draftLayout.sections
        : null

    if (!formattedSections) {
      const [sections] = await pool.execute(
        `SELECT instance_id, section_type, props, responsive_props, style_props, accessibility_props, interactive_props,
                COALESCE(section_order, sort_order, 0) AS sort_order, is_active, parent_section_id, grid_id, row_id, col_id
         FROM sections
         WHERE page_id = ? AND (is_active IS NULL OR is_active = TRUE)
         ORDER BY COALESCE(section_order, sort_order, 0) ASC`,
        [page.id],
      )

      formattedSections = sections.map((section) => ({
        id: section.instance_id,
        type: section.section_type || 'unknown',
        sectionType: section.section_type || 'unknown',
        content: safeParseJson(section.props, {}),
        props: safeParseJson(section.props, {}),
        responsiveProps: safeParseJson(section.responsive_props, {}),
        styleProps: safeParseJson(section.style_props, {}),
        accessibilityProps: safeParseJson(section.accessibility_props, {}),
        interactiveProps: safeParseJson(section.interactive_props, {}),
        order: section.sort_order || 0,
        isActive: section.is_active === 1 || section.is_active === true || section.is_active == null,
        parentId: section.parent_section_id || null,
        gridId: section.grid_id || null,
        rowId: section.row_id || null,
        colId: section.col_id || null,
      }))
    }

    const resolvedLiveLayout = liveLayout || { sections: formattedSections }
    const resolvedDraftLayout = draftLayout || { sections: formattedSections }

    return Response.json({
      success: true,
      page: {
        id: page.id,
        slug: page.slug,
        title: page.title,
        name: page.name,
        status: page.status,
        header_slug: page.header_slug || null,
        footer_slug: page.footer_slug || null,
        banner_slug: page.banner_slug || null,
        meta_title: page.meta_title || null,
        meta_description: page.meta_description || null,
        meta_image: page.meta_image || null,
        published_at: page.published_at || null,
      },
      layout: resolvedLiveLayout,
      draft_layout: resolvedDraftLayout,
      published_layout: safeParseJson(page.published_layout, null),
      sections: formattedSections,
      oldFormat: formattedSections.map((section) => ({ type: section.type, content: section.content })),
    })
  } catch (error) {
    console.error('DB ERROR:', error)
    return Response.json({ success: false, error: 'Database error' }, { status: 500 })
  }
}
