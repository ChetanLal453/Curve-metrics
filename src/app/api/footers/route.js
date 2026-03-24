import pool from '../../../lib/db.js'
import { requireAdmin } from '../../../lib/require-admin.js'
import {
  getExistingColumns,
  missingTableResponse,
  parseJsonRow,
  parseJsonRows,
  tableExists,
} from '../_utils/crud.js'

const TABLE_NAME = 'footers'
const SELECT_COLUMNS = [
  'id',
  'slug',
  'name',
  'columns',
  'copyright',
  'social_links',
  'bg_color',
  'settings',
  'created_at',
  'updated_at',
]

function normalizeFooterRow(footer) {
  if (!footer) {
    return null
  }

  const settings = footer.settings || {}

  return {
    ...footer,
    copyright_text: settings.copyright_text || footer.copyright || '',
    logo_url: settings.logo_url || '',
    newsletter_enabled:
      typeof settings.newsletter_enabled === 'boolean' ? settings.newsletter_enabled : true,
  }
}

async function fetchFooters() {
  const columns = await getExistingColumns(TABLE_NAME, SELECT_COLUMNS)
  const [rows] = await pool.execute(
    `SELECT ${columns.join(', ')} FROM ${TABLE_NAME} ORDER BY id ASC`,
  )

  return parseJsonRows(rows, ['columns', 'social_links', 'settings']).map(normalizeFooterRow)
}

export async function GET() {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  try {
    if (!(await tableExists(TABLE_NAME))) {
      return missingTableResponse(TABLE_NAME)
    }

    const footers = await fetchFooters()
    return Response.json({
      success: true,
      footer: footers[0] || null,
      footers,
      items: footers,
    })
  } catch (error) {
    console.error('Error fetching footers:', error)
    return Response.json({ success: false, error: 'Failed to fetch footers' }, { status: 500 })
  }
}

export async function POST(request) {
  const unauthorizedResponse = await requireAdmin()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  try {
    if (!(await tableExists(TABLE_NAME))) {
      return missingTableResponse(TABLE_NAME)
    }

    const body = await request.json()
    const requestedColumns = await getExistingColumns(TABLE_NAME, SELECT_COLUMNS)
    const [rows] = await pool.execute(
      `SELECT ${requestedColumns.join(', ')} FROM ${TABLE_NAME} ORDER BY id ASC LIMIT 1`,
    )

    const existing = parseJsonRow(rows[0], ['columns', 'social_links', 'settings'])
    const currentSettings = existing?.settings || {}
    const nextSettings = {
      ...currentSettings,
      logo_url: body.logo_url ?? currentSettings.logo_url ?? '',
      newsletter_enabled:
        body.newsletter_enabled ?? currentSettings.newsletter_enabled ?? true,
      copyright_text:
        body.copyright_text ?? body.copyright ?? currentSettings.copyright_text ?? '',
    }

    const payload = {
      slug: body.slug || existing?.slug || 'global-footer',
      name: body.name || existing?.name || 'Global Footer',
      columns: JSON.stringify(body.columns ?? existing?.columns ?? []),
      copyright:
        body.copyright ?? body.copyright_text ?? existing?.copyright ?? nextSettings.copyright_text,
      social_links: JSON.stringify(body.social_links ?? existing?.social_links ?? []),
      bg_color: body.bg_color ?? existing?.bg_color ?? '#111116',
      settings: JSON.stringify(nextSettings),
    }

    const writeColumns = await getExistingColumns(TABLE_NAME, Object.keys(payload))

    if (existing?.id) {
      const updates = writeColumns.map((column) => `${column} = ?`)
      const values = writeColumns.map((column) => payload[column])
      values.push(existing.id)
      await pool.execute(`UPDATE ${TABLE_NAME} SET ${updates.join(', ')} WHERE id = ?`, values)
    } else {
      const values = writeColumns.map((column) => payload[column])
      await pool.execute(
        `INSERT INTO ${TABLE_NAME} (${writeColumns.join(', ')}) VALUES (${writeColumns.map(() => '?').join(', ')})`,
        values,
      )
    }

    const footers = await fetchFooters()
    return Response.json({
      success: true,
      footer: footers[0] || null,
      footers,
      item: footers[0] || null,
    })
  } catch (error) {
    console.error('Error saving footer:', error)
    return Response.json({ success: false, error: 'Failed to save footer' }, { status: 500 })
  }
}
