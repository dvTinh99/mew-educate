import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import { db } from '../../db'
import { users, userStats, foodInventory } from '../../db/schema'
import { eq } from 'drizzle-orm'
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
    const userName = name || email.split('@')[0]

    const newUser = await db.insert(users).values({
      email,
      name: userName,
      password: passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning()

    const user = newUser[0]

    if (!user) {
      throw createError({ statusCode: 500, message: 'Failed to create user' })
    }

    await db.insert(userStats).values({
      userId: user.id,
      totalXP: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      totalStudyTime: 0,
      totalCardsStudied: 0,
      totalExamsTaken: 0,
      perfectExams: 0,
      dailyChallengesCompleted: 0,
      weeklyChallengesCompleted: 0,
      onboardingCompleted: false,
    })

    await db.insert(foodInventory).values({
      userId: user.id,
      basic: 10,
      premium: 2,
      rare: 0,
      maxCapacity: 100,
    })

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
