import pool from '../../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { page_id, template_id, content, section_type, order } = req.body;
  if (!page_id) return res.status(400).json({ error: 'page_id required' });

  let finalContent, finalSectionType, finalTemplateId;

  if (template_id) {
    // Fetch template
    const [[template]] = await pool.query('SELECT * FROM section_templates WHERE id = ?', [template_id]);
    if (!template) return res.status(404).json({ error: 'Template not found' });
    finalContent = template.content;
    finalSectionType = template.section_type;
    finalTemplateId = template.id;
  } else {
    if (!content || !section_type) return res.status(400).json({ error: 'content and section_type required if no template_id' });
    finalContent = content;
    finalSectionType = section_type;
    finalTemplateId = null;
  }

  // Populate content based on section_type
  if (finalSectionType === 'about_one') {
    const [trustPoints] = await pool.query('SELECT main, sub, sort_order FROM trust_points ORDER BY sort_order ASC');
    finalContent.trustPoints = trustPoints;
  } else if (finalSectionType === 'features_one') {
    const [features] = await pool.query('SELECT id, title, description, icon, image, order_index FROM features ORDER BY order_index ASC');
    finalContent.features = features;
  } else if (finalSectionType === 'testimonials_contact') {
    const [testimonials] = await pool.query('SELECT text, author FROM testimonials');
    const [clientLogos] = await pool.query('SELECT image, alt_text FROM client_logos ORDER BY sort_order ASC');
    finalContent.testimonials = testimonials;
    finalContent.clientLogos = clientLogos;
  }
  // Add more if needed

  // Determine order
  let insertOrder;
  if (order !== undefined) {
    insertOrder = order;
    // Shift existing orders >= insertOrder by +1
    await pool.query('UPDATE sections SET `order` = `order` + 1 WHERE page_id = ? AND `order` >= ?', [page_id, insertOrder]);
  } else {
    // Append at end
    const [[{ maxOrder }]] = await pool.query('SELECT MAX(`order`) as maxOrder FROM sections WHERE page_id = ?', [page_id]);
    insertOrder = (maxOrder !== null ? maxOrder + 1 : 0);
  }

  // Insert new section
  const [result] = await pool.query(
    'INSERT INTO sections (page_id, template_id, section_type, content, `order`) VALUES (?, ?, ?, ?, ?)',
    [page_id, finalTemplateId, finalSectionType, JSON.stringify(finalContent), insertOrder]
  );

  res.status(200).json({ message: 'Section added', section_id: result.insertId });
}
