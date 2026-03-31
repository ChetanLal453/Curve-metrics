import pool from '../../../../lib/db.js'
import { getExistingColumns, tableExists } from '../../_utils/crud.js'

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

    if (!Array.isArray(formattedSections) || formattedSections.length === 0) {
      if (await tableExists('sections')) {
        const sectionColumns = await getExistingColumns('sections')
        const hasPageId = sectionColumns.includes('page_id')

        if (hasPageId) {
          const [sections] = await pool.execute(
            `SELECT * FROM sections WHERE page_id = ?`,
            [page.id],
          )

          const mappedSections = sections
            .filter((section) => section?.is_active === 1 || section?.is_active === true || section?.is_active == null)
            .map((section, index) => ({
              id: section.instance_id || section.id || `section-${index + 1}`,
              type: section.section_type || section.type || 'unknown',
              sectionType: section.section_type || section.type || 'unknown',
              content: safeParseJson(section.props ?? section.content, {}),
              props: safeParseJson(section.props ?? section.content, {}),
              responsiveProps: safeParseJson(section.responsive_props, {}),
              styleProps: safeParseJson(section.style_props, {}),
              accessibilityProps: safeParseJson(section.accessibility_props, {}),
              interactiveProps: safeParseJson(section.interactive_props, {}),
              order: Number(section.section_order ?? section.sort_order ?? 0),
              isActive: section.is_active === 1 || section.is_active === true || section.is_active == null,
              parentId: section.parent_section_id || section.parent_id || null,
              gridId: section.grid_id || null,
              rowId: section.row_id || null,
              colId: section.col_id || null,
            }))

          formattedSections = mappedSections.sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
        } else {
          formattedSections = []
        }
      } else {
        formattedSections = []
      }
    }

    let resolvedLiveLayout =
      liveLayout && Array.isArray(liveLayout.sections) && liveLayout.sections.length > 0
        ? liveLayout
        : { ...(liveLayout || {}), sections: formattedSections }
    let resolvedDraftLayout =
      draftLayout && Array.isArray(draftLayout.sections) && draftLayout.sections.length > 0
        ? draftLayout
        : { ...(draftLayout || {}), sections: formattedSections }

    const resolvedSections =
      Array.isArray(resolvedDraftLayout?.sections) ? resolvedDraftLayout.sections : Array.isArray(resolvedLiveLayout?.sections) ? resolvedLiveLayout.sections : []

    if (resolvedSections.length === 0 && (await tableExists('page_versions'))) {
      const versionColumns = await getExistingColumns('page_versions')
      if (versionColumns.includes('page_id')) {
        const selectLayoutExpr = versionColumns.includes('layout')
          ? 'layout'
          : versionColumns.includes('content')
            ? 'content AS layout'
            : 'NULL AS layout'
        const selectContentExpr = versionColumns.includes('content')
          ? 'content'
          : versionColumns.includes('layout')
            ? 'layout AS content'
            : 'NULL AS content'
        const orderBy =
          versionColumns.includes('version_number') && versionColumns.includes('created_at')
            ? 'ORDER BY version_number DESC, created_at DESC'
            : versionColumns.includes('version_number')
              ? 'ORDER BY version_number DESC'
              : versionColumns.includes('created_at')
                ? 'ORDER BY created_at DESC'
                : ''

        const [versionRows] = await pool.execute(
          `SELECT ${selectLayoutExpr}, ${selectContentExpr}
           FROM page_versions
           WHERE page_id = ?
           ${orderBy}
           LIMIT 1`,
          [page.id],
        )

        if (Array.isArray(versionRows) && versionRows.length > 0) {
          const recoveredLayout = safeParseJson(versionRows[0].layout ?? versionRows[0].content, null)
          if (Array.isArray(recoveredLayout?.sections) && recoveredLayout.sections.length > 0) {
            resolvedLiveLayout = {
              ...recoveredLayout,
              id: String(page.id),
              name: recoveredLayout.name || page.name || page.title || 'Untitled Page',
            }
            resolvedDraftLayout = {
              ...recoveredLayout,
              id: String(page.id),
              name: recoveredLayout.name || page.name || page.title || 'Untitled Page',
            }
            formattedSections = recoveredLayout.sections
          }
        }
      }
    }

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
