import pool from '../../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  const { section_id } = req.body;
  if (!section_id) return res.status(400).json({ error: 'section_id required' });

  // Get the section to know page_id and order
  const [[section]] = await pool.query('SELECT page_id, `order` FROM sections WHERE id = ?', [section_id]);
  if (!section) return res.status(404).json({ error: 'Section not found' });

  // Delete the section
  await pool.query('DELETE FROM sections WHERE id = ?', [section_id]);

  // Shift orders down for sections after this one
  await pool.query('UPDATE sections SET `order` = `order` - 1 WHERE page_id = ? AND `order` > ?', [section.page_id, section.order]);

  res.status(200).json({ message: 'Section deleted' });
}
