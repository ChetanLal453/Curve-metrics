import 'dotenv/config';
import pool from './src/lib/db.js';

async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT NOW() AS now');
    console.log('✅ DB Connected! Current time:', rows[0].now);
  } catch (err) {
    console.error('❌ DB Connection failed:', err.message);
  }
}

testConnection();
