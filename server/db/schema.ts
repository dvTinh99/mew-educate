import { pgTable, text, integer, boolean, timestamp, jsonb, uuid, pgEnum, serial, primaryKey } from 'drizzle-orm/pg-core'

// ============ ENUMS ============

export const speciesEnum = pgEnum('species', ['cat'])

export const categoryEnum = pgEnum('category', ['hsk', 'toeic', 'general'])

export const difficultyEnum = pgEnum('difficulty', ['beginner', 'intermediate', 'advanced'])

export const languageEnum = pgEnum('language', ['chinese', 'english', 'general'])

export const evolutionEnum = pgEnum('evolution', ['1', '2', '3'])

export const battleDifficultyEnum = pgEnum('battle_difficulty', ['easy', 'medium', 'hard'])

export const battleResultEnum = pgEnum('battle_result', ['win', 'lose', 'draw'])

export const badgeCategoryEnum = pgEnum('badge_category', ['streak', 'study', 'exam', 'social', 'milestone'])

export const questionTypeEnum = pgEnum('question_type', ['input', 'multiple-choice'])

export const gradeEnum = pgEnum('grade', ['A', 'B', 'C', 'D', 'F'])

export const challengeTypeEnum = pgEnum('challenge_type', ['study', 'exam', 'cards'])

export const inquiryCategoryEnum = pgEnum('inquiry_category', ['bug', 'feature', 'question', 'other'])

// ============ USERS (synced with NextAuth) ============

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password: text('password'),
  phone: text('phone'),
  emailVerifiedAt: text('email_verified_at'),
  rememberToken: text('remember_token'),
  isAdmin: text('is_admin'),
  turnUsed: integer('turn_used'),
  turnRemaining: text('turn_remaining'),
  createdAt: text('created_at'),
  updatedAt: text('updated_at'),
})

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { withTimezone: true }).notNull(),
})

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
})

export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { withTimezone: true }).notNull(),
}, (table) => ({
  compositePk: primaryKey({ columns: [table.identifier, table.token] }),
}))

// ============ USER STATS ============

export const userStats = pgTable('user_stats', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  totalXP: integer('total_xp').default(0).notNull(),
  level: integer('level').default(1).notNull(),
  currentStreak: integer('current_streak').default(0).notNull(),
  longestStreak: integer('longest_streak').default(0).notNull(),
  lastStudyDate: text('last_study_date'),
  totalStudyTime: integer('total_study_time').default(0).notNull(),
  totalCardsStudied: integer('total_cards_studied').default(0).notNull(),
  totalExamsTaken: integer('total_exams_taken').default(0).notNull(),
  perfectExams: integer('perfect_exams').default(0).notNull(),
  dailyChallengesCompleted: integer('daily_challenges_completed').default(0).notNull(),
  weeklyChallengesCompleted: integer('weekly_challenges_completed').default(0).notNull(),
  onboardingCompleted: boolean('onboarding_completed').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// ============ DECKS ============

export const decks = pgTable('decks', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  category: categoryEnum('category'),
  difficulty: difficultyEnum('difficulty'),
  language: languageEnum('language'),
  isPreBuilt: boolean('is_pre_built').default(false).notNull(),
  deckIcon: text('deck_icon'),
  tags: text('tags').array(),
  version: text('version'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  lastStudied: timestamp('last_studied', { withTimezone: true }),
})

// ============ CARDS ============

export const cards = pgTable('cards', {
  id: text('id').primaryKey(),
  deckId: text('deck_id').notNull().references(() => decks.id, { onDelete: 'cascade' }),
  front: text('front').notNull(),
  back: text('back').notNull(),
  frontLang: text('front_lang').default('en'),
  backLang: text('back_lang').default('en'),
  hint: text('hint'),
  reviewCount: integer('review_count').default(0).notNull(),
  lastReviewed: timestamp('last_reviewed', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

// ============ EXAM RESULTS ============

export const examResults = pgTable('exam_results', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  deckId: text('deck_id').notNull().references(() => decks.id, { onDelete: 'cascade' }),
  score: integer('score').notNull(),
  correct: integer('correct').notNull(),
  total: integer('total').notNull(),
  grade: gradeEnum('grade').notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }).defaultNow().notNull(),
  answers: jsonb('answers').$type<Array<{
    cardId: string
    cardIndex: number
    userAnswer: string
    correctAnswer: string
    isCorrect: boolean
    timeSpent: number
    questionType: 'input' | 'multiple-choice'
  }>>(),
  attemptNumber: integer('attempt_number').default(1).notNull(),
  questionType: questionTypeEnum('question_type'),
})

// ============ PETS ============

export const pets = pgTable('pets', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  name: text('name').notNull(),
  species: speciesEnum('species').default('cat').notNull(),
  level: integer('level').default(1).notNull(),
  experience: integer('experience').default(0).notNull(),
  evolutionStage: evolutionEnum('evolution_stage').default('1').notNull(),
  stats: jsonb('stats').$type<{
    attack: number
    defense: number
    health: number
    maxHealth: number
  }>().default({ attack: 10, defense: 10, health: 100, maxHealth: 100 }).notNull(),
  abilityPoints: integer('ability_points').default(0).notNull(),
  spentAbilityPoints: jsonb('spent_ability_points').$type<{
    attack: number
    defense: number
    health: number
  }>().default({ attack: 0, defense: 0, health: 0 }).notNull(),
  lastFed: timestamp('last_fed', { withTimezone: true }),
  feedingStreak: integer('feeding_streak').default(0).notNull(),
  likes: integer('likes').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

// ============ FOOD INVENTORY ============

export const foodInventory = pgTable('food_inventory', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  basic: integer('basic').default(10).notNull(),
  premium: integer('premium').default(2).notNull(),
  rare: integer('rare').default(0).notNull(),
  maxCapacity: integer('max_capacity').default(100).notNull(),
})

// ============ BATTLE HISTORY ============

export const battleHistory = pgTable('battle_history', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  opponentId: text('opponent_id'),
  opponentName: text('opponent_name'),
  difficulty: battleDifficultyEnum('difficulty'),
  result: battleResultEnum('result').notNull(),
  turnsUsed: integer('turns_used'),
  xpEarned: integer('xp_earned').default(0).notNull(),
  date: timestamp('date', { withTimezone: true }).defaultNow().notNull(),
})

