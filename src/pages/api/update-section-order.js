import pool from '../../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { page_id, sections } = req.body;
  if (!page_id || !sections) return res.status(400).json({ error: 'Missing page_id or sections' });

  // Update order for each section
  for (const section of sections) {
    await pool.query('UPDATE sections SET `order`=? WHERE id=?', [section.order, section.id]);
  }

  res.status(200).json({ success: true, message: 'Order updated' });
}
