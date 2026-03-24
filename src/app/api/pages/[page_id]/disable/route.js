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

function normalizeDisabled(value) {
  if (value === true || value === false) {
    return value ? 1 : 0
  }

  return null
}

async function fetchPageState(pageId) {
  const [rows] = await pool.query('SELECT id, slug, disabled, updated_at FROM pages WHERE id = ? LIMIT 1', [
    pageId,
  ])
  return rows[0] || null
}

async function updateDisabled(request, params) {
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

  const disabled = normalizeDisabled(body?.disabled)
  if (disabled === null) {
    return NextResponse.json({ success: false, error: 'disabled must be boolean' }, { status: 400 })
  }

  try {
    if (!(await tableExists('pages'))) {
      return missingTableResponse('pages')
    }

    const page = await fetchPageState(pageId)
    if (!page) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
    }

    if (page.slug === 'home' && disabled === 1) {
      return NextResponse.json({ success: false, error: 'Cannot disable home page' }, { status: 403 })
    }

    await pool.query('UPDATE pages SET disabled = ?, updated_at = NOW() WHERE id = ?', [disabled, pageId])

    const updatedPage = await fetchPageState(pageId)
    return NextResponse.json({
      success: true,
      data: {
        id: updatedPage?.id ?? pageId,
        disabled: Boolean(updatedPage?.disabled ?? disabled),
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
        disabled: Boolean(page.disabled),
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

  return updateDisabled(request, params)
}

export async function PUT(request, { params }) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  return updateDisabled(request, params)
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
