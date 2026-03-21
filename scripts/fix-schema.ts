import 'dotenv/config'
import { Client } from 'pg'

async function fixSchema() {
  console.log('Fixing schema issues...')
  
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
    
    // Check existing tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)
    console.log('Existing tables:', tablesResult.rows.map(r => r.table_name))
    
    // Add unique constraint to users.id if not exists
    try {
      await client.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'users_id_unique'
          ) THEN
            ALTER TABLE users ADD CONSTRAINT users_id_unique UNIQUE(id);
          END IF;
        END $$;
      `)
      console.log('✓ Added unique constraint to users.id')
    } catch (e) {
      console.log('⚠ users.id constraint already exists or error:', e)
    }
    
    // Drop and recreate user_badges table properly
    try {
      await client.query(`DROP TABLE IF EXISTS user_badges CASCADE`)
      await client.query(`
        CREATE TABLE user_badges (
          id serial PRIMARY KEY,
          user_id uuid NOT NULL,
          badge_id text NOT NULL,
          unlocked_at timestamp with time zone DEFAULT now() NOT NULL,
          PRIMARY KEY(user_id, badge_id)
        )
      `)
      await client.query(`
        ALTER TABLE user_badges 
        ADD CONSTRAINT user_badges_user_id_users_id_fk 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      `)
      await client.query(`
        ALTER TABLE user_badges 
        ADD CONSTRAINT user_badges_badge_id_badges_id_fk 
        FOREIGN KEY (badge_id) REFERENCES badges(id)
      `)
      console.log('✓ Recreated user_badges table')
    } catch (e) {
      console.log('⚠ user_badges error:', e)
    }
    
    // Add unique constraints for other tables
    const constraints = [
      { table: 'user_stats', col: 'user_id', constraint: 'user_stats_user_id_unique' },
      { table: 'pets', col: 'user_id', constraint: 'pets_user_id_unique' },
      { table: 'food_inventory', col: 'user_id', constraint: 'food_inventory_user_id_unique' },
      { table: 'leaderboard', col: 'user_id', constraint: 'leaderboard_user_id_unique' },
    ]
    
    for (const { table, col, constraint } of constraints) {
      try {
        await client.query(`
          DO $$
          BEGIN
            IF NOT EXISTS (
              SELECT 1 FROM pg_constraint WHERE conname = '${constraint}'
            ) THEN
              ALTER TABLE ${table} ADD CONSTRAINT ${constraint} UNIQUE(${col});
            END IF;
          END $$;
        `)
        console.log(`✓ Added unique constraint to ${table}.${col}`)
      } catch (e) {
        console.log(`⚠ ${table} constraint error:`, e)
      }
    }
    
    console.log('Schema fixes complete!')
  } finally {
    await client.end()
  }
}

fixSchema().catch(console.error)
