import { defineStore } from 'pinia'
import { calculateScore, getGrade, type ExamAnswer, type ExamResult, type LeaderboardEntry } from '~/types/exam'
import { calculateLevel, getXPForNextLevel, getStreakMultiplier, ALL_BADGES, CHALLENGE_TEMPLATES, type UserStats, type DailyChallenge } from '~/types/gamification'

export type DeckCategory = 'hsk' | 'toeic' | 'general'
export type DeckDifficulty = 'beginner' | 'intermediate' | 'advanced'
export type DeckLanguage = 'chinese' | 'english' | 'general'

export interface Card {
  id: string
  front: string
  back: string
  hint?: string
  difficulty?: 'again' | 'hard' | 'good' | 'easy'
  lastReviewed?: Date
  reviewCount: number
}

export interface Deck {
  id: string
  name: string
  description?: string
  cards: Card[]
  createdAt: Date
  lastStudied?: Date
  category?: DeckCategory
  difficulty?: DeckDifficulty
  language?: DeckLanguage
  isPreBuilt?: boolean
  deckIcon?: string
  tags?: string[]
  version?: string
}

interface PrebuiltDeckData {
  id: string
  name: string
  description?: string
  category: DeckCategory
  difficulty: DeckDifficulty
  language: DeckLanguage
  isPreBuilt: boolean
  deckIcon?: string
  tags?: string[]
  cards: { front: string; back: string; hint?: string }[]
}

interface PrebuiltDataFile {
  version: string
  lastUpdated: string
  decks: PrebuiltDeckData[]
}

