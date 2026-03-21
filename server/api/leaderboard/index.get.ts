import { defineEventHandler, getQuery } from 'h3'
import { db } from '../../db'
import { leaderboard, users, pets } from '../../db/schema'
import { desc, sql } from 'drizzle-orm'

interface LeaderboardEntry {
  id: number
  userId: string
  petName: string | null
  level: number
  power: number
  defense: number
  health: number
  likes: number
  wins: number
  losses: number
  updatedAt: Date
}

interface AIData {
  id: string
  ownerName: string
  petName: string
  level: number
  power: number
  defense: number
  health: number
  maxHealth: number
  evolutionStage: '1' | '2' | '3' | 1 | 2 | 3
  wins: number
  losses: number
  winRate: number
  isPlayerPet: boolean
  isAIPet: boolean
  likes: number
}

const AI_NAMES = [
  'Shadow Fang', 'Fire Claw', 'Ice Whisker', 'Thunder Paw',
  'Mystic Tail', 'Storm Chaser', 'Dark Spark', 'Light Bringer',
  'Thunder Storm', 'Blazing Spirit', 'Crystal Mist', 'Forest Walker',
  'Ocean Dweller', 'Desert Hunter', 'Mountain Guardian', 'Sky Glider',
  'Night Stalker', 'Dawn Breaker', 'Moon Shadow', 'Sun Seeker'
]

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = (query.category as string) || 'level'
  const simulationEnabled = query.simulation === 'true'

  let orderBy: any
  let selectFields: any

  switch (category) {
    case 'power':
      orderBy = desc(leaderboard.power)
      break
    case 'defense':
      orderBy = desc(leaderboard.defense)
      break
    case 'health':
      orderBy = desc(leaderboard.health)
      break
    case 'beauty':
      orderBy = desc(leaderboard.likes)
      break
    default:
      orderBy = desc(leaderboard.level)
  }

  const realEntries = await db
    .select()
    .from(leaderboard)
    .orderBy(orderBy)
    .limit(50)

  const enrichedEntries: AIData[] = await Promise.all(
    realEntries.map(async (entry, index) => {
      const userResults = await db
        .select()
        .from(users)
        .where(sql`id = ${entry.userId}`)
        .limit(1)

      const petResults = await db
        .select()
        .from(pets)
        .where(sql`user_id = ${entry.userId}`)
        .limit(1)

      const pet = petResults[0]

      return {
        id: `player-${entry.userId}`,
        ownerName: userResults[0]?.name || 'Unknown',
        petName: entry.petName || pet?.name || 'Unknown',
        level: entry.level,
        power: entry.power,
        defense: entry.defense,
        health: entry.health,
        maxHealth: pet?.stats?.maxHealth || entry.health,
        evolutionStage: (pet?.evolutionStage as '1' | '2' | '3') || '1',
        wins: entry.wins,
        losses: entry.losses,
        winRate: entry.losses > 0 ? (entry.wins / (entry.wins + entry.losses)) * 100 : entry.wins > 0 ? 100 : 0,
        isPlayerPet: false,
        isAIPet: false,
        likes: entry.likes,
      }
    })
  )

  if (simulationEnabled) {
    const aiEntries: AIData[] = AI_NAMES.map((name, index) => {
      const level = 5 + Math.floor(Math.random() * 75)
      const atk = 10 + level * 2
      const def = 5 + level
      const hp = 50 + level * 5
      const evoStage = level >= 31 ? 3 : level >= 11 ? 2 : 1
      const wins = Math.floor(Math.random() * 20)
      const losses = Math.floor(Math.random() * 15)

      return {
        id: `ai-${index}`,
        ownerName: 'AI Trainer',
        petName: name,
        level,
        power: Math.floor(level * 2 + atk * 0.5 + def * 0.3 + hp * 0.2),
        defense: def,
        health: hp,
        maxHealth: hp,
        evolutionStage: evoStage as 1 | 2 | 3,
        wins,
        losses,
        winRate: losses > 0 ? (wins / (wins + losses)) * 100 : wins > 0 ? 100 : 0,
        isPlayerPet: false,
        isAIPet: true,
        likes: Math.floor(Math.random() * 100),
      }
    })

    const allEntries = [...enrichedEntries, ...aiEntries]

    const sortedByCategory = allEntries.sort((a, b) => {
      switch (category) {
        case 'power':
          return b.power - a.power
        case 'defense':
          return b.defense - a.defense
        case 'health':
          return b.health - a.health
        case 'beauty':
          const aEvo = typeof a.evolutionStage === 'string' ? parseInt(a.evolutionStage) : a.evolutionStage
          const bEvo = typeof b.evolutionStage === 'string' ? parseInt(b.evolutionStage) : b.evolutionStage
          if (bEvo !== aEvo) {
            return bEvo - aEvo
          }
          return b.likes - a.likes
        default:
          return b.level - a.level
      }
    })

    return {
      leaderboard: sortedByCategory.slice(0, 50),
      category,
      totalEntries: sortedByCategory.length,
    }
  }

  return {
    leaderboard: enrichedEntries,
    category,
    totalEntries: enrichedEntries.length,
  }
})
