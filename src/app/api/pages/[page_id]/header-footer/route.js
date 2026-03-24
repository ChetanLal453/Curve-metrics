import { NextResponse } from 'next/server'
import pool from '../../../../../lib/db.js'
import { requireAdmin } from '../../../../../lib/require-admin.js'
import { databaseErrorResponse, missingTableResponse, tableExists } from '../../../_utils/crud.js'

function logRequest(request) {
  console.log('[API]', request.method, request.url)
}

function methodNotAllowed() {
  return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 })
}

function parsePageId(pageId) {
  const parsed = Number.parseInt(pageId, 10)
  return Number.isNaN(parsed) ? null : parsed
}

function normalizeSlug(value) {
  if (value === undefined) {
    return undefined
  }

  if (value === null || value === '') {
    return null
  }

  if (typeof value !== 'string') {
    return null
  }

  return value.trim() || null
}

async function fetchPageState(pageId) {
  const [rows] = await pool.query(
    'SELECT id, header_slug, footer_slug, updated_at FROM pages WHERE id = ? LIMIT 1',
    [pageId],
  )
  return rows[0] || null
}

async function updateHeaderFooter(request, params) {
  logRequest(request)

  const pageId = parsePageId(params?.page_id)
  if (pageId === null) {
    return NextResponse.json({ success: false, error: 'Invalid page ID' }, { status: 400 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const headerSlug = normalizeSlug(body?.header_slug)
  const footerSlug = normalizeSlug(body?.footer_slug)

  if (headerSlug === undefined && footerSlug === undefined) {
    return NextResponse.json({ success: false, error: 'Nothing to update' }, { status: 400 })
  }

  try {
    if (!(await tableExists('pages'))) {
      return missingTableResponse('pages')
    }

    const page = await fetchPageState(pageId)
    if (!page) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
    }

    const updates = []
    const values = []

    if (headerSlug !== undefined) {
      updates.push('header_slug = ?')
      values.push(headerSlug)
    }

    if (footerSlug !== undefined) {
      updates.push('footer_slug = ?')
      values.push(footerSlug)
    }

    values.push(pageId)
    await pool.query(`UPDATE pages SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`, values)

    const updatedPage = await fetchPageState(pageId)
    return NextResponse.json({
      success: true,
      data: {
        id: updatedPage?.id ?? pageId,
        header_slug: updatedPage?.header_slug ?? null,
        footer_slug: updatedPage?.footer_slug ?? null,
        updated_at: updatedPage?.updated_at ?? null,
      },
    })
  } catch (error) {
    return databaseErrorResponse(error)
  }
}

export async function GET(request, { params }) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  logRequest(request)

  const pageId = parsePageId(params?.page_id)
  if (pageId === null) {
    return NextResponse.json({ success: false, error: 'Invalid page ID' }, { status: 400 })
  }

  try {
    if (!(await tableExists('pages'))) {
      return missingTableResponse('pages')
    }

    const page = await fetchPageState(pageId)
    if (!page) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: page.id,
        header_slug: page.header_slug ?? null,
        footer_slug: page.footer_slug ?? null,
        updated_at: page.updated_at ?? null,
      },
    })
  } catch (error) {
    return databaseErrorResponse(error)
  }
}

export async function POST(request, { params }) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  return updateHeaderFooter(request, params)
}

export async function PUT(request, { params }) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  return updateHeaderFooter(request, params)
}

export async function PATCH() {
  return methodNotAllowed()
}

export async function DELETE() {
  return methodNotAllowed()
}

export async function OPTIONS() {
  return NextResponse.json({ success: true, data: { methods: ['GET', 'POST', 'PUT'] } })
}
