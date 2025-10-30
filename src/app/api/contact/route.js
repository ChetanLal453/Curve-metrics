import pool from '../../../lib/db.js';

export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT address, phone, email, map_url FROM contact LIMIT 1');
    if (rows.length === 0) return Response.json({});
    return Response.json(rows[0]);
  } catch (error) {
    console.error(error);
    return Response.json({});
  }
}
