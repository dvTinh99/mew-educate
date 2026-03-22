import { defineEventHandler, createError, getCookie } from 'h3'
import { db } from '../../db'
import { 
  users, 
  userStats, 
  foodInventory, 
  pets, 
  decks, 
  cards, 
  examResults, 
  battleHistory,
  dailyChallenges,
  badges,
  userBadges,
  leaderboard
} from '../../db/schema'
import { eq } from 'drizzle-orm'

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

    const [stats] = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1)

    const [food] = await db
      .select()
      .from(foodInventory)
      .where(eq(foodInventory.userId, userId))
      .limit(1)

    const [pet] = await db
      .select()
      .from(pets)
      .where(eq(pets.userId, userId))
      .limit(1)

    const userDecks = await db
      .select()
      .from(decks)
      .where(eq(decks.userId, userId))

    const deckIds = userDecks.map(d => d.id)
    
    const deckCards: Record<string, any[]> = {}
    if (deckIds.length > 0) {
      const allCards = await db
        .select()
        .from(cards)
      
      for (const card of allCards) {
        if (deckIds.includes(card.deckId)) {
          if (!deckCards[card.deckId]) {
            deckCards[card.deckId] = []
          }
          deckCards[card.deckId].push({
            id: card.id,
            front: card.front,
            back: card.back,
            frontLang: card.frontLang,
            backLang: card.backLang,
            hint: card.hint,
            reviewCount: card.reviewCount,
            lastReviewed: card.lastReviewed,
            createdAt: card.createdAt,
          })
        }
      }
    }

    const decksWithCards = userDecks.map(deck => ({
      id: deck.id,
      name: deck.name,
      description: deck.description,
      category: deck.category,
      difficulty: deck.difficulty,
      language: deck.language,
      isPreBuilt: deck.isPreBuilt,
      deckIcon: deck.deckIcon,
      tags: deck.tags,
      version: deck.version,
      createdAt: deck.createdAt,
      lastStudied: deck.lastStudied,
      cards: deckCards[deck.id] || [],
    }))

    const userExamResults = await db
      .select()
      .from(examResults)
      .where(eq(examResults.userId, userId))

    const userBattleHistory = await db
      .select()
      .from(battleHistory)
      .where(eq(battleHistory.userId, userId))

    const userDailyChallenges = await db
      .select()
      .from(dailyChallenges)
      .where(eq(dailyChallenges.userId, userId))

    const userBadgesList = await db
      .select({
        badgeId: userBadges.badgeId,
        unlockedAt: userBadges.unlockedAt,
      })
      .from(userBadges)
      .where(eq(userBadges.userId, userId))

    const allBadges = await db.select().from(badges)
    
    const unlockedBadges = userBadgesList.map(ub => {
      const badge = allBadges.find(b => b.id === ub.badgeId)
      return badge ? { ...badge, unlockedAt: ub.unlockedAt } : null
    }).filter(Boolean)

    const [userLeaderboard] = await db
      .select()
      .from(leaderboard)
      .where(eq(leaderboard.userId, userId))
      .limit(1)

    return {
      userId,
      stats: stats || {
        totalXP: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: null,
        totalStudyTime: 0,
        totalCardsStudied: 0,
        totalExamsTaken: 0,
        perfectExams: 0,
        dailyChallengesCompleted: 0,
        weeklyChallengesCompleted: 0,
        onboardingCompleted: false,
      },
      food: food || { basic: 10, premium: 2, rare: 0, maxCapacity: 100 },
      pet: pet ? {
        id: pet.id,
        name: pet.name,
        species: pet.species,
        level: pet.level,
        experience: pet.experience,
        evolutionStage: pet.evolutionStage,
        stats: pet.stats,
        abilityPoints: pet.abilityPoints,
        spentAbilityPoints: pet.spentAbilityPoints,
        lastFed: pet.lastFed,
        feedingStreak: pet.feedingStreak,
        likes: pet.likes,
        createdAt: pet.createdAt,
      } : null,
      decks: decksWithCards,
      examResults: userExamResults,
      battleHistory: userBattleHistory,
      dailyChallenges: userDailyChallenges,
      unlockedBadges: unlockedBadges,
      leaderboard: userLeaderboard || null,
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 401,
      message: 'Invalid token'
    })
  }
})
