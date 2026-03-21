import { defineStore } from 'pinia'
import {
  type Pet,
  type FoodInventory,
  type FoodType,
  type BattleHistoryEntry,
  type BattleOpponent,
  type EvolutionStage,
  type PetStats,
  type PetLeaderboardEntry,
  type LeaderboardCategory,
  type LeaderboardSettings,
  FOOD_TYPES,
  EVOLUTION_THRESHOLDS,
  calculateEvolutionStage,
  getXPForNextLevel,
  calculatePetPower,
  getFoodRewardForExam,
  STAT_MULTIPLIERS
} from '~/types/pet'
import { useDeckStore } from '~/stores/deck'

const OPPONENT_NAMES = [
  'Shadow Cat', 'Fire Fang', 'Ice Whisker', 'Thunder Paw',
  'Void Meow', 'Solar Claw', 'Storm Hunter', 'Ghost Whisper',
  'Flame Tail', 'Frost Bite'
]

const OPPONENT_SPECIES = [
  'Shadow Cat', 'Fire Cat', 'Ice Cat', 'Thunder Cat',
  'Void Cat', 'Solar Cat', 'Storm Cat', 'Ghost Cat'
]

const AI_TRAINER_NAMES = [
  'DragonMaster', 'NinjaCat', 'PixelPaws', 'ShadowHunter', 'CosmicFur',
  'StarWhisker', 'ThunderTail', 'MysticMeow', 'CyberClaw', 'RainbowPurr',
  'FrostFang', 'BlazePaw', 'SpiritWhisker', 'MoonlightMittens', 'SunsetScratch',
  'NightShade', 'CrystalClaw', 'VelvetPaws', 'GoldenWhisker', 'SilverFur'
]

