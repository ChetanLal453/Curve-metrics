// pages/api/get-page.js
import pool from '../../lib/db.js';

const sectionsData = {
  home: [
    { section_type: 'banner', content: JSON.stringify({ title: 'DRIVING DIGITAL TRANSFORMATION', subtitle: 'THROUGH BIG DATA, SMART MARKETING & SCALABLE TECHNOLOGY SOLUTIONS', description: 'At Curve Metrics we empower government bodies, enterprises, and businesses with innovative solutions in Big Data, Data Deduplication, Web & App Development, and Strategic Digital Marketing.', image: '/img/hero/team.jpg', button_text: 'Partner with us to build smarter solutions for tomorrow.', button_link: '/contact' }), order: 0 },
    { section_type: 'choose', content: JSON.stringify({ title: 'Key Service Highlights', subtitle: 'Quickly summarizes main services for easy scanning. Each item is keyword-rich to improve SEO.', services: [{ title: 'Big Data Analytics', description: 'Harness the power of data.', icon: 'FaDatabase', color: '#007bff' }, { title: 'Web Development', description: 'Build modern websites.', icon: 'FaMobileAlt', color: '#28a745' }] }), order: 1 },
    { section_type: 'about_one', content: JSON.stringify({ subtitle: 'WHY CHOOSE US', image: '/img/about/about-thumb-2.png', shapeImage: '/img/shape/about-thumb-shape.png' }), order: 2 },
    { section_type: 'features_one', content: JSON.stringify({ subtitle: 'INDUSTRIES WE EMPOWER', title: 'From Government to Startups Tailored Solutions Across Every Industry' }), order: 3 },
    { section_type: 'cta', content: JSON.stringify({ title: 'Check your website\'s SEO', placeholder: 'Enter Your Website Link', buttonText: 'Check Now' }), order: 4 },
  ],
  about: [
    { section_type: 'banner', content: JSON.stringify({ title: 'About Us' }), order: 0 },
    { section_type: 'about_mission', content: JSON.stringify({ title: 'About Curve Metrics Solutions Pvt. Ltd.', description: 'At Curve Metrics, we are a team of technology innovators, data scientists, and digital marketers who believe in building impactful digital solutions for organizations across India. Our focus is on accuracy, scalability, and trust delivering results that matter.', image: '/img/about/about-thumb.png' }), order: 1 },
    { section_type: 'our_mission', content: JSON.stringify({}), order: 2 },
    { section_type: 'our_values', content: JSON.stringify({}), order: 3 },
    { section_type: 'our_vision', content: JSON.stringify({}), order: 4 },
    { section_type: 'us_different', content: JSON.stringify({}), order: 5 },
    { section_type: 'about_counter', content: JSON.stringify({}), order: 6 },
    { section_type: 'cta', content: JSON.stringify({}), order: 7 },
  ],
  services: [
    { section_type: 'banner', content: JSON.stringify({ title: 'Services' }), order: 0 },
    { section_type: 'home_three_service', content: JSON.stringify({}), order: 1 },
    { section_type: 'cta', content: JSON.stringify({}), order: 2 },
  ],
  'service/digital-seo': [
    { section_type: 'banner', content: JSON.stringify({ title: 'SEO Services That Drive Real Results' }), order: 0 },
    { section_type: 'why_seo_matters', content: JSON.stringify({}), order: 1 },
    { section_type: 'our_seo_services', content: JSON.stringify({}), order: 2 },
    { section_type: 'seo_process', content: JSON.stringify({}), order: 3 },
    { section_type: 'faq', content: JSON.stringify({}), order: 4 },
    { section_type: 'service_cta', content: JSON.stringify({}), order: 5 },
  ],
  'service/bigdata': [
    { section_type: 'banner', content: JSON.stringify({ title: 'Big Data Analytics Services' }), order: 0 },
    { section_type: 'bigdata_matters', content: JSON.stringify({}), order: 1 },
    { section_type: 'bigdata_service', content: JSON.stringify({}), order: 2 },
    { section_type: 'bigdata_analytics_process', content: JSON.stringify({}), order: 3 },
    { section_type: 'faq', content: JSON.stringify({}), order: 4 },
    { section_type: 'service_cta', content: JSON.stringify({}), order: 5 },
  ],
  'service/web-design': [
    { section_type: 'banner', content: JSON.stringify({ title: 'Web Design Services That Convert & Engage' }), order: 0 },
    { section_type: 'webdesign_matters', content: JSON.stringify({}), order: 1 },
    { section_type: 'webdesign_service', content: JSON.stringify({}), order: 2 },
    { section_type: 'webdesign_process', content: JSON.stringify({}), order: 3 },
    { section_type: 'webdesign_faq', content: JSON.stringify({}), order: 4 },
    { section_type: 'call_to_action', content: JSON.stringify({}), order: 5 },
  ],
  'service/web-app': [
    { section_type: 'banner', content: JSON.stringify({ title: 'Web App Development Services' }), order: 0 },
    { section_type: 'webapp_matters', content: JSON.stringify({}), order: 1 },
    { section_type: 'webapp_service', content: JSON.stringify({}), order: 2 },
    { section_type: 'webapp_development_process', content: JSON.stringify({}), order: 3 },
    { section_type: 'digital_marketing_faq', content: JSON.stringify({}), order: 4 },
    { section_type: 'call_to_action', content: JSON.stringify({}), order: 5 },
  ],
  'service/mobile-app': [
    { section_type: 'banner', content: JSON.stringify({ title: 'Mobile App Development Services' }), order: 0 },
    { section_type: 'mobileapp_matters', content: JSON.stringify({}), order: 1 },
    { section_type: 'mobileapp_service', content: JSON.stringify({}), order: 2 },
    { section_type: 'mobileapp_development_process', content: JSON.stringify({}), order: 3 },
    { section_type: 'faq', content: JSON.stringify({}), order: 4 },
    { section_type: 'service_cta', content: JSON.stringify({}), order: 5 },
  ],
  projects: [
    { section_type: 'banner', content: JSON.stringify({ title: 'Our Projects' }), order: 0 },
    { section_type: 'project_gallery', content: JSON.stringify({}), order: 1 },
    { section_type: 'project_cta', content: JSON.stringify({}), order: 2 },
  ],
};

export default async function handler(req, res) {
  const { page_id, slug } = req.query;

  if (!page_id && !slug) {
    return res.status(400).json({ success: false, message: 'page_id or slug required' });
  }

  try {
    let page;

    if (page_id) {
      const [rows] = await pool.query('SELECT * FROM pages WHERE id = ?', [page_id]);
      page = rows[0];
    } else {
      const [rows] = await pool.query('SELECT * FROM pages WHERE slug = ?', [slug]);
      page = rows[0];
    }

    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    let [sections] = await pool.query(
      'SELECT * FROM sections WHERE page_id = ? ORDER BY `order` ASC',
      [page.id]
    );

    // If no sections, insert default sections for the page
    if (sections.length === 0 && sectionsData[page.slug]) {
      const defaults = sectionsData[page.slug];
      for (const section of defaults) {
        await pool.query('INSERT INTO sections (page_id, section_type, content, `order`, enabled) VALUES (?, ?, ?, ?, 1)', [page.id, section.section_type, section.content, section.order]);
      }
      // Refetch
      [sections] = await pool.query(
        'SELECT * FROM sections WHERE page_id = ? ORDER BY `order` ASC',
        [page.id]
      );
    }

    res.status(200).json({ success: true, page, sections });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch page sections' });
  }
}
