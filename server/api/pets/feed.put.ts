import { defineEventHandler, readBody, createError } from 'h3'
import { db } from '../../db'
import { pets, foodInventory, leaderboard } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth'

const FOOD_TYPES = {
  basic: { xp: 10, atk: 1, def: 0, hp: 0 },
  premium: { xp: 30, atk: 1, def: 2, hp: 0 },
  rare: { xp: 80, atk: 2, def: 2, hp: 5 },
} as const

export default defineEventHandler(async (event) => {
  const authUser = requireAuth(event)
  const body = await readBody(event)
  const { foodType } = body

  if (!foodType || !['basic', 'premium', 'rare'].includes(foodType)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid food type'
    })
  }

  const petResults = await db
    .select()
    .from(pets)
    .where(eq(pets.userId, authUser.id))
    .limit(1)

  if (petResults.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'You do not have a pet'
    })
  }

  const pet = petResults[0]
  const food = await db
    .select()
    .from(foodInventory)
    .where(eq(foodInventory.userId, authUser.id))
    .limit(1)

  if (food.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No food inventory'
    })
  }

  const foodItem = food[0]
  const foodConfig = FOOD_TYPES[foodType as keyof typeof FOOD_TYPES]

  const foodAmount = foodItem[foodType as 'basic' | 'premium' | 'rare'] as number
  if (foodAmount < 1) {
    throw createError({
      statusCode: 400,
      message: `Not enough ${foodType} food`
    })
  }

  await db.update(foodInventory)
    .set({ [foodType]: foodAmount - 1 })
    .where(eq(foodInventory.userId, authUser.id))

  const newXP = pet.experience + foodConfig.xp
  const xpNeeded = getXPForLevel(pet.level + 1)
  let newLevel = pet.level
  let newEvolutionStage = pet.evolutionStage as '1' | '2' | '3'
  let leveledUp = false
  let evolved = false

  if (newXP >= xpNeeded) {
    newLevel++
    leveledUp = true

    if (newLevel >= 31 && pet.evolutionStage !== '3') {
      newEvolutionStage = '3'
      evolved = true
    } else if (newLevel >= 11 && pet.evolutionStage === '1') {
      newEvolutionStage = '2'
      evolved = true
    }
  }

  const newStats = {
    attack: pet.stats.attack + foodConfig.atk,
    defense: pet.stats.defense + foodConfig.def,
    health: Math.min(pet.stats.health + foodConfig.hp, pet.stats.maxHealth + foodConfig.hp),
    maxHealth: pet.stats.maxHealth + foodConfig.hp,
  }

  const updatedPet = await db.update(pets)
    .set({
      experience: newXP,
      level: newLevel,
      evolutionStage: newEvolutionStage,
      stats: newStats,
      lastFed: new Date(),
      feedingStreak: pet.feedingStreak + 1,
    })
    .where(eq(pets.userId, authUser.id))
    .returning()

  await db.update(leaderboard)
    .set({
      level: newLevel,
      power: calculatePower(newLevel, newStats),
      defense: newStats.defense,
      health: newStats.maxHealth,
      updatedAt: new Date(),
    })
    .where(eq(leaderboard.userId, authUser.id))

  return {
    success: true,
    pet: updatedPet[0],
    leveledUp,
    evolved,
    xpGained: foodConfig.xp,
  }
})

function getXPForLevel(level: number): number {
  return level * 100 + level * level * 10
}

function calculatePower(level: number, stats: { attack: number; defense: number; health: number; maxHealth: number }): number {
  return Math.floor(level * 2 + stats.attack * 0.5 + stats.defense * 0.3 + stats.health * 0.2)
}
