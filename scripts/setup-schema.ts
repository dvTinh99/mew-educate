import 'dotenv/config'
import { Client } from 'pg'

async function setupSchema() {
  console.log('Setting up database schema...')
  
  const url = new URL(process.env.DATABASE_URL!)
  const client = new Client({
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    database: url.pathname.slice(1),
    user: url.username,
    password: url.password,
    ssl: { rejectUnauthorized: false },
  })
  
  try {
    await client.connect()
    
    const tablesToCreate = [
      // User Stats
      `CREATE TABLE IF NOT EXISTS user_stats (
        id serial PRIMARY KEY,
        user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
        total_xp integer DEFAULT 0 NOT NULL,
        level integer DEFAULT 1 NOT NULL,
        current_streak integer DEFAULT 0 NOT NULL,
        longest_streak integer DEFAULT 0 NOT NULL,
        last_study_date text,
        total_study_time integer DEFAULT 0 NOT NULL,
        total_cards_studied integer DEFAULT 0 NOT NULL,
        total_exams_taken integer DEFAULT 0 NOT NULL,
        perfect_exams integer DEFAULT 0 NOT NULL,
        daily_challenges_completed integer DEFAULT 0 NOT NULL,
        weekly_challenges_completed integer DEFAULT 0 NOT NULL,
        onboarding_completed boolean DEFAULT false NOT NULL,
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        updated_at timestamp with time zone DEFAULT now() NOT NULL
      )`,
      
      // Pets
      `CREATE TABLE IF NOT EXISTS pets (
        id serial PRIMARY KEY,
        user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
        name text NOT NULL,
        species text DEFAULT 'cat' NOT NULL,
        level integer DEFAULT 1 NOT NULL,
        experience integer DEFAULT 0 NOT NULL,
        evolution_stage text DEFAULT '1' NOT NULL,
        stats jsonb DEFAULT '{"attack":10,"defense":10,"health":100,"maxHealth":100}' NOT NULL,
        last_fed timestamp with time zone,
        feeding_streak integer DEFAULT 0 NOT NULL,
        likes integer DEFAULT 0 NOT NULL,
        created_at timestamp with time zone DEFAULT now() NOT NULL
      )`,
      
      // Food Inventory
      `CREATE TABLE IF NOT EXISTS food_inventory (
        id serial PRIMARY KEY,
        user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
        basic integer DEFAULT 10 NOT NULL,
        premium integer DEFAULT 2 NOT NULL,
        rare integer DEFAULT 0 NOT NULL,
        max_capacity integer DEFAULT 100 NOT NULL
      )`,
      
      // Battle History
      `CREATE TABLE IF NOT EXISTS battle_history (
        id serial PRIMARY KEY,
        user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        opponent_id text,
        opponent_name text,
        difficulty text,
        result text NOT NULL,
        turns_used integer,
        xp_earned integer DEFAULT 0 NOT NULL,
        date timestamp with time zone DEFAULT now() NOT NULL
      )`,
      
      // Daily Challenges
      `CREATE TABLE IF NOT EXISTS daily_challenges (
        id serial PRIMARY KEY,
        user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type text NOT NULL,
        title text NOT NULL,
        description text,
        target integer NOT NULL,
        progress integer DEFAULT 0 NOT NULL,
        xp_reward integer DEFAULT 0 NOT NULL,
        is_completed boolean DEFAULT false NOT NULL,
        expires_at timestamp with time zone NOT NULL,
        date timestamp with time zone DEFAULT now() NOT NULL
      )`,
      
      // Badges
      `CREATE TABLE IF NOT EXISTS badges (
        id text PRIMARY KEY,
        name text NOT NULL,
        description text,
        icon text,
        xp_reward integer DEFAULT 0 NOT NULL,
        category text
      )`,
      
      // User Badges
      `CREATE TABLE IF NOT EXISTS user_badges (
        id serial PRIMARY KEY,
        user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        badge_id text NOT NULL REFERENCES badges(id),
        unlocked_at timestamp with time zone DEFAULT now() NOT NULL,
        UNIQUE(user_id, badge_id)
      )`,
      
      // Leaderboard
      `CREATE TABLE IF NOT EXISTS leaderboard (
        id serial PRIMARY KEY,
        user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
        pet_name text,
        level integer DEFAULT 0 NOT NULL,
        power integer DEFAULT 0 NOT NULL,
        defense integer DEFAULT 0 NOT NULL,
        health integer DEFAULT 0 NOT NULL,
        likes integer DEFAULT 0 NOT NULL,
        wins integer DEFAULT 0 NOT NULL,
        losses integer DEFAULT 0 NOT NULL,
        updated_at timestamp with time zone DEFAULT now() NOT NULL
      )`,
      
      // Decks
      `CREATE TABLE IF NOT EXISTS decks (
        id serial PRIMARY KEY,
        user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name text NOT NULL,
        description text,
        category text,
        difficulty text,
        language text,
        is_pre_built boolean DEFAULT false NOT NULL,
        deck_icon text,
        tags text[],
        version text,
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        last_studied timestamp with time zone
      )`,
      
      // Cards
      `CREATE TABLE IF NOT EXISTS cards (
        id serial PRIMARY KEY,
        deck_id integer NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
        front text NOT NULL,
        back text NOT NULL,
        hint text,
        review_count integer DEFAULT 0 NOT NULL,
        last_reviewed timestamp with time zone,
        created_at timestamp with time zone DEFAULT now() NOT NULL
      )`,
      
      // Exam Results
      `CREATE TABLE IF NOT EXISTS exam_results (
        id serial PRIMARY KEY,
        user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        deck_id integer NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
        score integer NOT NULL,
        correct integer NOT NULL,
        total integer NOT NULL,
        grade text NOT NULL,
        completed_at timestamp with time zone DEFAULT now() NOT NULL,
        answers jsonb,
        attempt_number integer DEFAULT 1 NOT NULL,
        question_type text
      )`,
    ]
    
    for (const sql of tablesToCreate) {
      try {
        await client.query(sql)
        const tableName = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1]
        console.log(`✓ Created table: ${tableName}`)
      } catch (error: any) {
        if (error.code === '42P07') {
          console.log(`⚠ Table already exists`)
        } else {
          console.error(`✗ Error:`, error.message.substring(0, 100))
        }
      }
    }
    
    console.log('\nSchema setup complete!')
  } finally {
    await client.end()
  }
}

setupSchema().catch(console.error)
