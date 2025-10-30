import pool from '../../../lib/db.js';

export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT name, logo, url FROM partners ORDER BY sort_order');
    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json([]);
  }
}