export const usePetStore = defineStore('pet', {
  state: () => ({
    pet: null as Pet | null,
    foodInventory: {
      basic: 10,
      premium: 2,
      rare: 0
    } as FoodInventory,
    battleHistory: [] as BattleHistoryEntry[],
    maxFoodCapacity: 100,
    hasSeenEvolution: false,
    petLeaderboard: [] as PetLeaderboardEntry[],
    leaderboardSettings: {
      simulationEnabled: true,
      lastRefreshed: null
    } as LeaderboardSettings,
    aiPets: [] as PetLeaderboardEntry[]
  }),

  getters: {
    petExists: (state) => state.pet !== null,
    
    petLevel: (state) => state.pet?.level ?? 0,
    
    petEvolutionStage: (state) => state.pet?.evolutionStage ?? 1,
    
    petXPProgress: (state) => {
      if (!state.pet) return { current: 0, required: 100, progress: 0 }
      const required = getXPForNextLevel(state.pet.level)
      const current = state.pet.experience
      return {
        current,
        required,
        progress: Math.round((current / required) * 100)
      }
    },
    
    totalFood: (state) => {
      return state.foodInventory.basic + state.foodInventory.premium + state.foodInventory.rare
    },
    
    canFeed: (state) => {
      return state.foodInventory.basic > 0 || 
             state.foodInventory.premium > 0 || 
             state.foodInventory.rare > 0
    },
    
    studyBonus: (state) => {
      const deckStore = useDeckStore()
      return deckStore.userStats.totalCardsStudied * 0.1 + 
             deckStore.userStats.perfectExams * 5 +
             deckStore.userStats.currentStreak * 2
    },
    
    petPower: (state) => {
      if (!state.pet) return 0
      const deckStore = useDeckStore()
      const bonus = deckStore.userStats.totalCardsStudied * 0.1 + 
                   deckStore.userStats.perfectExams * 5
      return calculatePetPower(state.pet, bonus)
    },
    
    recentBattleHistory: (state) => {
      return [...state.battleHistory]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10)
    },
    
    battleWins: (state) => {
      return state.battleHistory.filter(b => b.result === 'win').length
    },
    
    battleLosses: (state) => {
      return state.battleHistory.filter(b => b.result === 'lose').length
    },
    
    winRate: (state) => {
      if (state.battleHistory.length === 0) return 0
      const wins = state.battleHistory.filter(b => b.result === 'win').length
      return Math.round((wins / state.battleHistory.length) * 100)
    },

    allLeaderboardPets: (state) => {
      const pets: PetLeaderboardEntry[] = []
      
      if (state.leaderboardSettings.simulationEnabled) {
        pets.push(...state.aiPets)
      }
      
      if (state.pet) {
        const deckStore = useDeckStore()
        const bonus = deckStore.userStats.totalCardsStudied * 0.1 + 
                     deckStore.userStats.perfectExams * 5
        const power = calculatePetPower(state.pet, bonus)
        const wins = state.battleHistory.filter(b => b.result === 'win').length
        const losses = state.battleHistory.filter(b => b.result === 'lose').length
        const totalBattles = wins + losses
        
        pets.push({
          id: state.pet.id,
          ownerName: 'You',
          petName: state.pet.name,
          level: state.pet.level,
          power: power,
          defense: state.pet.stats.defense,
          health: state.pet.stats.health,
          maxHealth: state.pet.stats.maxHealth,
          evolutionStage: state.pet.evolutionStage,
          wins,
          losses,
          winRate: totalBattles > 0 ? Math.round((wins / totalBattles) * 100) : 0,
          isPlayerPet: true,
          isAIPet: false,
          likes: state.pet.likes
        })
      }
      
      return pets
    },

    leaderboardByLevel: (state) => {
      const getter = usePetStore()
      return [...getter.allLeaderboardPets].sort((a, b) => b.level - a.level)
    },

    leaderboardByPower: (state) => {
      const getter = usePetStore()
      return [...getter.allLeaderboardPets].sort((a, b) => b.power - a.power)
    },

    leaderboardByDefense: (state) => {
      const getter = usePetStore()
      return [...getter.allLeaderboardPets].sort((a, b) => b.defense - a.defense)
    },

    leaderboardByHealth: (state) => {
      const getter = usePetStore()
      return [...getter.allLeaderboardPets].sort((a, b) => b.health - a.health)
    },

    leaderboardByBeauty: (state) => {
      const getter = usePetStore()
      return [...getter.allLeaderboardPets].sort((a, b) => {
        if (b.evolutionStage !== a.evolutionStage) {
          return b.evolutionStage - a.evolutionStage
        }
        return b.likes - a.likes
      })
    },

    topPets: (state) => {
      const getter = usePetStore()
      return getter.leaderboardByLevel.slice(0, 3)
    },

    getLeaderboardByCategory: (state) => {
      return (category: LeaderboardCategory) => {
        switch (category) {
          case 'level': return usePetStore().leaderboardByLevel
          case 'power': return usePetStore().leaderboardByPower
          case 'defense': return usePetStore().leaderboardByDefense
          case 'health': return usePetStore().leaderboardByHealth
          case 'beauty': return usePetStore().leaderboardByBeauty
          default: return usePetStore().leaderboardByLevel
        }
      }
    },

    playerRank: (state) => {
      const getter = usePetStore()
      const allPets = getter.leaderboardByLevel
      const playerIndex = allPets.findIndex(p => p.isPlayerPet)
      return {
        rank: playerIndex >= 0 ? playerIndex + 1 : null,
        total: allPets.length
      }
    },

    playerRankByCategory: (state) => {
      return (category: LeaderboardCategory) => {
        const getter = usePetStore()
        const pets = getter.getLeaderboardByCategory(category)
        const playerIndex = pets.findIndex(p => p.isPlayerPet)
        return {
          rank: playerIndex >= 0 ? playerIndex + 1 : null,
          total: pets.length
        }
      }
    }
  },

  actions: {
    createStarterPet(name: string = 'Whiskers') {
      if (this.pet) return this.pet

      const newPet: Pet = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        name,
        species: 'cat',
        level: 1,
        experience: 0,
        evolutionStage: 1,
        stats: {
          attack: 10,
          defense: 10,
          health: 100,
          maxHealth: 100
        },
        lastFed: null,
        feedingStreak: 0,
        createdAt: new Date(),
        likes: Math.floor(Math.random() * 50) + 10
      }

      this.pet = newPet
      this.saveToStorage()
      return newPet
    },

    feedPet(foodType: FoodType) {
      if (!this.pet) return null
      if (this.foodInventory[foodType] <= 0) return null

      const food = FOOD_TYPES[foodType]
      this.foodInventory[foodType]--
      
      const previousLevel = this.pet.level
      const previousStage = this.pet.evolutionStage

      this.pet.experience += food.xpValue

      if (food.statBonus) {
        if (food.statBonus.attack) {
          this.pet.stats.attack += food.statBonus.attack
        }
        if (food.statBonus.defense) {
          this.pet.stats.defense += food.statBonus.defense
        }
        if (food.statBonus.health) {
          this.pet.stats.maxHealth += food.statBonus.health
          this.pet.stats.health = this.pet.stats.maxHealth
        }
      }

      while (this.pet.experience >= getXPForNextLevel(this.pet.level)) {
        this.pet.experience -= getXPForNextLevel(this.pet.level)
        this.pet.level++
        this.pet.stats.attack += 2
        this.pet.stats.defense += 1
        this.pet.stats.maxHealth += 10
        this.pet.stats.health = this.pet.stats.maxHealth
      }

      this.pet.evolutionStage = calculateEvolutionStage(this.pet.level)
      this.pet.lastFed = new Date()

      const today = new Date().toISOString().split('T')[0]
      if (this.pet.lastFed) {
        const lastFedDate = new Date(this.pet.lastFed).toISOString().split('T')[0]
        if (lastFedDate === today) {
          this.pet.feedingStreak++
        } else {
          this.pet.feedingStreak = 1
        }
      }

      this.saveToStorage()

      if (this.pet.evolutionStage > previousStage) {
        this.hasSeenEvolution = false
        return { leveled: true, evolved: true, newStage: this.pet.evolutionStage }
      }

      if (this.pet.level > previousLevel) {
        return { leveled: true, evolved: false }
      }

      return { leveled: false, evolved: false }
    },

    addFood(type: FoodType, amount: number = 1) {
      const newTotal = this.totalFood + amount
      if (newTotal > this.maxFoodCapacity) {
        const canAdd = this.maxFoodCapacity - this.totalFood
        if (canAdd <= 0) return false
        this.foodInventory[type] += canAdd
      } else {
        this.foodInventory[type] += amount
      }
      this.saveToStorage()
      return true
    },

    generateOpponent(difficulty: 'easy' | 'medium' | 'hard'): BattleOpponent {
      const deckStore = useDeckStore()
      const playerLevel = this.pet?.level ?? 1

      let levelRange = { min: 1, max: 5 }
      if (difficulty === 'medium') {
        levelRange = { min: Math.max(1, playerLevel - 5), max: playerLevel + 5 }
      } else if (difficulty === 'hard') {
        levelRange = { min: playerLevel, max: playerLevel + 15 }
      }

      const level = Math.floor(Math.random() * (levelRange.max - levelRange.min + 1)) + levelRange.min
      const stage = calculateEvolutionStage(level)

      const baseStats: PetStats = {
        attack: 10 + level * 3,
        defense: 10 + level * 2,
        health: 100 + level * 10,
        maxHealth: 100 + level * 10
      }

      if (difficulty === 'medium') {
        baseStats.attack *= 1.2
        baseStats.defense *= 1.2
        baseStats.health *= 1.2
        baseStats.maxHealth *= 1.2
      } else if (difficulty === 'hard') {
        baseStats.attack *= 1.5
        baseStats.defense *= 1.5
        baseStats.health *= 1.5
        baseStats.maxHealth *= 1.5
      }

      const nameIndex = Math.floor(Math.random() * OPPONENT_NAMES.length)
      const speciesIndex = Math.floor(Math.random() * OPPONENT_SPECIES.length)

      return {
        id: Date.now().toString(36),
        name: OPPONENT_NAMES[nameIndex],
        species: OPPONENT_SPECIES[speciesIndex],
        level,
        evolutionStage: stage,
        stats: {
          attack: Math.round(baseStats.attack),
          defense: Math.round(baseStats.defense),
          health: Math.round(baseStats.health),
          maxHealth: Math.round(baseStats.maxHealth)
        },
        difficulty
      }
    },

    recordBattle(
      opponent: BattleOpponent,
      result: 'win' | 'lose' | 'draw',
      turnsUsed: number,
      xpEarned: number,
      foodReward?: { type: FoodType; amount: number }
    ) {
      const entry: BattleHistoryEntry = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        date: new Date(),
        opponentId: opponent.id,
        opponentName: opponent.name,
        difficulty: opponent.difficulty,
        result,
        turnsUsed,
        xpEarned,
        foodReward
      }

      this.battleHistory.push(entry)

      if (xpEarned > 0 && this.pet) {
        this.pet.experience += xpEarned
        while (this.pet && this.pet.experience >= getXPForNextLevel(this.pet.level)) {
          this.pet.experience -= getXPForNextLevel(this.pet.level)
          this.pet.level++
          this.pet.stats.attack += 2
          this.pet.stats.defense += 1
          this.pet.stats.maxHealth += 10
          this.pet.stats.health = this.pet.stats.maxHealth
        }
        this.pet.evolutionStage = this.pet ? calculateEvolutionStage(this.pet.level) : 1
      }

      if (foodReward) {
        this.addFood(foodReward.type, foodReward.amount)
      }

      this.saveToStorage()
      return entry
    },

    renamePet(newName: string) {
      if (this.pet) {
        this.pet.name = newName
        this.saveToStorage()
      }
    },

    saveToStorage() {
      if (typeof window !== 'undefined') {
        const data = {
          pet: this.pet,
          foodInventory: this.foodInventory,
          battleHistory: this.battleHistory.map(h => ({
            ...h,
            date: h.date instanceof Date ? h.date.toISOString() : h.date
          })),
          maxFoodCapacity: this.maxFoodCapacity,
          hasSeenEvolution: this.hasSeenEvolution
        }
        localStorage.setItem('pet-store', JSON.stringify(data))
      }
    },

    loadFromStorage() {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('pet-store')
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            if (parsed.pet) {
              this.pet = {
                ...parsed.pet,
                lastFed: parsed.pet.lastFed ? new Date(parsed.pet.lastFed) : null,
                createdAt: new Date(parsed.pet.createdAt)
              }
            }
            if (parsed.foodInventory) {
              this.foodInventory = parsed.foodInventory
            }
            if (parsed.battleHistory) {
              this.battleHistory = parsed.battleHistory.map((h: any) => ({
                ...h,
                date: new Date(h.date)
              }))
            }
            if (parsed.maxFoodCapacity) {
              this.maxFoodCapacity = parsed.maxFoodCapacity
            }
            if (parsed.hasSeenEvolution !== undefined) {
              this.hasSeenEvolution = parsed.hasSeenEvolution
            }
          } catch (e) {
            console.error('Failed to load pet store:', e)
          }
        }
        
        this.loadLeaderboardSettings()
        this.generateSamplePets()
      }
    },

    generateSamplePets() {
      const pets: PetLeaderboardEntry[] = []
      
      for (let i = 0; i < 20; i++) {
        const level = Math.floor(Math.random() * 75) + 5
        const stage = calculateEvolutionStage(level) as EvolutionStage
        
        const baseStats: PetStats = {
          attack: 10 + level * 3,
          defense: 10 + level * 2,
          health: 100 + level * 10,
          maxHealth: 100 + level * 10
        }
        
        const power = Math.round((level * 2 + baseStats.attack * 0.5 + baseStats.defense * 0.3) * STAT_MULTIPLIERS[stage])
        
        const totalBattles = Math.floor(Math.random() * 100) + 20
        const winRate = Math.floor(Math.random() * 40) + 40
        const wins = Math.round(totalBattles * (winRate / 100))
        const losses = totalBattles - wins
        
        const nameIndex = Math.floor(Math.random() * OPPONENT_NAMES.length)
        
        pets.push({
          id: `ai-${i}-${Date.now()}`,
          ownerName: AI_TRAINER_NAMES[i % AI_TRAINER_NAMES.length],
          petName: OPPONENT_NAMES[nameIndex],
          level,
          power,
          defense: Math.round(baseStats.defense),
          health: Math.round(baseStats.health),
          maxHealth: Math.round(baseStats.maxHealth),
          evolutionStage: stage,
          wins,
          losses,
          winRate,
          isPlayerPet: false,
          isAIPet: true,
          likes: Math.floor(Math.random() * 500) + 50
        })
      }
      
      this.aiPets = pets
      this.leaderboardSettings.lastRefreshed = new Date().toISOString()
    },

    likePet(petId: string) {
      if (this.pet && this.pet.id === petId) {
        this.pet.likes++
        this.saveToStorage()
      }
    },

    refreshLeaderboard() {
      this.generateSamplePets()
      this.saveLeaderboardSettings()
    },

    saveLeaderboardSettings() {
      if (typeof window !== 'undefined') {
        localStorage.setItem('pet-leaderboard-settings', JSON.stringify(this.leaderboardSettings))
      }
    },

    loadLeaderboardSettings() {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('pet-leaderboard-settings')
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            this.leaderboardSettings = { ...this.leaderboardSettings, ...parsed }
          } catch (e) {
            console.error('Failed to load leaderboard settings:', e)
          }
        }
      }
    },

    toggleSimulation() {
      this.leaderboardSettings.simulationEnabled = !this.leaderboardSettings.simulationEnabled
      this.saveLeaderboardSettings()
    },

    resetPetData() {
      this.pet = null
      this.foodInventory = { basic: 0, premium: 0, rare: 0 }
      this.battleHistory = []
      this.hasSeenEvolution = false
      this.aiPets = []
      this.saveToStorage()
    }
  }
})
