import pool from './db.js'
import { normalizeLayout } from './layout-sync.js'
import { getOrSetPublicPageCache } from './public-page-cache.js'

function safeParseJson(value, fallback = null) {
  if (value == null || value === '') return fallback
  if (typeof value === 'object' && !Buffer.isBuffer(value)) return value

  try {
    const raw = Buffer.isBuffer(value) ? value.toString('utf8') : value
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function buildNavigationTree(items = []) {
  const byParent = new Map()

  for (const item of items) {
    const parentKey = item.parent_id ?? null
    if (!byParent.has(parentKey)) {
      byParent.set(parentKey, [])
    }
    byParent.get(parentKey).push({
      id: item.id,
      label: item.label || '',
      href: item.href || item.url || '/',
      order_index: Number(item.order_index || 0),
      open_new_tab: Boolean(item.open_new_tab),
      children: [],
    })
  }

  const walk = (parentId = null) =>
    [...(byParent.get(parentId) || [])]
      .sort((left, right) => left.order_index - right.order_index || left.id - right.id)
      .map((item) => ({
        ...item,
        children: walk(item.id),
      }))

  return walk(null)
}

async function getHeader(slug) {
  if (!slug) {
    return null
  }

  const [headerRows] = await pool.execute(
    'SELECT id, slug, name, logo, logo_dark, cta_label, cta_link, is_sticky, bg_color, settings FROM headers WHERE slug = ? LIMIT 1',
    [slug],
  )

  if (!headerRows.length) {
    return null
  }

  const header = headerRows[0]
  const [navRows] = await pool.execute(
    `SELECT id, label, href, order_index, parent_id, open_new_tab
     FROM navigation_items
     WHERE header_id = ? AND is_active = TRUE
     ORDER BY order_index ASC, id ASC`,
    [header.id],
  )

  return {
    ...header,
    settings: safeParseJson(header.settings, {}),
    navigation_items: buildNavigationTree(navRows),
  }
}

async function getFooter(slug) {
  if (!slug) {
    return null
  }

  const [rows] = await pool.execute(
    'SELECT id, slug, name, columns, copyright, social_links, bg_color, settings FROM footers WHERE slug = ? LIMIT 1',
    [slug],
  )

  if (!rows.length) {
    return null
  }

  const footer = rows[0]
  return {
    ...footer,
    columns: safeParseJson(footer.columns, []),
    social_links: safeParseJson(footer.social_links, []),
    settings: safeParseJson(footer.settings, {}),
  }
}

async function getBanner(slug) {
  if (!slug) {
    return null
  }

  const [rows] = await pool.execute(
    'SELECT id, slug, name, content, is_active FROM banners WHERE slug = ? AND is_active = TRUE LIMIT 1',
    [slug],
  )

  if (!rows.length) {
    return null
  }

  const banner = rows[0]
  return {
    ...banner,
    content: safeParseJson(banner.content, {}),
  }
}

async function loadPublicPageBundle(slug) {
  const [rows] = await pool.execute(
    `SELECT
      id,
      slug,
      title,
      name,
      status,
      layout,
      published_layout,
      header_slug,
      footer_slug,
      banner_slug,
      meta_title,
      meta_description,
      meta_image,
      published_at
    FROM pages
    WHERE slug = ?
    LIMIT 1`,
    [slug],
  )

  if (!rows.length) {
    return null
  }

  const page = rows[0]
  // Prefer the published snapshot; fall back only for legacy rows that predate publish snapshots.
  const liveLayout = normalizeLayout(page.published_layout ?? page.layout, page)

  const [header, footer, banner] = await Promise.all([
    getHeader(page.header_slug),
    getFooter(page.footer_slug),
    getBanner(page.banner_slug),
  ])

  return {
    page,
    layout: liveLayout,
    header,
    footer,
    banner,
  }
}

export async function getPublicPageBundle(slug) {
  return getOrSetPublicPageCache(slug, () => loadPublicPageBundle(slug))
}