export const useDeckStore = defineStore('deck', {
  state: () => ({
    decks: [] as Deck[],
    currentDeckId: null as string | null,
    examResults: {} as Record<string, ExamResult[]>,
    leaderboard: {} as Record<string, LeaderboardEntry>,
    userStats: {
      totalXP: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: '',
      totalStudyTime: 0,
      totalCardsStudied: 0,
      totalExamsTaken: 0,
      perfectExams: 0,
      unlockedBadges: [],
      completedChallenges: [],
      dailyChallengesCompleted: 0,
      weeklyChallengesCompleted: 0,
      onboardingCompleted: false,
      createdAt: new Date().toISOString()
    } as UserStats,
    dailyChallenges: [] as DailyChallenge[],
    prebuiltVersion: ''
  }),

  getters: {
    currentDeck: (state) => {
      return state.decks.find(d => d.id === state.currentDeckId)
    },

    getDeckById: (state) => {
      return (id: string) => state.decks.find(d => d.id === id)
    },

    totalCards: (state) => {
      return state.decks.reduce((sum, deck) => sum + deck.cards.length, 0)
    },

    totalDecks: (state) => {
      return state.decks.length
    },

    getLeaderboard: (state) => {
      return (deckId: string) => {
        const entries = state.examResults[deckId] || []
        return entries.map(result => ({
          deckId: result.deckId,
          score: result.score,
          grade: result.grade,
          completedAt: result.completedAt,
          attemptNumber: result.attemptNumber
        })).sort((a, b) => b.score - a.score)
      }
    },

    getBestScore: (state) => {
      return (deckId: string) => {
        const results = state.examResults[deckId] || []
        if (results.length === 0) return null
        return Math.max(...results.map(r => r.score))
      }
    },

    getExamAttemptCount: (state) => {
      return (deckId: string) => {
        return (state.examResults[deckId] || []).length
      }
    },

    getLastExamResult: (state) => {
      return (deckId: string) => {
        const results = state.examResults[deckId] || []
        if (results.length === 0) return null
        return results[results.length - 1]
      }
    },

    userLevel: (state) => {
      return calculateLevel(state.userStats.totalXP)
    },

    xpProgress: (state) => {
      return getXPForNextLevel(state.userStats.totalXP)
    },

    streakMultiplier: (state) => {
      return getStreakMultiplier(state.userStats.currentStreak)
    },

    unlockedBadgesList: (state) => {
      return ALL_BADGES.filter(badge => state.userStats.unlockedBadges.includes(badge.id))
    },

    lockedBadgesList: (state) => {
      return ALL_BADGES.filter(badge => !state.userStats.unlockedBadges.includes(badge.id))
    },

    getDecksByCategory: (state) => {
      return (category: DeckCategory) => state.decks.filter(d => d.category === category)
    },

    getDecksByDifficulty: (state) => {
      return (difficulty: DeckDifficulty) => state.decks.filter(d => d.difficulty === difficulty)
    },

    getPrebuiltDecks: (state) => {
      return state.decks.filter(d => d.isPreBuilt)
    },

    getCustomDecks: (state) => {
      return state.decks.filter(d => !d.isPreBuilt)
    },

    getActiveChallenges: (state) => {
      return state.dailyChallenges.filter(c => !c.isCompleted)
    },

    getCompletedChallenges: (state) => {
      return state.dailyChallenges.filter(c => c.isCompleted)
    },

    recentDecks: (state) => {
      return [...state.decks]
        .filter(d => d.lastStudied)
        .sort((a, b) => new Date(b.lastStudied!).getTime() - new Date(a.lastStudied!).getTime())
        .slice(0, 5)
    }
  },

  actions: {
    createDeck(name: string, description?: string, category: DeckCategory = 'general', difficulty: DeckDifficulty = 'beginner', language: DeckLanguage = 'general') {
      const newDeck: Deck = {
        id: this.generateId(),
        name,
        description,
        cards: [],
        createdAt: new Date(),
        category,
        difficulty,
        language,
        isPreBuilt: false
      }
      this.decks.push(newDeck)
      this.checkBadges()
      this.saveToStorage()
      return newDeck
    },

    updateDeck(id: string, updates: Partial<Pick<Deck, 'name' | 'description' | 'category' | 'difficulty' | 'language'>>) {
      const deck = this.getDeckById(id)
      if (deck) {
        Object.assign(deck, updates)
        this.saveToStorage()
      }
    },

    deleteDeck(id: string) {
      const index = this.decks.findIndex(d => d.id === id)
      if (index !== -1) {
        this.decks.splice(index, 1)
        delete this.examResults[id]
        delete this.leaderboard[id]
        this.saveToStorage()
      }
    },

    addCardToDeck(deckId: string, front: string, back: string, hint?: string) {
      const deck = this.getDeckById(deckId)
      if (deck) {
        const newCard: Card = {
          id: this.generateId(),
          front,
          back,
          hint,
          reviewCount: 0
        }
        deck.cards.push(newCard)
        this.checkBadges()
        this.saveToStorage()
        return newCard
      }
      return null
    },

    addMultipleCardsToDeck(deckId: string, cards: { front: string; back: string; hint?: string }[]) {
      const deck = this.getDeckById(deckId)
      if (deck) {
        const newCards = cards.map(c => ({
          id: this.generateId(),
          front: c.front,
          back: c.back,
          hint: c.hint,
          reviewCount: 0
        } as Card))
        deck.cards.push(...newCards)
        this.saveToStorage()
        return newCards
      }
      return []
    },

    updateCard(deckId: string, cardId: string, updates: Partial<Pick<Card, 'front' | 'back' | 'hint'>>) {
      const deck = this.getDeckById(deckId)
      if (deck) {
        const card = deck.cards.find(c => c.id === cardId)
        if (card) {
          Object.assign(card, updates)
          this.saveToStorage()
        }
      }
    },

    deleteCard(deckId: string, cardId: string) {
      const deck = this.getDeckById(deckId)
      if (deck) {
        const index = deck.cards.findIndex(c => c.id === cardId)
        if (index !== -1) {
          deck.cards.splice(index, 1)
          this.saveToStorage()
        }
      }
    },

    markDeckStudied(deckId: string) {
      const deck = this.getDeckById(deckId)
      if (deck) {
        deck.lastStudied = new Date()
        this.updateStreak()
        this.saveToStorage()
      }
    },

    setCurrentDeck(deckId: string | null) {
      this.currentDeckId = deckId
    },

    generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2)
    },

    saveToStorage() {
      if (typeof window !== 'undefined') {
        const data = {
          decks: this.decks,
          examResults: this.examResults,
          leaderboard: this.leaderboard,
          userStats: this.userStats,
          dailyChallenges: this.dailyChallenges,
          prebuiltVersion: this.prebuiltVersion
        }
        localStorage.setItem('flashcard-decks', JSON.stringify(data))
      }
    },

    loadFromStorage() {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('flashcard-decks')
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            if (parsed.decks) {
              this.decks = parsed.decks.map((deck: any) => ({
                ...deck,
                createdAt: new Date(deck.createdAt),
                lastStudied: deck.lastStudied ? new Date(deck.lastStudied) : undefined
              }))
            }
            if (parsed.examResults) {
              this.examResults = parsed.examResults
              Object.keys(this.examResults).forEach(deckId => {
                this.examResults[deckId] = this.examResults[deckId].map((result: any) => ({
                  ...result,
                  completedAt: new Date(result.completedAt)
                }))
              })
            }
            if (parsed.leaderboard) {
              this.leaderboard = parsed.leaderboard
              Object.keys(this.leaderboard).forEach(deckId => {
                if (this.leaderboard[deckId].lastAttempt) {
                  this.leaderboard[deckId].lastAttempt = new Date(this.leaderboard[deckId].lastAttempt)
                }
              })
            }
            if (parsed.userStats) {
              this.userStats = parsed.userStats
            }
            if (parsed.dailyChallenges) {
              this.dailyChallenges = parsed.dailyChallenges
            }
            if (parsed.prebuiltVersion) {
              this.prebuiltVersion = parsed.prebuiltVersion
            }
          } catch (e) {
            console.error('Failed to load decks from storage:', e)
          }
        }
      }
    },

    async loadPrebuiltDecks() {
      const dataFiles = [
        '/data/hskDecks.json',
        '/data/toeicDecks.json',
        '/data/generalDecks.json'
      ]

      for (const file of dataFiles) {
        try {
          const response = await fetch(file)
          if (response.ok) {
            const data: PrebuiltDataFile = await response.json()
            
            for (const deckData of data.decks) {
              const existingDeck = this.decks.find(d => d.id === deckData.id)
              if (!existingDeck) {
                const newDeck: Deck = {
                  id: deckData.id,
                  name: deckData.name,
                  description: deckData.description,
                  cards: deckData.cards.map(c => ({
                    id: this.generateId(),
                    front: c.front,
                    back: c.back,
                    hint: c.hint,
                    reviewCount: 0
                  })),
                  createdAt: new Date(),
                  category: deckData.category,
                  difficulty: deckData.difficulty,
                  language: deckData.language,
                  isPreBuilt: true,
                  deckIcon: deckData.deckIcon,
                  tags: deckData.tags,
                  version: data.version
                }
                this.decks.push(newDeck)
              } else if (existingDeck.version !== data.version) {
                const existingCardIds = existingDeck.cards.map(c => `${c.front}-${c.back}`)
                const newCards = deckData.cards
                  .filter(c => !existingCardIds.includes(`${c.front}-${c.back}`))
                  .map(c => ({
                    id: this.generateId(),
                    front: c.front,
                    back: c.back,
                    hint: c.hint,
                    reviewCount: 0
                  }))
                if (newCards.length > 0) {
                  existingDeck.cards.push(...newCards)
                }
                existingDeck.version = data.version
              }
            }
            this.prebuiltVersion = data.version
          }
        } catch (e) {
          console.error(`Failed to load ${file}:`, e)
        }
      }

      this.saveToStorage()
    },

    saveExamResult(deckId: string, answers: ExamAnswer[]) {
      const { score, correct, total } = calculateScore(answers)
      const grade = getGrade(score)
      const attemptNumber = (this.examResults[deckId]?.length || 0) + 1
      const questionType = answers.length > 0 ? answers[0].questionType : 'input'

      const result: ExamResult = {
        id: this.generateId(),
        deckId,
        score,
        correct,
        total,
        grade,
        completedAt: new Date(),
        answers,
        attemptNumber,
        questionType
      }

      if (!this.examResults[deckId]) {
        this.examResults[deckId] = []
      }
      this.examResults[deckId].push(result)

      const currentBest = this.leaderboard[deckId]
      const isNewBest = !currentBest || score > currentBest.bestScore

      if (isNewBest) {
        this.leaderboard[deckId] = {
          deckId,
          bestScore: score,
          bestGrade: grade,
          attempts: attemptNumber,
          lastAttempt: new Date()
        }
      } else {
        this.leaderboard[deckId].attempts = attemptNumber
        this.leaderboard[deckId].lastAttempt = new Date()
      }

      this.userStats.totalExamsTaken++
      if (score === 100) {
        this.userStats.perfectExams++
      }

      const baseXP = 50
      const scoreBonus = Math.round(score * 2)
      this.awardXP(baseXP + scoreBonus)

      this.updateChallengeProgress('exam', 1)
      this.checkBadges()

      this.saveToStorage()
      return result
    },

    getLeaderboardForDeck(deckId: string) {
      return this.getLeaderboard(deckId)
    },

    clearExamHistory(deckId: string) {
      delete this.examResults[deckId]
      delete this.leaderboard[deckId]
      this.saveToStorage()
    },

    awardXP(amount: number) {
      const multiplier = getStreakMultiplier(this.userStats.currentStreak)
      const finalAmount = Math.round(amount * multiplier)
      this.userStats.totalXP += finalAmount
      this.userStats.level = calculateLevel(this.userStats.totalXP)
      this.checkBadges()
      this.saveToStorage()
    },

    updateStreak() {
      const today = new Date().toISOString().split('T')[0]
      
      if (this.userStats.lastStudyDate === today) {
        return
      }

      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      if (this.userStats.lastStudyDate === yesterdayStr) {
        this.userStats.currentStreak++
      } else if (this.userStats.lastStudyDate !== today) {
        this.userStats.currentStreak = 1
      }

      if (this.userStats.currentStreak > this.userStats.longestStreak) {
        this.userStats.longestStreak = this.userStats.currentStreak
      }

      this.userStats.lastStudyDate = today
      this.checkBadges()
      this.saveToStorage()
    },

    unlockBadge(badgeId: string) {
      if (!this.userStats.unlockedBadges.includes(badgeId)) {
        this.userStats.unlockedBadges.push(badgeId)
        const badge = ALL_BADGES.find(b => b.id === badgeId)
        if (badge) {
          this.userStats.totalXP += badge.xpReward
          this.userStats.level = calculateLevel(this.userStats.totalXP)
        }
        this.saveToStorage()
        return true
      }
      return false
    },

    checkBadges() {
      if (this.userStats.totalCardsStudied >= 1 && !this.userStats.unlockedBadges.includes('first-steps')) {
        this.unlockBadge('first-steps')
      }

      if (this.userStats.currentStreak >= 3 && !this.userStats.unlockedBadges.includes('streak-3')) {
        this.unlockBadge('streak-3')
      }

      if (this.userStats.currentStreak >= 7 && !this.userStats.unlockedBadges.includes('streak-7')) {
        this.unlockBadge('streak-7')
      }

      if (this.userStats.currentStreak >= 30 && !this.userStats.unlockedBadges.includes('streak-30')) {
        this.unlockBadge('streak-30')
      }

      if (this.userStats.perfectExams >= 1 && !this.userStats.unlockedBadges.includes('perfect-score')) {
        this.unlockBadge('perfect-score')
      }

      if (this.userStats.perfectExams >= 3 && !this.userStats.unlockedBadges.includes('perfectionist')) {
        this.unlockBadge('perfectionist')
      }

      if (this.userStats.totalCardsStudied >= 10 && !this.userStats.unlockedBadges.includes('century')) {
        this.unlockBadge('century')
      }

      if (this.userStats.totalCardsStudied >= 500 && !this.userStats.unlockedBadges.includes('marathon')) {
        this.unlockBadge('marathon')
      }

      const totalCreatedCards = this.decks
        .filter(d => !d.isPreBuilt)
        .reduce((sum, d) => sum + d.cards.length, 0)
      if (totalCreatedCards >= 10 && !this.userStats.unlockedBadges.includes('card-collector')) {
        this.unlockBadge('card-collector')
      }

      const customDecks = this.decks.filter(d => !d.isPreBuilt).length
      if (customDecks >= 3 && !this.userStats.unlockedBadges.includes('deck-builder')) {
        this.unlockBadge('deck-builder')
      }

      const hskDecks = this.getDecksByCategory('hsk')
      if (hskDecks.length >= 1 && !this.userStats.unlockedBadges.includes('hsk-beginner')) {
        this.unlockBadge('hsk-beginner')
      }

      const toeicDecks = this.getDecksByCategory('toeic')
      if (toeicDecks.length >= 1 && !this.userStats.unlockedBadges.includes('toeic-prep')) {
        this.unlockBadge('toeic-prep')
      }

      if (this.userStats.level >= 10 && !this.userStats.unlockedBadges.includes('level-10')) {
        this.unlockBadge('level-10')
      }

      if (this.userStats.level >= 25 && !this.userStats.unlockedBadges.includes('level-25')) {
        this.unlockBadge('level-25')
      }

      if (this.userStats.level >= 50 && !this.userStats.unlockedBadges.includes('level-50')) {
        this.unlockBadge('level-50')
      }

      const hour = new Date().getHours()
      if (hour >= 22 || hour < 5) {
        this.unlockBadge('night-owl')
      }
      if (hour >= 5 && hour < 7) {
        this.unlockBadge('early-bird')
      }
    },

    generateDailyChallenges() {
      const today = new Date().toISOString().split('T')[0]
      const existingToday = this.dailyChallenges.find(c => c.expiresAt.startsWith(today))
      
      if (!existingToday) {
        this.dailyChallenges = []
        const templates = CHALLENGE_TEMPLATES.filter(t => t.type === 'cards' || t.type === 'study')
        const selected = templates.slice(0, 3)

        this.dailyChallenges = selected.map(template => ({
          ...template,
          progress: 0,
          isCompleted: false,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }))

        this.saveToStorage()
      }
    },

    updateChallengeProgress(type: 'study' | 'exam' | 'cards', amount: number) {
      for (const challenge of this.dailyChallenges) {
        if (challenge.type === type && !challenge.isCompleted) {
          challenge.progress += amount
          if (challenge.progress >= challenge.target) {
            challenge.isCompleted = true
            this.userStats.dailyChallengesCompleted++
            this.awardXP(challenge.xpReward)
          }
        }
      }
      this.saveToStorage()
    },

    recordCardsStudied(count: number) {
      this.userStats.totalCardsStudied += count
      this.updateChallengeProgress('cards', count)
      this.checkBadges()
      this.saveToStorage()
    },

    skipOnboarding() {
      this.userStats.onboardingCompleted = true
      this.saveToStorage()
    },

    resetProgress() {
      this.userStats = {
        totalXP: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: '',
        totalStudyTime: 0,
        totalCardsStudied: 0,
        totalExamsTaken: 0,
        perfectExams: 0,
        unlockedBadges: [],
        completedChallenges: [],
        dailyChallengesCompleted: 0,
        weeklyChallengesCompleted: 0,
        onboardingCompleted: true,
        createdAt: new Date().toISOString()
      }
      this.examResults = {}
      this.leaderboard = {}
      this.dailyChallenges = []
      this.saveToStorage()
    }
  }
})
