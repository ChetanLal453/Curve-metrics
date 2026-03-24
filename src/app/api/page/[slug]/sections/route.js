import { randomUUID } from 'crypto'
import { getPageLayoutRecord, saveLayoutForPage } from '../../../../../lib/layout-sync.js'
import { requireAdmin } from '../../../../../lib/require-admin.js'

function cloneSection(section) {
  return JSON.parse(JSON.stringify(section))
}

function findSectionIndex(sections, sectionId) {
  return sections.findIndex((section) => String(section.id) === String(sectionId))
}

function buildSection(section, index = null) {
  return {
    id: section.id || randomUUID(),
    name: section.name || section.title || (index != null ? `Section ${index + 1}` : 'Section'),
    type: section.type || 'custom',
    props: section.props ?? section.content ?? {},
    content: section.content ?? section.props ?? {},
    container: section.container || {
      id: `container-${randomUUID()}`,
      rows: [],
    },
    styleProps: section.styleProps ?? {},
    responsiveProps: section.responsiveProps ?? {},
    accessibilityProps: section.accessibilityProps ?? {},
    interactiveProps: section.interactiveProps ?? {},
    stickyEnabled: Boolean(section.stickyEnabled ?? section.sticky_enabled ?? false),
    stickyColumnIndex: section.stickyColumnIndex ?? section.sticky_column_index ?? null,
    stickyPosition: section.stickyPosition ?? section.sticky_position ?? null,
    stickyOffset: section.stickyOffset ?? section.sticky_offset ?? 0,
  }
}

