import type { Card } from '~/stores/deck'

export type ExamQuestionType = 'input' | 'multiple-choice'

export interface MultipleChoiceOption {
  label: string
  value: string
  isCorrect: boolean
}

export interface ExamAnswer {
  cardId: string
  cardIndex: number
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  timeSpent: number
  questionType: ExamQuestionType
}

export interface ExamResult {
  id: string
  deckId: string
  score: number
  correct: number
  total: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  completedAt: Date
  answers: ExamAnswer[]
  attemptNumber: number
  questionType: ExamQuestionType
}

export interface LeaderboardEntry {
  deckId: string
  bestScore: number
  bestGrade: 'A' | 'B' | 'C' | 'D' | 'F'
  attempts: number
  lastAttempt: Date
}

export interface ExamSession {
  deckId: string
  cards: Card[]
  answers: ExamAnswer[]
  currentIndex: number
  timePerCard: number
  timeRemaining: number
  isActive: boolean
  isSubmitted: boolean
  questionType: ExamQuestionType
}

export type ExamMode = 'card' | 'exam'

export function calculateScore(answers: ExamAnswer[]): { score: number; correct: number; total: number } {
  const total = answers.length
  const correct = answers.filter(a => a.isCorrect).length
  const score = total > 0 ? Math.round((correct / total) * 100) : 0
  return { score, correct, total }
}

export function getGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

export function normalizeAnswer(answer: string): string {
  return answer.toLowerCase().trim().replace(/\s+/g, ' ')
}

export function checkAnswer(userAnswer: string, correctAnswer: string): boolean {
  return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer)
}

export function generateMultipleChoiceOptions(correctAnswer: string, allAnswers: string[], currentCardId: string): MultipleChoiceOption[] {
  const uniqueAnswers = [...new Set(allAnswers.filter(a => a.toLowerCase() !== correctAnswer.toLowerCase()))]
  
  const shuffled = uniqueAnswers.sort(() => Math.random() - 0.5)
  const distractors = shuffled.slice(0, 3)
  
  const options: MultipleChoiceOption[] = [
    { label: 'A', value: correctAnswer, isCorrect: true },
    ...distractors.map((ans, i) => ({ label: String.fromCharCode(66 + i), value: ans, isCorrect: false }))
  ]
  
  return options.sort(() => Math.random() - 0.5)
}

export function getOptionLabel(options: MultipleChoiceOption[], value: string): string {
  const option = options.find(o => o.value === value)
  return option ? option.label : ''
}
