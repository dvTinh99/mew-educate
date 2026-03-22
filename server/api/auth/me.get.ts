import { defineEventHandler, createError } from 'h3'
import { getCookie } from 'h3'
import { db } from '../../db'
import { users, userStats, foodInventory } from '../../db/schema'
import { eq } from 'drizzle-orm'

interface TokenPayload {
  id: string
  email: string
  exp: number
}

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  try {
    const payload: TokenPayload = JSON.parse(Buffer.from(token, 'base64').toString())

    if (payload.exp < Date.now()) {
      throw createError({
        statusCode: 401,
        message: 'Token expired'
      })
    }

    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.id))
      .limit(1)

    if (userResults.length === 0) {
      throw createError({
        statusCode: 401,
        message: 'User not found'
      })
    }

    const user = userResults[0]

    const statsResults = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, user.id))
      .limit(1)

    const foodResults = await db
      .select()
      .from(foodInventory)
      .where(eq(foodInventory.userId, user.id))
      .limit(1)

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      stats: statsResults[0] || null,
      food: foodResults[0] || null,
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 401,
      message: 'Invalid token'
    })
  }
})
