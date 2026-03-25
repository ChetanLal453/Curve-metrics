import { NextResponse } from 'next/server'
import pool from '../../../../../lib/db.js'
import { requireAdmin } from '../../../../../lib/require-admin.js'
import { databaseErrorResponse, missingTableResponse, tableExists } from '../../../_utils/crud.js'

type PageBannerState = {
  id: number
  banner_slug: string | null
  updated_at: string | null
}

function logRequest(request: Request) {
  void request
}

function methodNotAllowed() {
  return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 })
}

function parsePageId(pageId: string | undefined) {
  const parsed = Number.parseInt(pageId || '', 10)
  return Number.isNaN(parsed) ? null : parsed
}

function normalizeSlug(value: unknown) {
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

async function fetchPageState(pageId: number) {
  const [rows] = await pool.query('SELECT id, banner_slug, updated_at FROM pages WHERE id = ? LIMIT 1', [
    pageId,
  ])
  return Array.isArray(rows) ? ((rows[0] as PageBannerState | undefined) ?? null) : null
}

async function updateBanner(request: Request, params: { page_id: string }) {
  logRequest(request)

  const pageId = parsePageId(params?.page_id)
  if (pageId === null) {
    return NextResponse.json({ success: false, error: 'Invalid page ID' }, { status: 400 })
  }

  let body: { banner_slug?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const bannerSlug = normalizeSlug(body?.banner_slug)
  if (bannerSlug === undefined) {
    return NextResponse.json({ success: false, error: 'banner_slug is required' }, { status: 400 })
  }

  try {
    if (!(await tableExists('pages'))) {
      return missingTableResponse('pages')
    }

    const page = await fetchPageState(pageId)
    if (!page) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
    }

    await pool.query('UPDATE pages SET banner_slug = ?, updated_at = NOW() WHERE id = ?', [
      bannerSlug,
      pageId,
    ])

    const updatedPage = await fetchPageState(pageId)
    return NextResponse.json({
      success: true,
      data: {
        id: updatedPage?.id ?? pageId,
        banner_slug: updatedPage?.banner_slug ?? null,
        updated_at: updatedPage?.updated_at ?? null,
      },
    })
  } catch (error) {
    return databaseErrorResponse(error)
  }
}

export async function GET(request: Request, { params }: { params: { page_id: string } }) {
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
        banner_slug: page.banner_slug ?? null,
        updated_at: page.updated_at ?? null,
      },
    })
  } catch (error) {
    return databaseErrorResponse(error)
  }
}

export async function POST(request: Request, { params }: { params: { page_id: string } }) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  return updateBanner(request, params)
}

export async function PUT(request: Request, { params }: { params: { page_id: string } }) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  return updateBanner(request, params)
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
