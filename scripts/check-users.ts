import 'dotenv/config'
import { Client } from 'pg'

async function checkSchema() {
  const url = new URL(process.env.DATABASE_URL!)
  const client = new Client({
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    database: url.pathname.slice(1),
    user: url.username,
    password: url.password,
    ssl: { rejectUnauthorized: false },
  })
  
  await client.connect()
  
  const result = await client.query(`
    SELECT column_name, data_type, column_default 
    FROM information_schema.columns 
    WHERE table_name = 'users'
    ORDER BY ordinal_position
  `)
  console.log('Users table columns:')
  console.log(result.rows)
  
  await client.end()
}

checkSchema().catch(console.error)
