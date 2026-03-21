import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import { db } from '../../db'
import { users, userStats, foodInventory } from '../../db/schema'
import { eq, sql } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, name } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email and password are required'
    })
  }

  try {
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUsers.length > 0) {
      throw createError({
        statusCode: 400,
        message: 'User already exists'
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    // Find next available ID (start from a high number to avoid conflicts)
    let nextId = 10000
    try {
      // Get the maximum ID that is NOT NULL
      const maxIdResult = await db.execute(sql`SELECT MAX(id) as max_id FROM users WHERE id IS NOT NULL`)
      console.log('maxIdResult:', JSON.stringify(maxIdResult))
      // Neon returns results in rows array
      if (maxIdResult.rows && maxIdResult.rows[0]?.max_id !== undefined) {
        nextId = Number(maxIdResult.rows[0].max_id) + 1
        console.log('Computed nextId:', nextId)
      } else if (maxIdResult[0]?.max_id !== undefined) {
        nextId = Number(maxIdResult[0].max_id) + 1
        console.log('Computed nextId (alt):', nextId)
      }
    } catch (e) {
      console.log('Error getting max ID:', e.message)
    }

    const now = new Date().toISOString()
    const userName = name || email.split('@')[0]

    // Insert user using sql tagged template
    console.log('Inserting user with id:', nextId, 'email:', email)
    try {
      await db.execute(sql`INSERT INTO users (id, email, name, password, created_at, updated_at) VALUES (${nextId}, ${email}, ${userName}, ${passwordHash}, ${now}, ${now})`)
      console.log('Insert successful')
    } catch (e) {
      console.log('Insert error:', e.message)
      throw e
    }

    // Get the inserted user
    console.log('Fetching user with email:', email)
    const newUsers = await db.execute(sql`SELECT id::text, email, name FROM users WHERE email = ${email}`)
    console.log('newUsers result type:', typeof newUsers)
    console.log('newUsers result:', JSON.stringify(newUsers))
    console.log('newUsers keys:', Object.keys(newUsers))
    console.log('newUsers rows:', newUsers.rows)
    
    let user: any = null
    if (newUsers.rows && newUsers.rows.length > 0) {
      user = newUsers.rows[0]
    } else if (Array.isArray(newUsers) && newUsers.length > 0) {
      user = newUsers[0]
    } else if (newUsers[0]) {
      user = newUsers[0]
    }
    
    console.log('user:', JSON.stringify(user))
    if (!user) {
      throw createError({ statusCode: 500, message: 'Failed to retrieve created user' })
    }

    // Insert user stats
    await db.execute(sql`INSERT INTO user_stats (user_id, total_xp, level, current_streak, longest_streak, total_study_time, total_cards_studied, total_exams_taken, perfect_exams, daily_challenges_completed, weekly_challenges_completed, onboarding_completed) VALUES (${user.id}, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, false)`)

    // Insert food inventory
    await db.execute(sql`INSERT INTO food_inventory (user_id, basic, premium, rare, max_capacity) VALUES (${user.id}, 10, 2, 0, 100)`)

    const token = Buffer.from(JSON.stringify({
      id: user.id,
      email: user.email,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000
    })).toString('base64')

    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    }
  } catch (error: any) {
    console.error('Register error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Registration failed'
    })
  }
})
