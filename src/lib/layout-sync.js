import { randomUUID } from 'crypto'
import pool from './db.js'
import { getExistingColumns, parseJsonValue, tableExists } from '../app/api/_utils/crud.js'
import { sanitizeSectionProps, validateSectionProps } from './sectionSchemas.js'
import { clearPublicPageBundleCache } from './public-page-cache.js'

export function normalizeLayout(layout, page = {}) {
  const parsed = parseJsonValue(layout, null)
  const baseLayout = parsed && typeof parsed === 'object' ? parsed : {}
  const rawSections = Array.isArray(baseLayout.sections) ? baseLayout.sections : []
  const sections = rawSections.map((section, index) => {
    const rawColumns = Array.isArray(section?.container?.rows?.[0]?.columns)
      ? section.container.rows[0].columns
      : Array.isArray(section?.columns)
        ? section.columns
        : []
    const columns =
      rawColumns.length > 0
        ? rawColumns.map((column, columnIndex) => ({
            id: column?.id || `col-${index + 1}-${columnIndex + 1}`,
            width: column?.width ?? 100,
            components: Array.isArray(column?.components) ? column.components : [],
          }))
        : [
            {
              id: `col-${index + 1}-1`,
              width: 100,
              components: [],
            },
          ]

    return {
      ...section,
      id: section?.id || `section-${index + 1}`,
      name: section?.name || section?.title || `Section ${index + 1}`,
      type: section?.type || 'custom',
      props: sanitizeSectionProps(section?.type || 'custom', section?.props),
      columns,
      container: {
        id: section?.container?.id || `container-${index + 1}`,
        rows: [
          {
            id: section?.container?.rows?.[0]?.id || `row-${index + 1}`,
            columns,
          },
        ],
      },
    }
  })

  return {
    id: baseLayout.id || page.id || randomUUID(),
    name: baseLayout.name || page.name || page.title || `Page ${page.id || ''}`.trim(),
    sections,
  }
}

export async function getPageRecord({ pageId, slug }, connection = pool) {
  if (!pageId && !slug) {
    return null
  }

  const [rows] = pageId
    ? await connection.execute(
        'SELECT id, slug, title, name, layout, published_layout, header_slug, footer_slug, banner_slug, meta_title, meta_description, meta_image, published_at FROM pages WHERE id = ? LIMIT 1',
        [pageId],
      )
    : await connection.execute(
        'SELECT id, slug, title, name, layout, published_layout, header_slug, footer_slug, banner_slug, meta_title, meta_description, meta_image, published_at FROM pages WHERE slug = ? LIMIT 1',
        [slug],
      )

  return rows[0] || null
}

export async function getPageLayoutRecord(identifier, connection = pool) {
  const page = await getPageRecord(identifier, connection)
  if (!page) {
    return null
  }

  return {
    page,
    layout: normalizeLayout(page.layout, page),
    publishedLayout: normalizeLayout(page.published_layout ?? page.layout, page),
  }
}

function getSectionSnapshot(section, index) {
  const firstRow = section?.container?.rows?.[0]
  const firstColumn = firstRow?.columns?.[0]
  const props = section.props ?? section.content ?? {}

  return {
    page_id: section.page_id,
    instance_id: String(section.id || `section-${index + 1}`),
    section_name: section.name || section.title || `Section ${index + 1}`,
    section_type: section.type || 'custom',
    type: section.type || 'custom',
    name: section.name || section.title || `Section ${index + 1}`,
    props,
    content: props,
    settings: section.settings ?? {},
    style_props: section.styleProps ?? {},
    responsive_props: section.responsiveProps ?? {},
    accessibility_props: section.accessibilityProps ?? {},
    interactive_props: section.interactiveProps ?? {},
    section_order: index,
    sort_order: index,
    sticky_enabled: Boolean(section.sticky_enabled ?? section.stickyEnabled ?? false),
    sticky_column_index: section.sticky_column_index ?? section.stickyColumnIndex ?? null,
    sticky_position: section.sticky_position ?? section.stickyPosition ?? null,
    sticky_offset: section.sticky_offset ?? section.stickyOffset ?? 0,
    row_id: firstRow?.id ?? null,
    col_id: firstColumn?.id ?? null,
    width: firstColumn?.width ?? 100,
    is_active: true,
  }
}

function serializeSectionField(field, value) {
  if (
    ['props', 'content', 'settings', 'style_props', 'responsive_props', 'accessibility_props', 'interactive_props'].includes(
      field,
    )
  ) {
    return JSON.stringify(value ?? {})
  }

  if (field === 'sticky_enabled' || field === 'is_active') {
    return Boolean(value)
  }

  return value ?? null
}

