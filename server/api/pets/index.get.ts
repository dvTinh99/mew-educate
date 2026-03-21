import { defineEventHandler, createError } from 'h3'
import { db } from '../../db'
import { pets, users, leaderboard } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const authUser = requireAuth(event)

  const petResults = await db
    .select()
    .from(pets)
    .where(eq(pets.userId, authUser.id))
    .limit(1)

  if (petResults.length === 0) {
    return {
      pet: null,
      hasPet: false,
    }
  }

  return {
    pet: petResults[0],
    hasPet: true,
  }
})