export async function GET(_request, { params }) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  try {
    const record = await getPageLayoutRecord({ slug: params.slug })
    if (!record) {
      return Response.json({ error: 'Page not found' }, { status: 404 })
    }

    const sections = Array.isArray(record.layout.sections) ? record.layout.sections : []
    return Response.json({
      success: true,
      pageId: record.page.id,
      slug: params.slug,
      sections,
      count: sections.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return Response.json({ error: 'Server error', message: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  try {
    const record = await getPageLayoutRecord({ slug: params.slug })
    if (!record) {
      return Response.json({ error: 'Page not found' }, { status: 404 })
    }

    const { sectionId, stickyEnabled, stickyColumnIndex, stickyPosition, stickyOffset } = await request.json()
    if (!sectionId) {
      return Response.json({ error: 'sectionId is required' }, { status: 400 })
    }

    const sections = [...record.layout.sections]
    const sectionIndex = findSectionIndex(sections, sectionId)
    if (sectionIndex === -1) {
      return Response.json({ error: 'Section not found' }, { status: 404 })
    }

    const current = cloneSection(sections[sectionIndex])
    sections[sectionIndex] = {
      ...current,
      stickyEnabled: stickyEnabled ?? current.stickyEnabled ?? false,
      stickyColumnIndex: stickyColumnIndex ?? current.stickyColumnIndex ?? null,
      stickyPosition: stickyPosition ?? current.stickyPosition ?? null,
      stickyOffset: stickyOffset ?? current.stickyOffset ?? 0,
    }

    const layout = { ...record.layout, sections }
    await saveLayoutForPage({
      pageId: record.page.id,
      layout,
      pageName: layout.name,
    })

    return Response.json({ success: true, message: 'Sticky settings updated successfully', section: sections[sectionIndex] })
  } catch (error) {
    return Response.json({ error: 'Server error', message: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  try {
    const record = await getPageLayoutRecord({ slug: params.slug })
    if (!record) {
      return Response.json({ error: 'Page not found' }, { status: 404 })
    }

    const body = await request.json()
    const action = body.action || 'toggleSticky'

    if (action === 'create') {
      const sections = [...record.layout.sections]
      const insertIndex = Number.isInteger(body.index) ? body.index : sections.length
      const nextSection = buildSection(body.section || {}, insertIndex)
      sections.splice(Math.max(0, Math.min(insertIndex, sections.length)), 0, nextSection)

      const layout = { ...record.layout, sections }
      await saveLayoutForPage({
        pageId: record.page.id,
        layout,
        pageName: layout.name,
      })

      return Response.json({ success: true, section: nextSection, sections, count: sections.length })
    }

    if (action === 'move') {
      const { sectionId, targetPageId, targetPageSlug, newSortOrder } = body
      if (!sectionId || (!targetPageId && !targetPageSlug)) {
        return Response.json({ error: 'sectionId and target page are required' }, { status: 400 })
      }

      const sourceSections = [...record.layout.sections]
      const sourceIndex = findSectionIndex(sourceSections, sectionId)
      if (sourceIndex === -1) {
        return Response.json({ error: 'Section not found' }, { status: 404 })
      }

      const [section] = sourceSections.splice(sourceIndex, 1)
      const targetRecord =
        targetPageId && Number(targetPageId) === Number(record.page.id)
          ? record
          : await getPageLayoutRecord(targetPageId ? { pageId: targetPageId } : { slug: targetPageSlug })

      if (!targetRecord) {
        return Response.json({ error: 'Target page not found' }, { status: 404 })
      }

      const targetSections =
        Number(targetRecord.page.id) === Number(record.page.id) ? sourceSections : [...targetRecord.layout.sections]
      const insertIndex = Number.isInteger(newSortOrder) ? newSortOrder : targetSections.length
      targetSections.splice(Math.max(0, Math.min(insertIndex, targetSections.length)), 0, section)

      await saveLayoutForPage({
        pageId: record.page.id,
        layout: { ...record.layout, sections: sourceSections },
        pageName: record.layout.name,
      })

      if (Number(targetRecord.page.id) !== Number(record.page.id)) {
        await saveLayoutForPage({
          pageId: targetRecord.page.id,
          layout: { ...targetRecord.layout, sections: targetSections },
          pageName: targetRecord.layout.name,
        })
      }

      return Response.json({ success: true, message: 'Section moved successfully', sectionId, newPageId: targetRecord.page.id, newSortOrder: insertIndex })
    }

    const { sectionId, columnIndex = 0 } = body
    if (!sectionId) {
      return Response.json({ error: 'sectionId is required' }, { status: 400 })
    }

    const sections = [...record.layout.sections]
    const sectionIndex = findSectionIndex(sections, sectionId)
    if (sectionIndex === -1) {
      return Response.json({ error: 'Section not found' }, { status: 404 })
    }

    const current = cloneSection(sections[sectionIndex])
    const stickyEnabled = !(current.stickyEnabled && current.stickyColumnIndex === columnIndex)

    sections[sectionIndex] = {
      ...current,
      stickyEnabled,
      stickyColumnIndex: stickyEnabled ? columnIndex : 0,
    }

    const layout = { ...record.layout, sections }
    await saveLayoutForPage({
      pageId: record.page.id,
      layout,
      pageName: layout.name,
    })

    return Response.json({ success: true, data: { sectionId, stickyEnabled, stickyColumnIndex: sections[sectionIndex].stickyColumnIndex } })
  } catch (error) {
    return Response.json({ error: 'Server error', message: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  try {
    const record = await getPageLayoutRecord({ slug: params.slug })
    if (!record) {
      return Response.json({ error: 'Page not found' }, { status: 404 })
    }

    const body = await request.json()
    const sections = [...record.layout.sections]

    if (Array.isArray(body.sections)) {
      const nextSections = body.sections.map((section, index) => buildSection(section, index))
      const layout = { ...record.layout, sections: nextSections }
      await saveLayoutForPage({
        pageId: record.page.id,
        layout,
        pageName: layout.name,
      })

      return Response.json({ success: true, message: 'Sections updated successfully', count: nextSections.length, sections: nextSections })
    }

    const { sectionId, updates } = body
    if (!sectionId || !updates) {
      return Response.json({ error: 'sectionId and updates are required' }, { status: 400 })
    }

    const sectionIndex = findSectionIndex(sections, sectionId)
    if (sectionIndex === -1) {
      return Response.json({ error: 'Section not found' }, { status: 404 })
    }

    sections[sectionIndex] = {
      ...cloneSection(sections[sectionIndex]),
      ...updates,
    }

    if (updates.section_order !== undefined || updates.sort_order !== undefined) {
      const targetIndex = updates.section_order ?? updates.sort_order
      const [moved] = sections.splice(sectionIndex, 1)
      sections.splice(Math.max(0, Math.min(targetIndex, sections.length)), 0, moved)
    }

    const layout = { ...record.layout, sections }
    await saveLayoutForPage({
      pageId: record.page.id,
      layout,
      pageName: layout.name,
    })

    return Response.json({ success: true, message: 'Section updated successfully', section: sections.find((section) => String(section.id) === String(sectionId)) || null })
  } catch (error) {
    return Response.json({ error: 'Server error', message: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  try {
    const record = await getPageLayoutRecord({ slug: params.slug })
    if (!record) {
      return Response.json({ error: 'Page not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const sectionId = searchParams.get('sectionId')

    if (!sectionId) {
      return Response.json({ error: 'Section ID is required' }, { status: 400 })
    }

    const sections = record.layout.sections.filter((section) => String(section.id) !== String(sectionId))
    if (sections.length === record.layout.sections.length) {
      return Response.json({ error: 'Section not found' }, { status: 404 })
    }

    const layout = { ...record.layout, sections }
    await saveLayoutForPage({
      pageId: record.page.id,
      layout,
      pageName: layout.name,
    })

    return Response.json({ success: true, message: 'Section deleted successfully' })
  } catch (error) {
    return Response.json({ error: 'Server error', message: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
