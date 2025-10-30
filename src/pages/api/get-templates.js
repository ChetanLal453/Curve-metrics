// /api/get-templates.js
import pool from '../../lib/db.js';

export default async function handler(req, res) {
  try {
    const [templates] = await pool.query(
      'SELECT id, section_type, content, created_at FROM section_templates ORDER BY created_at DESC'
    );
    res.status(200).json({ success: true, templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch templates' });
  }
}
