require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');

async function alterTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  const tables = ['user_stats', 'food_inventory', 'leaderboard', 'daily_challenges', 'battle_history', 'pets', 'decks'];

  try {
    for (const table of tables) {
      try {
        await pool.query(`ALTER TABLE ${table} ALTER COLUMN user_id TYPE text`);
        console.log('Altered ' + table);
      } catch (e) {
        console.log('Error altering ' + table + ':', e.message.substring(0, 150));
      }
    }
    console.log('Done!');
  } finally {
    await pool.end();
  }
}

alterTables().catch(console.error);
