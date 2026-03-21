import 'dotenv/config'
import { Client } from 'pg'

async function fixUserBadges() {
  console.log('Fixing user_badges table...')
  
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
    
    // Check if table exists and drop it
    const checkResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_badges'
      ) as exists
    `)
    
    if (checkResult.rows[0].exists) {
      await client.query(`DROP TABLE user_badges CASCADE`)
      console.log('✓ Dropped user_badges table')
      
      // Wait a bit for the drop to complete
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    // Create user_badges table without any primary key first
    await client.query(`
      CREATE TABLE user_badges (
        id serial,
        user_id uuid NOT NULL,
        badge_id text NOT NULL,
        unlocked_at timestamp with time zone DEFAULT now() NOT NULL
      )
    `)
    console.log('✓ Created user_badges table')
    
    // Add composite primary key separately
    await client.query(`
      ALTER TABLE user_badges ADD PRIMARY KEY (user_id, badge_id)
    `)
    console.log('✓ Added composite primary key')
    
    // Add foreign key to users
    await client.query(`
      ALTER TABLE user_badges 
      ADD CONSTRAINT user_badges_user_id_users_id_fk 
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    `)
    console.log('✓ Added foreign key to users')
    
    // Add foreign key to badges
    await client.query(`
      ALTER TABLE user_badges 
      ADD CONSTRAINT user_badges_badge_id_badges_id_fk 
      FOREIGN KEY (badge_id) REFERENCES badges(id)
    `)
    console.log('✓ Added foreign key to badges')
    
    console.log('user_badges table fix complete!')
  } finally {
    await client.end()
  }
}

fixUserBadges().catch(console.error)
