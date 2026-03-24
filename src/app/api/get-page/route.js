import { NextResponse } from 'next/server'
import pool from '../../../lib/db.js'
import { getExistingColumns } from '../_utils/crud.js'
import { requireAdmin } from '../../../lib/require-admin.js'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3001',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

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

function normalizeSection(section, index) {
  const rowId = section?.container?.rows?.[0]?.id || `row-${index + 1}`
  const columns = Array.isArray(section?.container?.rows?.[0]?.columns)
    ? section.container.rows[0].columns.map((column, columnIndex) => ({
        id: column?.id || `col-${index + 1}-${columnIndex + 1}`,
        width: column?.width ?? 100,
        components: Array.isArray(column?.components) ? column.components : [],
      }))
    : Array.isArray(section?.columns)
      ? section.columns.map((column, columnIndex) => ({
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
    props: section?.props && typeof section.props === 'object' ? section.props : {},
    columns,
    container: {
      id: section?.container?.id || `container-${index + 1}`,
      rows: [
        {
          id: rowId,
          columns,
        },
      ],
    },
  }
}

function normalizeLayout(layout, page) {
  const parsedLayout = safeParseJson(layout, { sections: [] })
  const safeLayout = parsedLayout && typeof parsedLayout === 'object' ? parsedLayout : { sections: [] }
  const sections = Array.isArray(safeLayout.sections) ? safeLayout.sections : []

  return {
    id: String(safeLayout.id || page.id),
    name: String(safeLayout.name || page.name || page.title || 'Untitled Page'),
    sections: sections.map(normalizeSection),
  }
}

function normalizePage(page) {
  return {
    id: String(page.id),
    slug: page.slug,
    title: page.title || page.name || '',
    name: page.name || page.title || '',
    status: page.status || null,
    header_slug: page.header_slug ?? null,
    footer_slug: page.footer_slug ?? null,
    banner_slug: page.banner_slug ?? null,
    meta_title: page.meta_title ?? null,
    meta_description: page.meta_description ?? null,
    meta_image: page.meta_image ?? null,
    published_at: page.published_at || null,
    updated_at: page.updated_at || null,
  }
}

async function getPageSelectClause() {
  const columns = await getExistingColumns('pages')
  const selectFields = [
    'id',
    'slug',
    'title',
    'name',
    'layout',
    columns.includes('published_layout') ? 'published_layout' : 'NULL AS published_layout',
    'status',
    'header_slug',
    'footer_slug',
    'banner_slug',
    columns.includes('meta_title') ? 'meta_title' : 'NULL AS meta_title',
    columns.includes('meta_description') ? 'meta_description' : 'NULL AS meta_description',
    columns.includes('meta_image') ? 'meta_image' : 'NULL AS meta_image',
    columns.includes('published_at') ? 'published_at' : 'NULL AS published_at',
    'updated_at',
  ]

  return selectFields.join(', ')
}

export async function GET(request) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  try {
    const url = new URL(request.url)
    const slug = url.searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400, headers: corsHeaders })
    }

    const selectClause = await getPageSelectClause()
    const [pages] = await pool.execute(`SELECT ${selectClause} FROM pages WHERE slug = ? LIMIT 1`, [slug])

    if (!pages.length) {
      return NextResponse.json({ success: false, error: `Page '${slug}' not found` }, { status: 404, headers: corsHeaders })
    }

    const page = pages[0]
    const layout = normalizeLayout(page.layout, page)
    const publishedLayout = page.published_layout ? normalizeLayout(page.published_layout, page) : null
    const normalizedPage = normalizePage(page)

    return NextResponse.json(
      {
        success: true,
        data: {
          page: normalizedPage,
          layout,
          published_layout: publishedLayout,
        },
        page: normalizedPage,
        layout,
        published_layout: publishedLayout,
      },
      { headers: corsHeaders },
    )
  } catch (error) {
    console.error('Error loading page:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Database error',
      },
      { status: 500, headers: corsHeaders },
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}
