import pool from '../../../lib/db.js'
import { parseJsonValue, tableExists } from '../_utils/crud.js'

export async function GET() {
  try {
    if (!(await tableExists('pages'))) {
      return Response.json([])
    }

    const [pages] = await pool.execute('SELECT id FROM pages WHERE slug = ? LIMIT 1', ['home'])
    if (pages.length === 0) {
      return Response.json([])
    }

    if (await tableExists('sections')) {
      const [sections] = await pool.execute(
        'SELECT props FROM sections WHERE page_id = ? AND type = ? ORDER BY section_order ASC LIMIT 1',
        [pages[0].id, 'choose'],
      )

      if (sections.length > 0) {
        const props = parseJsonValue(sections[0].props, {}) || {}
        return Response.json(Array.isArray(props.services) ? props.services : Array.isArray(props.items) ? props.items : [])
      }
    }

    const [layoutRows] = await pool.execute('SELECT layout FROM pages WHERE id = ? LIMIT 1', [pages[0].id])
    const layout = parseJsonValue(layoutRows[0]?.layout, {}) || {}
    const sections = Array.isArray(layout.sections) ? layout.sections : []
    const chooseSection = sections.find((section) => String(section.type || '').toLowerCase() === 'choose')
    const source = chooseSection?.props ?? chooseSection?.content ?? {}

    return Response.json(Array.isArray(source.services) ? source.services : Array.isArray(source.items) ? source.items : [])
  } catch (error) {
    console.error(error)
    return Response.json([])
  }
}
