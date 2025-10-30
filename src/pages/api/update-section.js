import pool from '../../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  const { section_id, content, order, enabled } = req.body;
  if (!section_id) return res.status(400).json({ error: 'Missing section_id' });

  const fields = [];
  const values = [];

  if (content) { 
    fields.push('content=?'); 
    values.push(JSON.stringify(content)); 
  }
  if (order !== undefined) { 
    fields.push('`order`=?'); 
    values.push(order); 
  }
  if (enabled !== undefined) { 
    fields.push('enabled=?'); 
    values.push(enabled); 
  }

  if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

  values.push(section_id);
  await pool.query(`UPDATE sections SET ${fields.join(', ')} WHERE id=?`, values);

  res.status(200).json({ message: 'Section updated' });
}
