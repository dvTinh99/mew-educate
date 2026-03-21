import { ref, computed, onUnmounted } from 'vue'
import type { Card } from '~/stores/deck'
import type { ExamAnswer, ExamQuestionType, MultipleChoiceOption } from '~/types/exam'
import { checkAnswer, generateMultipleChoiceOptions } from '~/types/exam'

export const useExamSession = (timePerCardSeconds: number = 30) => {
  const cards = ref<Card[]>([])
  const currentIndex = ref(0)
  const answers = ref<ExamAnswer[]>([])
  const isActive = ref(false)
  const isSubmitted = ref(false)
  const timeRemaining = ref(timePerCardSeconds)
  const cardStartTime = ref(0)
  const questionType = ref<ExamQuestionType>('input')
  let timerInterval: ReturnType<typeof setInterval> | null = null

  const currentCard = computed(() => {
    return cards.value[currentIndex.value] || null
  })

  const progress = computed(() => {
    if (cards.value.length === 0) return 0
    return Math.round(((currentIndex.value + 1) / cards.value.length) * 100)
  })

  const isLastCard = computed(() => {
    return currentIndex.value === cards.value.length - 1
  })

  const isExamComplete = computed(() => {
    return isSubmitted.value && answers.value.length === cards.value.length
  })

  const currentAnswer = computed(() => {
    if (!currentCard.value) return null
    return answers.value.find(a => a.cardId === currentCard.value?.id) || null
  })

  const isAnswerRevealed = computed(() => {
    return currentAnswer.value !== null
  })

  const currentOptions = computed<MultipleChoiceOption[]>(() => {
    if (!currentCard.value || questionType.value !== 'multiple-choice') return []
    const allAnswers = cards.value.map(c => c.back)
    return generateMultipleChoiceOptions(currentCard.value.back, allAnswers, currentCard.value.id)
  })

  const startExam = (deckCards: Card[], type: ExamQuestionType = 'input') => {
    cards.value = [...deckCards].sort(() => Math.random() - 0.5)
    currentIndex.value = 0
    answers.value = []
    isActive.value = true
    isSubmitted.value = false
    timeRemaining.value = timePerCardSeconds
    cardStartTime.value = Date.now()
    questionType.value = type
    startTimer()
  }

  const startTimer = () => {
    stopTimer()
    timerInterval = setInterval(() => {
      timeRemaining.value--
      if (timeRemaining.value <= 0) {
        submitCurrentAnswer('')
      }
    }, 1000)
  }

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  const resetTimer = () => {
    stopTimer()
    timeRemaining.value = timePerCardSeconds
    cardStartTime.value = Date.now()
    startTimer()
  }

  const submitCurrentAnswer = (userAnswer: string) => {
    if (!currentCard.value) return

    const timeSpent = Math.round((Date.now() - cardStartTime.value) / 1000)
    const isCorrect = checkAnswer(userAnswer, currentCard.value.back)

    const examAnswer: ExamAnswer = {
      cardId: currentCard.value.id,
      cardIndex: currentIndex.value,
      userAnswer,
      correctAnswer: currentCard.value.back,
      isCorrect,
      timeSpent,
      questionType: questionType.value
    }

    const existingIndex = answers.value.findIndex(a => a.cardId === currentCard.value?.id)
    if (existingIndex >= 0) {
      answers.value[existingIndex] = examAnswer
    } else {
      answers.value.push(examAnswer)
    }

    isSubmitted.value = true
    stopTimer()
  }

  const nextCard = () => {
    if (isLastCard.value) {
      return
    }

    currentIndex.value++
    isSubmitted.value = false
    resetTimer()
  }

  const restartExam = () => {
    if (cards.value.length > 0) {
      startExam(cards.value, questionType.value)
    }
  }

  const resetExam = () => {
    stopTimer()
    cards.value = []
    currentIndex.value = 0
    answers.value = []
    isActive.value = false
    isSubmitted.value = false
    timeRemaining.value = timePerCardSeconds
  }

  onUnmounted(() => {
    stopTimer()
  })

  return {
    cards,
    currentIndex,
    answers,
    isActive,
    isSubmitted,
    isExamComplete,
    timeRemaining,
    currentCard,
    progress,
    isLastCard,
    currentAnswer,
    isAnswerRevealed,
    currentOptions,
    questionType,
    startExam,
    submitCurrentAnswer,
    nextCard,
    restartExam,
    resetExam,
    stopTimer
  }
}
