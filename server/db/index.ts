import * as schema from './schema'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { drizzle as drizzlePostgres  } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

function createDb() {
  const isNeon = process.env.DATABASE_URL?.includes('neon.tech')
  if (isNeon) {
    const sql = neon(process.env.DATABASE_URL!)
    return drizzle(sql, { schema })
  } else {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    return drizzlePostgres(pool, { schema })
  }
}

export const db = createDb()
export * from './schema'