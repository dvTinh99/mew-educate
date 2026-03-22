import { defineEventHandler, readBody, createError, getCookie } from 'h3'
import { db } from '../../db'
import { 
  userStats, 
  foodInventory, 
  pets, 
  decks, 
  cards,
  leaderboard
} from '../../db/schema'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString())

    if (payload.exp < Date.now()) {
      throw createError({
        statusCode: 401,
        message: 'Token expired'
      })
    }

    const userId = payload.id
    const body = await readBody(event)

    if (body.stats) {
      await db.insert(userStats)
        .values({
          userId,
          totalXP: body.stats.totalXP || 0,
          level: body.stats.level || 1,
          currentStreak: body.stats.currentStreak || 0,
          longestStreak: body.stats.longestStreak || 0,
          lastStudyDate: body.stats.lastStudyDate || null,
          totalStudyTime: body.stats.totalStudyTime || 0,
          totalCardsStudied: body.stats.totalCardsStudied || 0,
          totalExamsTaken: body.stats.totalExamsTaken || 0,
          perfectExams: body.stats.perfectExams || 0,
          dailyChallengesCompleted: body.stats.dailyChallengesCompleted || 0,
          weeklyChallengesCompleted: body.stats.weeklyChallengesCompleted || 0,
          onboardingCompleted: body.stats.onboardingCompleted || false,
        })
        .onConflictDoUpdate({
          target: userStats.userId,
          set: {
            totalXP: body.stats.totalXP || 0,
            level: body.stats.level || 1,
            currentStreak: body.stats.currentStreak || 0,
            longestStreak: body.stats.longestStreak || 0,
            lastStudyDate: body.stats.lastStudyDate || null,
            totalStudyTime: body.stats.totalStudyTime || 0,
            totalCardsStudied: body.stats.totalCardsStudied || 0,
            totalExamsTaken: body.stats.totalExamsTaken || 0,
            perfectExams: body.stats.perfectExams || 0,
            dailyChallengesCompleted: body.stats.dailyChallengesCompleted || 0,
            weeklyChallengesCompleted: body.stats.weeklyChallengesCompleted || 0,
            onboardingCompleted: body.stats.onboardingCompleted || false,
            updatedAt: new Date(),
          }
        })
    }

    if (body.food) {
      await db.insert(foodInventory)
        .values({
          userId,
          basic: body.food.basic || 0,
          premium: body.food.premium || 0,
          rare: body.food.rare || 0,
          maxCapacity: body.food.maxCapacity || 100,
        })
        .onConflictDoUpdate({
          target: foodInventory.userId,
          set: {
            basic: body.food.basic || 0,
            premium: body.food.premium || 0,
            rare: body.food.rare || 0,
            maxCapacity: body.food.maxCapacity || 100,
          }
        })
    }

    if (body.pet !== undefined) {
      if (body.pet === null) {
        await db.delete(pets).where(eq(pets.userId, userId))
      } else {
        const petData = body.pet
        await db.insert(pets)
          .values({
            id: petData.id || randomUUID(),
            userId,
            name: petData.name || 'Pet',
            species: petData.species || 'cat',
            level: petData.level || 1,
            experience: petData.experience || 0,
            evolutionStage: petData.evolutionStage || '1',
            stats: petData.stats || { attack: 10, defense: 10, health: 100, maxHealth: 100 },
            lastFed: petData.lastFed ? new Date(petData.lastFed) : null,
            feedingStreak: petData.feedingStreak || 0,
            likes: petData.likes || 0,
          })
          .onConflictDoUpdate({
            target: pets.userId,
            set: {
              name: petData.name,
              species: petData.species,
              level: petData.level,
              experience: petData.experience,
              evolutionStage: petData.evolutionStage,
              stats: petData.stats,
              lastFed: petData.lastFed ? new Date(petData.lastFed) : null,
              feedingStreak: petData.feedingStreak,
              likes: petData.likes,
            }
          })
      }
    }

    if (body.decks) {
      for (const deck of body.decks) {
        await db.insert(decks)
          .values({
            id: deck.id || randomUUID(),
            userId,
            name: deck.name,
            description: deck.description || null,
            category: deck.category || 'general',
            difficulty: deck.difficulty || 'beginner',
            language: deck.language || 'general',
            isPreBuilt: deck.isPreBuilt || false,
            deckIcon: deck.deckIcon || null,
            tags: deck.tags || null,
            version: deck.version || null,
            createdAt: deck.createdAt ? new Date(deck.createdAt) : new Date(),
            lastStudied: deck.lastStudied ? new Date(deck.lastStudied) : null,
          })
          .onConflictDoUpdate({
            target: decks.id,
            set: {
              name: deck.name,
              description: deck.description,
              category: deck.category,
              difficulty: deck.difficulty,
              language: deck.language,
              isPreBuilt: deck.isPreBuilt,
              deckIcon: deck.deckIcon,
              tags: deck.tags,
              version: deck.version,
              lastStudied: deck.lastStudied ? new Date(deck.lastStudied) : null,
            }
          })

        if (deck.cards) {
          for (const card of deck.cards) {
            await db.insert(cards)
              .values({
                id: card.id || randomUUID(),
                deckId: deck.id,
                front: card.front,
                back: card.back,
                frontLang: card.frontLang || 'en',
                backLang: card.backLang || 'en',
                hint: card.hint || null,
                reviewCount: card.reviewCount || 0,
                lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : null,
              })
              .onConflictDoUpdate({
                target: cards.id,
                set: {
                  front: card.front,
                  back: card.back,
                  frontLang: card.frontLang,
                  backLang: card.backLang,
                  hint: card.hint,
                  reviewCount: card.reviewCount,
                  lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : null,
                }
              })
          }
        }
      }
    }

    if (body.leaderboard) {
      await db.insert(leaderboard)
        .values({
          userId,
          petName: body.leaderboard.petName || null,
          level: body.leaderboard.level || 0,
          power: body.leaderboard.power || 0,
          defense: body.leaderboard.defense || 0,
          health: body.leaderboard.health || 0,
          likes: body.leaderboard.likes || 0,
          wins: body.leaderboard.wins || 0,
          losses: body.leaderboard.losses || 0,
        })
        .onConflictDoUpdate({
          target: leaderboard.userId,
          set: {
            petName: body.leaderboard.petName,
            level: body.leaderboard.level,
            power: body.leaderboard.power,
            defense: body.leaderboard.defense,
            health: body.leaderboard.health,
            likes: body.leaderboard.likes,
            wins: body.leaderboard.wins,
            losses: body.leaderboard.losses,
            updatedAt: new Date(),
          }
        })
    }

    return { success: true }
  } catch (error: any) {
    console.error('Save user data error:', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to save user data'
    })
  }
})
