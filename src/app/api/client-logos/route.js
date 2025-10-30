import pool from '../../../lib/db.js';

export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT image, alt_text FROM client_logos ORDER BY sort_order');
    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json([]);
  }
}
