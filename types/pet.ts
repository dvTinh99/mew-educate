export type FoodType = 'basic' | 'premium' | 'rare'
export type EvolutionStage = 1 | 2 | 3
export type BattleType = 'pve' | 'pvp'
export type BattleResult = 'win' | 'lose' | 'draw'
export type BattleDifficulty = 'easy' | 'medium' | 'hard'
export type LeaderboardCategory = 'level' | 'power' | 'defense' | 'health' | 'beauty'

export interface PetStats {
  attack: number
  defense: number
  health: number
  maxHealth: number
}

export interface Pet {
  id: string
  name: string
  species: 'cat'
  level: number
  experience: number
  evolutionStage: EvolutionStage
  stats: PetStats
  lastFed: Date | null
  feedingStreak: number
  createdAt: Date
  likes: number
  customization?: PetCustomization
}

export interface PetCustomization {
  color: string
  accentColor: string
  accessories: PetAccessories
}

export interface PetAccessories {
  hat?: string
  collar?: string
  bow?: string
  glasses?: string
}

export interface PetLeaderboardEntry {
  id: string
  ownerName: string
  petName: string
  level: number
  power: number
  defense: number
  health: number
  maxHealth: number
  evolutionStage: EvolutionStage
  wins: number
  losses: number
  winRate: number
  isPlayerPet: boolean
  isAIPet: boolean
  likes: number
}

export interface LeaderboardSettings {
  simulationEnabled: boolean
  lastRefreshed: string | null
}

export interface Food {
  id: string
  type: FoodType
  name: string
  xpValue: number
  statBonus?: Partial<PetStats>
}

export interface FoodInventory {
  basic: number
  premium: number
  rare: number
}

export interface BattleOpponent {
  id: string
  name: string
  species: string
  level: number
  evolutionStage: EvolutionStage
  stats: PetStats
  difficulty: BattleDifficulty
}

export interface BattleLogEntry {
  turn: number
  action: 'attack' | 'defend' | 'special'
  attacker: 'player' | 'enemy'
  damage: number
  isCritical: boolean
  isMiss: boolean
  description: string
}

export interface BattleQuestion {
  deckId: string
  cardId: string
  question: string
  correctAnswer: string
  options?: string[]
}

export interface BattleState {
  isActive: boolean
  currentTurn: number
  maxTurns: number
  playerPet: Pet
  enemyPet: BattleOpponent
  playerHP: number
  enemyHP: number
  currentQuestion: BattleQuestion | null
  battleLog: BattleLogEntry[]
  criticalStreak: number
  isPlayerTurn: boolean
  battleComplete: boolean
  result: BattleResult | null
}

export interface BattleHistoryEntry {
  id: string
  date: Date
  opponentId: string
  opponentName: string
  difficulty: BattleDifficulty
  result: BattleResult
  turnsUsed: number
  xpEarned: number
  foodReward?: { type: FoodType; amount: number }
}

export const FOOD_TYPES: Record<FoodType, Food> = {
  basic: {
    id: 'basic',
    type: 'basic',
    name: 'Basic Kibble',
    xpValue: 10,
    statBonus: { attack: 1 }
  },
  premium: {
    id: 'premium',
    type: 'premium',
    name: 'Premium Fish',
    xpValue: 30,
    statBonus: { defense: 2, attack: 1 }
  },
  rare: {
    id: 'rare',
    type: 'rare',
    name: 'Legendary Tuna',
    xpValue: 80,
    statBonus: { health: 5, attack: 2, defense: 2 }
  }
}

export const EVOLUTION_THRESHOLDS = {
  stage1To2: 10,
  stage2To3: 30
}

export const STAT_MULTIPLIERS: Record<EvolutionStage, number> = {
  1: 1,
  2: 1.5,
  3: 2
}

export function calculatePetPower(pet: Pet, studyBonus: number): number {
  const basePower = pet.level * 2
  const attackPower = pet.stats.attack * 0.5
  const defensePower = pet.stats.defense * 0.3
  const evolutionBonus = STAT_MULTIPLIERS[pet.evolutionStage]
  
  return Math.round((basePower + attackPower + defensePower + studyBonus) * evolutionBonus)
}

export function calculateDamage(
  attacker: Pet | BattleOpponent,
  isCritical: boolean,
  criticalStreak: number
): number {
  const baseDamage = attacker.stats.attack
  const criticalBonus = isCritical ? baseDamage * (0.5 + criticalStreak * 0.1) : 0
  const variance = baseDamage * 0.1 * (Math.random() - 0.5)
  
  return Math.max(1, Math.round(baseDamage + criticalBonus + variance))
}

export function calculateEvolutionStage(level: number): EvolutionStage {
  if (level >= EVOLUTION_THRESHOLDS.stage2To3) return 3
  if (level >= EVOLUTION_THRESHOLDS.stage1To2) return 2
  return 1
}

export function getXPForNextLevel(level: number): number {
  return level * 50 + Math.pow(level, 2) * 5
}

export function getFoodRewardForExam(score: number, isPerfect: boolean): { type: FoodType; amount: number } {
  const baseAmount = 5
  let bonus = 0
  let type: FoodType = 'basic'
  
  if (score >= 90) {
    type = 'premium'
    bonus = score >= 100 ? 15 : 5
  }
  
  if (isPerfect) {
    type = 'rare'
    bonus = 15
  }
  
  return {
    type,
    amount: baseAmount + bonus
  }
}
