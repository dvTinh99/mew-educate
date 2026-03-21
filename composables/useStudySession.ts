import { ref, computed } from 'vue'
import type { Card } from '~/types/deck'

export const useStudySession = () => {
  const cards = ref<Card[]>([])
  const currentIndex = ref(0)
  const isFlipped = ref(false)
  const sessionComplete = ref(false)
  const answers = ref<{ cardId: string; difficulty: string }[]>([])

  const currentCard = computed(() => {
    return cards.value[currentIndex.value] || null
  })

  const progress = computed(() => {
    if (cards.value.length === 0) return 0
    return Math.round(((currentIndex.value + 1) / cards.value.length) * 100)
  })

  const remainingCards = computed(() => {
    return cards.value.length - currentIndex.value - 1
  })

  const isLastCard = computed(() => {
    return currentIndex.value === cards.value.length - 1
  })

  const startSession = (deckCards: Card[]) => {
    cards.value = [...deckCards].sort(() => Math.random() - 0.5)
    currentIndex.value = 0
    isFlipped.value = false
    sessionComplete.value = false
    answers.value = []
  }

  const flipCard = () => {
    isFlipped.value = !isFlipped.value
  }

  const nextCard = (difficulty: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard.value) return

    answers.value.push({
      cardId: currentCard.value.id,
      difficulty
    })

    if (isLastCard.value) {
      sessionComplete.value = true
    } else {
      currentIndex.value++
      isFlipped.value = false
    }
  }

  const restartSession = () => {
    startSession(cards.value)
  }

  const resetSession = () => {
    cards.value = []
    currentIndex.value = 0
    isFlipped.value = false
    sessionComplete.value = false
    answers.value = []
  }

  const getSessionStats = () => {
    const stats = {
      again: 0,
      hard: 0,
      good: 0,
      easy: 0,
      total: answers.value.length
    }

    answers.value.forEach(answer => {
      if (answer.difficulty in stats) {
        stats[answer.difficulty as keyof typeof stats]++
      }
    })

    return stats
  }

  return {
    cards,
    currentIndex,
    isFlipped,
    sessionComplete,
    answers,
    currentCard,
    progress,
    remainingCards,
    isLastCard,
    startSession,
    flipCard,
    nextCard,
    restartSession,
    resetSession,
    getSessionStats
  }
}
