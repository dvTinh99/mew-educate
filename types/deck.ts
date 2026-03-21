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

export interface PrebuiltDeckData {
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

export interface PrebuiltDataFile {
  version: string
  lastUpdated: string
  decks: PrebuiltDeckData[]
}