// ============ DAILY CHALLENGES ============

export const dailyChallenges = pgTable('daily_challenges', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: challengeTypeEnum('type').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  target: integer('target').notNull(),
  progress: integer('progress').default(0).notNull(),
  xpReward: integer('xp_reward').default(0).notNull(),
  isCompleted: boolean('is_completed').default(false).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  date: timestamp('date', { withTimezone: true }).defaultNow().notNull(),
})

// ============ BADGES ============

export const badges = pgTable('badges', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  icon: text('icon'),
  xpReward: integer('xp_reward').default(0).notNull(),
  category: badgeCategoryEnum('category'),
})

export const userBadges = pgTable('user_badges', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  badgeId: text('badge_id').notNull().references(() => badges.id),
  unlockedAt: timestamp('unlocked_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  compositePk: primaryKey({ columns: [table.userId, table.badgeId] }),
}))

// ============ INQUIRIES ============

export const inquiries = pgTable('inquiries', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  category: inquiryCategoryEnum('category').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

// ============ LEADERBOARD ============

export const leaderboard = pgTable('leaderboard', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  petName: text('pet_name'),
  level: integer('level').default(0).notNull(),
  power: integer('power').default(0).notNull(),
  defense: integer('defense').default(0).notNull(),
  health: integer('health').default(0).notNull(),
  likes: integer('likes').default(0).notNull(),
  wins: integer('wins').default(0).notNull(),
  losses: integer('losses').default(0).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// ============ TYPE EXPORTS ============

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Deck = typeof decks.$inferSelect
export type NewDeck = typeof decks.$inferInsert
export type Card = typeof cards.$inferSelect
export type NewCard = typeof cards.$inferInsert
export type Pet = typeof pets.$inferSelect & { evolutionStage: 1 | 2 | 3 }
export type NewPet = typeof pets.$inferInsert
export type FoodInventoryType = typeof foodInventory.$inferSelect
export type BattleHistoryEntry = typeof battleHistory.$inferSelect
export type ExamResult = typeof examResults.$inferSelect
export type UserStat = typeof userStats.$inferSelect
export type LeaderboardEntry = typeof leaderboard.$inferSelect