async function replaceSectionsSnapshot(connection, pageId, layout, existingColumns) {
  await connection.execute('DELETE FROM sections WHERE page_id = ?', [pageId])

  const sections = Array.isArray(layout?.sections) ? layout.sections : []
  for (let index = 0; index < sections.length; index += 1) {
    const section = sections[index]
    const snapshot = getSectionSnapshot({ ...section, page_id: pageId }, index)
    const insertFields = Object.keys(snapshot).filter((field) => existingColumns.includes(field))

    if (!insertFields.length) {
      continue
    }

    const values = insertFields.map((field) => serializeSectionField(field, snapshot[field]))

    await connection.execute(
      `INSERT INTO sections (${insertFields.join(', ')}) VALUES (${insertFields.map(() => '?').join(', ')})`,
      values,
    )
  }

  return { synced: true, count: sections.length, inserted: sections.length, updated: 0, deleted: 0 }
}

export async function syncSectionsSnapshot(connection, pageId, layout) {
  if (!(await tableExists('sections'))) {
    return { synced: false, count: 0 }
  }

  const existingColumns = await getExistingColumns('sections')
  if (!existingColumns.includes('page_id')) {
    return { synced: false, count: 0 }
  }
  if (!existingColumns.includes('instance_id') || !existingColumns.includes('id')) {
    return replaceSectionsSnapshot(connection, pageId, layout, existingColumns)
  }

  const sections = Array.isArray(layout?.sections) ? layout.sections : []
  const snapshotFields = Object.keys(getSectionSnapshot({ page_id: pageId }, 0)).filter((field) => existingColumns.includes(field))
  const [existingRows] = await connection.execute(
    `SELECT id, ${snapshotFields.join(', ')} FROM sections WHERE page_id = ?`,
    [pageId],
  )

  const existingByInstanceId = new Map(
    existingRows
      .filter((row) => row.instance_id != null)
      .map((row) => [String(row.instance_id), row]),
  )
  const retainedIds = new Set()
  let inserted = 0
  let updated = 0

  for (let index = 0; index < sections.length; index += 1) {
    const section = sections[index]
    const snapshot = getSectionSnapshot({ ...section, page_id: pageId }, index)
    const writableFields = Object.keys(snapshot).filter((field) => existingColumns.includes(field))
    const currentRow = existingByInstanceId.get(String(snapshot.instance_id))

    if (!currentRow) {
      const values = writableFields.map((field) => serializeSectionField(field, snapshot[field]))
      await connection.execute(
        `INSERT INTO sections (${writableFields.join(', ')}) VALUES (${writableFields.map(() => '?').join(', ')})`,
        values,
      )
      inserted += 1
      continue
    }

    retainedIds.add(currentRow.id)

    const changedFields = writableFields.filter((field) => {
      const nextValue = serializeSectionField(field, snapshot[field])
      const currentValue = serializeSectionField(field, currentRow[field])
      return nextValue !== currentValue
    })

    if (!changedFields.length) {
      continue
    }

    const values = changedFields.map((field) => serializeSectionField(field, snapshot[field]))
    values.push(currentRow.id)
    await connection.execute(
      `UPDATE sections SET ${changedFields.map((field) => `${field} = ?`).join(', ')} WHERE id = ?`,
      values,
    )
    updated += 1
  }

  const staleIds = existingRows.map((row) => row.id).filter((id) => !retainedIds.has(id))
  if (staleIds.length) {
    await connection.execute(
      `DELETE FROM sections WHERE id IN (${staleIds.map(() => '?').join(', ')})`,
      staleIds,
    )
  }

  return {
    synced: true,
    count: sections.length,
    inserted,
    updated,
    deleted: staleIds.length,
  }
}

export async function saveLayoutForPage({
  pageId,
  layout,
  pageName,
  extraPageFields = {},
}) {
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()
    const existingPage = await getPageRecord({ pageId }, connection)
    if (!existingPage) {
      throw new Error('Page not found')
    }

    const normalizedLayout = normalizeLayout(layout, { id: pageId, name: pageName })
    const validatedLayout = {
      ...normalizedLayout,
      sections: normalizedLayout.sections.map((section) => {
        const validation = validateSectionProps(section.type, section.props)

        return {
          ...section,
          props: validation.sanitized ?? sanitizeSectionProps(section.type, section.props),
        }
      }),
    }

    const pageUpdates = ['layout = ?', 'updated_at = NOW()']
    const values = [JSON.stringify(validatedLayout)]

    if (pageName !== undefined) {
      pageUpdates.push('name = ?')
      values.push(pageName)
    }

    for (const [field, value] of Object.entries(extraPageFields)) {
      pageUpdates.push(`${field} = ?`)
      values.push(field === 'layout' ? JSON.stringify(value) : value)
    }

    values.push(pageId)
    await connection.execute(`UPDATE pages SET ${pageUpdates.join(', ')} WHERE id = ?`, values)

    const syncResult = await syncSectionsSnapshot(connection, pageId, validatedLayout)

    await connection.commit()
    clearPublicPageBundleCache(existingPage.slug)
    return syncResult
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}
