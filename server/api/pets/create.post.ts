import { defineEventHandler, readBody, createError } from 'h3'
import { db } from '../../db'
import { pets, foodInventory, leaderboard } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth'
import { v4 as uuidv4 } from 'uuid'

export default defineEventHandler(async (event) => {
  const authUser = requireAuth(event)

  const body = await readBody(event)
  const { name } = body

  if (!name || name.trim().length === 0) {
    throw createError({
      statusCode: 400,
      message: 'Pet name is required'
    })
  }

  const existingPet = await db
    .select()
    .from(pets)
    .where(eq(pets.userId, authUser.id))
    .limit(1)

  if (existingPet.length > 0) {
    throw createError({
      statusCode: 400,
      message: 'You already have a pet'
    })
  }

  const food = await db
    .select()
    .from(foodInventory)
    .where(eq(foodInventory.userId, authUser.id))
    .limit(1)

  if (food.length === 0 || food[0].basic < 10) {
    throw createError({
      statusCode: 400,
      message: 'Not enough food (need 10 basic food)'
    })
  }

  await db.update(foodInventory)
    .set({ basic: food[0].basic - 10 })
    .where(eq(foodInventory.userId, authUser.id))

  const newPet = await db.insert(pets).values({
    id: uuidv4(),
    userId: authUser.id,
    name: name.trim(),
    species: 'cat',
    level: 1,
    experience: 0,
    evolutionStage: '1',
    stats: { attack: 10, defense: 10, health: 100, maxHealth: 100 },
    feedingStreak: 0,
  }).returning()

  const pet = newPet[0]

  await db.insert(leaderboard).values({
    userId: authUser.id,
    petName: pet.name,
    level: pet.level,
    power: calculatePower(pet.level, pet.stats),
    defense: pet.stats.defense,
    health: pet.stats.maxHealth,
  })

  return {
    success: true,
    pet,
  }
})

function calculatePower(level: number, stats: { attack: number; defense: number; health: number; maxHealth: number }): number {
  return Math.floor(level * 2 + stats.attack * 0.5 + stats.defense * 0.3 + stats.health * 0.2)
}
