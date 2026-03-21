import 'dotenv/config'
import { Client } from 'pg'
import { readFileSync } from 'fs'
import { join } from 'path'

async function runMigration() {
  console.log('Running migration...')
  
  // Parse connection string
  const url = new URL(process.env.DATABASE_URL!)
  const client = new Client({
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    database: url.pathname.slice(1),
    user: url.username,
    password: url.password,
    ssl: {
      rejectUnauthorized: false,
    },
  })
  
  try {
    await client.connect()
    console.log('Connected to database')
    
    const migrationPath = join(process.cwd(), 'server/db/migrations/0000_polite_sugar_man.sql')
    const migrationSQL = readFileSync(migrationPath, 'utf-8')
    
    const statements = migrationSQL.split('--> statement-breakpoint')
    
    for (const statement of statements) {
      const trimmed = statement.trim()
      if (trimmed) {
        try {
          await client.query(trimmed)
          console.log('✓ Executed')
        } catch (error: any) {
          if (error.code === '42P07' || error.code === '42710' || error.code === '23505') {
            console.log('⚠ Skipped (already exists)')
          } else if (error.code === '23503') {
            console.log('⚠ Skipped (dependency exists)')
          } else {
            console.error('✗ Error:', error.message?.substring(0, 200))
          }
        }
      }
    }
    
    console.log('Migration complete!')
  } finally {
    await client.end()
  }
}

runMigration().catch(console.error)
