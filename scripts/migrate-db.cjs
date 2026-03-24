require('dotenv/config')

const fs = require('fs')
const path = require('path')
const mysql = require('mysql2/promise')

const migrationPath = path.join(process.cwd(), 'src', 'migrations', '001_fix_schema.sql')

function readStatements(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8')
  return sql
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean)
}

async function columnExists(connection, tableName, columnName) {
  const [rows] = await connection.query(
    'SELECT COUNT(*) AS count ' +
      'FROM information_schema.columns ' +
      'WHERE table_schema = DATABASE() ' +
      'AND table_name = ? ' +
      'AND column_name = ?',
    [tableName, columnName],
  )

  return Number(rows[0] && rows[0].count ? rows[0].count : 0) > 0
}

function parseAlterTableAddColumns(statement) {
  const match = statement.match(/^ALTER\s+TABLE\s+([^\s]+)\s+([\s\S]+)$/i)
  if (!match) {
    return null
  }

  const tableName = match[1]
  const operationsRaw = match[2]
  const operations = operationsRaw
    .split(/,\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean)

  if (!operations.every((item) => /^ADD\s+COLUMN\s+IF\s+NOT\s+EXISTS\s+/i.test(item))) {
    return null
  }

  return { tableName, operations }
}

async function executeCompatAlterTable(connection, statement) {
  const parsed = parseAlterTableAddColumns(statement)
  if (!parsed) {
    await connection.query(statement)
    return
  }

  for (const operation of parsed.operations) {
    const columnMatch = operation.match(/^ADD\s+COLUMN\s+IF\s+NOT\s+EXISTS\s+([^\s]+)\s+([\s\S]+)$/i)
    if (!columnMatch) {
      continue
    }

    const columnName = columnMatch[1]
    const definition = columnMatch[2]
    if (await columnExists(connection, parsed.tableName, columnName)) {
      continue
    }

    await connection.query('ALTER TABLE ' + parsed.tableName + ' ADD COLUMN ' + columnName + ' ' + definition)
  }
}

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.DB_PASS || 'chetanlal8658303482@',
    database: process.env.DB_NAME || 'admin',
    multipleStatements: false,
  })

  try {
    const statements = readStatements(migrationPath)
    console.log('Running ' + statements.length + ' migration statements from ' + migrationPath)

    for (const [index, statement] of statements.entries()) {
      await executeCompatAlterTable(connection, statement)
      console.log('OK ' + (index + 1) + '/' + statements.length + ': ' + statement.split('\n')[0])
    }

    console.log('Schema migration completed successfully.')
  } finally {
    await connection.end()
  }
}

run().catch((error) => {
  console.error('Schema migration failed.')
  console.error(error.message)
  process.exit(1)
})
