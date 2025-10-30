// pages/api/get-page-sections.js
import pool from '../../lib/db.js';

export default async function handler(req, res) {
  const { fromPageId } = req.query;

  if (!fromPageId) return res.status(400).json({ error: 'fromPageId is required' });

  try {
    const [sections] = await pool.query(
      'SELECT * FROM sections WHERE page_id = ? ORDER BY `order` ASC',
      [fromPageId]
    );

    res.status(200).json({ success: true, sections });
  } catch (error) {
    console.error('Error fetching sections from other page:', error);
    res.status(500).json({ error: 'Failed to fetch sections from other page' });
  }
}
