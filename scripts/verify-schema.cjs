require('dotenv/config')

const mysql = require('mysql2/promise')

const requiredTables = [
  'navigation_items',
  'headers',
  'footers',
  'banners',
  'site_settings',
  'services',
  'stats',
  'team',
  'blog',
  'gallery',
  'social',
  'contact',
  'faqs',
  'pricing',
  'projects',
  'partners',
  'timeline',
  'awards',
]

const requiredColumnsByTable = {
  pages: [
    'disabled',
    'status',
    'header_slug',
    'footer_slug',
    'banner_slug',
    'meta_title',
    'meta_description',
    'meta_image',
    'published_at',
    'scheduled_for',
  ],
  custom_templates: ['layout', 'description', 'thumbnail', 'updated_at'],
  page_versions: ['version_number', 'layout', 'description', 'created_by', 'name'],
  media_library: ['filename', 'original_filename', 'alt', 'tags', 'uploaded_at'],
  sections: ['props', 'type', 'sticky_enabled', 'sticky_column_index', 'sticky_position', 'sticky_offset'],
}

async function getExistingTables(connection) {
  const [rows] = await connection.query(
    'SELECT TABLE_NAME AS table_name ' +
      'FROM information_schema.tables ' +
      'WHERE table_schema = DATABASE()',
  )

  return new Set(rows.map((row) => row.table_name))
}

async function getExistingColumns(connection, tableName) {
  const [rows] = await connection.query(
    'SELECT COLUMN_NAME AS column_name ' +
      'FROM information_schema.columns ' +
      'WHERE table_schema = DATABASE() ' +
      'AND table_name = ?',
    [tableName],
  )

  return new Set(rows.map((row) => row.column_name))
}

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.DB_PASS || 'chetanlal8658303482@',
    database: process.env.DB_NAME || 'admin',
  })

  try {
    const existingTables = await getExistingTables(connection)
    const missingTables = requiredTables.filter((tableName) => !existingTables.has(tableName))

    const missingColumns = []
    for (const [tableName, requiredColumns] of Object.entries(requiredColumnsByTable)) {
      if (!existingTables.has(tableName)) {
        missingColumns.push(tableName + ': table missing')
        continue
      }

      const existingColumns = await getExistingColumns(connection, tableName)
      const absent = requiredColumns.filter((columnName) => !existingColumns.has(columnName))
      if (absent.length) {
        missingColumns.push(tableName + ': ' + absent.join(', '))
      }
    }

    if (!missingTables.length && !missingColumns.length) {
      console.log('Schema verification passed.')
      return
    }

    if (missingTables.length) {
      console.log('Missing tables: ' + missingTables.join(', '))
    }

    if (missingColumns.length) {
      console.log('Missing columns:')
      for (const entry of missingColumns) {
        console.log('- ' + entry)
      }
    }

    process.exit(1)
  } finally {
    await connection.end()
  }
}

run().catch((error) => {
  console.error('Schema verification failed.')
  console.error(error.message)
  process.exit(1)
})
