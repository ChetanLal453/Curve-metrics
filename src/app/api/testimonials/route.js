import pool from '../../../lib/db.js'
import { tableExists } from '../_utils/crud.js'

export async function GET() {
  try {
    if (!(await tableExists('testimonials'))) {
      return Response.json([])
    }

    const [rows] = await pool.execute('SELECT text, author FROM testimonials')
    return Response.json(rows)
  } catch (error) {
    console.error(error)
    return Response.json([])
  }
}
