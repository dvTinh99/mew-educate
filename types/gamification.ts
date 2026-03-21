export interface UserStats {
  totalXP: number
  level: number
  currentStreak: number
  longestStreak: number
  lastStudyDate: string
  totalStudyTime: number
  totalCardsStudied: number
  totalExamsTaken: number
  perfectExams: number
  unlockedBadges: string[]
  completedChallenges: string[]
  dailyChallengesCompleted: number
  weeklyChallengesCompleted: number
  onboardingCompleted: boolean
  createdAt: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  xpReward: number
  category: 'streak' | 'study' | 'exam' | 'social' | 'milestone'
}

export interface DailyChallenge {
  id: string
  type: 'study' | 'exam' | 'cards'
  title: string
  description: string
  target: number
  progress: number
  xpReward: number
  isCompleted: boolean
  expiresAt: string
}

export interface ChallengeTemplate {
  id: string
  type: 'study' | 'exam' | 'cards'
  title: string
  description: string
  target: number
  xpReward: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  xpReward: number
  unlockedAt?: string
}

export interface StudyRecord {
  date: string
  cardsStudied: number
  xpEarned: number
  examsTaken: number
  timeSpent: number
  accuracy: number
}

export function calculateLevel(totalXP: number): number {
  let level = 1
  let xpRequired = 100
  let accumulatedXP = 0
  
  while (accumulatedXP + xpRequired <= totalXP && level < 100) {
    accumulatedXP += xpRequired
    level++
    xpRequired = calculateXPForLevel(level)
  }
  
  return level
}

export function calculateXPForLevel(level: number): number {
  return level * 100 + Math.pow(level, 2) * 10
}

export function getXPForNextLevel(currentXP: number): { current: number; required: number; progress: number } {
  const level = calculateLevel(currentXP)
  const currentLevelXP = getTotalXPForLevel(level - 1)
  const nextLevelXP = getTotalXPForLevel(level)
  const required = nextLevelXP - currentLevelXP
  const current = currentXP - currentLevelXP
  const progress = Math.round((current / required) * 100)
  
  return { current, required, progress }
}

export function getTotalXPForLevel(level: number): number {
  let total = 0
  for (let i = 1; i < level; i++) {
    total += calculateXPForLevel(i)
  }
  return total
}

export function getStreakMultiplier(streak: number): number {
  return Math.min(1 + (streak * 0.1), 2.0)
}

export const ALL_BADGES: Badge[] = [
  { id: 'first-steps', name: 'First Steps', description: 'Complete your first study session', icon: 'rocket', xpReward: 50, category: 'milestone' },
  { id: 'streak-3', name: 'Streak Starter', description: 'Maintain a 3-day streak', icon: 'fire', xpReward: 100, category: 'streak' },
  { id: 'streak-7', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: 'shield', xpReward: 250, category: 'streak' },
  { id: 'streak-30', name: 'Month Master', description: 'Maintain a 30-day streak', icon: 'crown', xpReward: 1000, category: 'streak' },
  { id: 'perfect-score', name: 'Perfect Score', description: 'Get 100% on an exam', icon: 'star', xpReward: 200, category: 'exam' },
  { id: 'speed-demon', name: 'Speed Demon', description: 'Finish an exam with time to spare', icon: 'bolt', xpReward: 100, category: 'exam' },
  { id: 'card-collector', name: 'Card Collector', description: 'Create 10 cards', icon: 'cards', xpReward: 100, category: 'study' },
  { id: 'deck-builder', name: 'Deck Builder', description: 'Create 3 decks', icon: 'folder', xpReward: 200, category: 'study' },
  { id: 'hsk-beginner', name: 'HSK Beginner', description: 'Complete all HSK 1 decks', icon: 'chinese', xpReward: 300, category: 'milestone' },
  { id: 'toeic-prep', name: 'TOEIC Prep', description: 'Complete a TOEIC deck', icon: 'english', xpReward: 300, category: 'milestone' },
  { id: 'century', name: 'Century', description: 'Study 100 cards', icon: 'hundred', xpReward: 150, category: 'study' },
  { id: 'marathon', name: 'Marathon', description: 'Study 500 cards', icon: 'medal', xpReward: 500, category: 'study' },
  { id: 'perfectionist', name: 'Perfectionist', description: 'Get 100% on 3 exams', icon: 'trophy', xpReward: 500, category: 'exam' },
  { id: 'night-owl', name: 'Night Owl', description: 'Study after 10pm', icon: 'moon', xpReward: 50, category: 'social' },
  { id: 'early-bird', name: 'Early Bird', description: 'Study before 7am', icon: 'sun', xpReward: 50, category: 'social' },
  { id: 'level-10', name: 'Rising Star', description: 'Reach level 10', icon: 'star', xpReward: 200, category: 'milestone' },
  { id: 'level-25', name: 'Dedicated Learner', description: 'Reach level 25', icon: 'medal', xpReward: 500, category: 'milestone' },
  { id: 'level-50', name: 'Expert', description: 'Reach level 50', icon: 'crown', xpReward: 1000, category: 'milestone' },
]

export const CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  { id: 'daily-cards-10', type: 'cards', title: 'Quick Study', description: 'Study 10 cards today', target: 10, xpReward: 30 },
  { id: 'daily-cards-30', type: 'cards', title: 'Card Champion', description: 'Study 30 cards today', target: 30, xpReward: 75 },
  { id: 'daily-study-1', type: 'study', title: 'First Steps', description: 'Complete 1 study session', target: 1, xpReward: 50 },
  { id: 'daily-exam-1', type: 'exam', title: 'Exam Ready', description: 'Complete 1 exam', target: 1, xpReward: 100 },
  { id: 'weekly-cards-100', type: 'cards', title: 'Weekly Warrior', description: 'Study 100 cards this week', target: 100, xpReward: 200 },
]
