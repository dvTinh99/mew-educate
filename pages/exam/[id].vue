<template>
  <div class="exam-page">
    <div class="container mx-auto px-4 py-8">
      <div v-if="!deck || deck.cards.length === 0" class="card text-center py-16 max-w-2xl mx-auto">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">No Cards to Exam</h2>
        <p class="text-lg text-gray-600 mb-6">Add some cards to this deck first</p>
        <AppButton variant="primary" size="lg" @click="router.push(`/deck/${deckId}`)">
          Go to Deck
        </AppButton>
      </div>

      <div v-else-if="showStartScreen" class="exam-start max-w-2xl mx-auto">
        <div class="card p-8 text-center">
          <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>

          <h1 class="text-3xl font-bold text-gray-900 mb-4">Exam Mode</h1>
          <p class="text-xl text-gray-600 mb-6">{{ deck.name }}</p>

          <div class="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How it works
            </h3>
            <ul class="space-y-3 text-gray-700">
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                You'll see {{ deck.cards.length }} questions one at a time
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Each card has {{ timePerCard }} seconds to answer
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Results shown only after all questions are answered
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Your score will be recorded on the leaderboard
              </li>
            </ul>
          </div>

          <div class="mb-8">
            <p class="text-lg font-semibold text-gray-900 mb-4">Choose answer type:</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                class="exam-type-btn"
                :class="{ 'exam-type-selected': selectedQuestionType === 'input' }"
                @click="selectedQuestionType = 'input'"
              >
                <svg class="w-8 h-8 mb-2 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span class="font-semibold">Type Answer</span>
                <span class="text-sm opacity-80">Fill in the blank</span>
              </button>
              <button
                type="button"
                class="exam-type-btn"
                :class="{ 'exam-type-selected': selectedQuestionType === 'multiple-choice' }"
                @click="selectedQuestionType = 'multiple-choice'"
              >
                <svg class="w-8 h-8 mb-2 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <span class="font-semibold">Multiple Choice</span>
                <span class="text-sm opacity-80">Pick from options A, B, C, D</span>
              </button>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <AppButton variant="outline" size="lg" @click="router.push(`/deck/${deckId}`)">
              <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Deck
              </span>
            </AppButton>
            <AppButton variant="primary" size="lg" @click="startExam">
              <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
                Start Exam
              </span>
            </AppButton>
          </div>
        </div>

        <div v-if="leaderboardEntries.length > 0" class="mt-8">
          <Leaderboard 
            :entries="leaderboardEntries"
            :best-entry="deckLeaderboard"
          />
        </div>
      </div>

      <div v-else-if="examResult" class="exam-complete max-w-2xl mx-auto">
        <ExamResults 
          :result="examResult"
          :deck-name="deck.name"
          :attempt-number="attemptNumber"
          @back="goBack"
          @retry="retryExam"
        />
      </div>

      <div v-else class="exam-active max-w-3xl mx-auto">
        <div class="mb-6">
          <button 
            @click="confirmExit"
            class="inline-flex items-center gap-2 text-lg text-gray-600 hover:text-primary-600 mb-4 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Exit Exam
          </button>

          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div class="flex items-center gap-4">
              <h1 class="text-2xl font-bold text-gray-900">{{ deck.name }}</h1>
              <span class="text-lg text-gray-600 font-medium">
                {{ session.currentIndex.value + 1 }} / {{ deck.cards.length }}
              </span>
            </div>
            <ExamTimer 
              :time-remaining="session.timeRemaining.value"
              label="Time Left"
            />
          </div>

          <ProgressBar 
            :percentage="session.progress.value"
            label="Exam Progress"
          />
        </div>

        <div class="card-area mb-6">
          <ExamCard
            ref="examCardRef"
            v-if="session.currentCard.value"
            :card="session.currentCard.value"
            :card-index="session.currentIndex.value"
            :question-type="session.questionType.value"
            :options="session.currentOptions.value"
            :is-submitted="session.isSubmitted.value"
            @submit="handleSubmit"
          />
        </div>

        <div class="flex gap-4">
          <AppButton 
            v-if="!session.isLastCard.value"
            variant="primary" 
            size="lg"
            full-width
            @click="handleNext"
          >
            <span class="flex items-center justify-center gap-2">
              {{ session.isSubmitted.value ? 'Next Question' : 'Submit & Next' }}
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </AppButton>
          <AppButton 
            v-else
            variant="success" 
            size="lg"
            full-width
            @click="handleFinish"
          >
            <span class="flex items-center justify-center gap-2">
              {{ session.isSubmitted.value ? 'See Results' : 'Submit & Finish' }}
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          </AppButton>
        </div>

        <div class="mt-8">
          <p class="text-lg font-semibold text-gray-700 mb-4">Your Answers:</p>
          <div class="answer-dots">
            <div 
              v-for="(answer, index) in session.answers.value"
              :key="answer.cardId"
              class="answer-dot"
              :class="answer.isCorrect ? 'dot-correct' : 'dot-incorrect'"
              :title="`Q${index + 1}: ${answer.isCorrect ? 'Correct' : 'Incorrect'}`"
            >
              {{ index + 1 }}
            </div>
            <div 
              v-for="i in remainingQuestions"
              :key="'pending-' + i"
              class="answer-dot dot-pending"
              :title="`Q${session.answers.value.length + i}: Pending`"
            >
              {{ session.answers.value.length + i }}
            </div>
          </div>
        </div>
      </div>

      <Modal
        v-model="showExitModal"
        title="Exit Exam?"
        size="sm"
      >
        <div class="text-lg">
          <p class="mb-4">
            Are you sure you want to exit? Your progress will be lost and won't be saved to the leaderboard.
          </p>
        </div>
        
        <template #footer>
          <AppButton variant="outline" size="lg" @click="showExitModal = false">
            Continue Exam
          </AppButton>
          <AppButton variant="danger" size="lg" @click="exitExam">
            Exit
          </AppButton>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDeckStore } from '~/stores/deck'
import { useExamSession } from '~/composables/useExamSession'
import type { ExamResult } from '~/types/exam'

const router = useRouter()
const route = useRoute()
const deckStore = useDeckStore()

const deckId = computed(() => route.params.id as string)
const deck = computed(() => deckStore.getDeckById(deckId.value))
const timePerCard = 30

const session = useExamSession(timePerCard)
const showStartScreen = ref(true)
const examResult = ref<ExamResult | null>(null)
const attemptNumber = ref(1)
const showExitModal = ref(false)
const selectedQuestionType = ref<'input' | 'multiple-choice'>('input')
const examCardRef = ref<any>(null)

const remainingQuestions = computed(() => {
  return Math.max(0, deck.value ? deck.value.cards.length - session.answers.value.length - 1 : 0)
})

const leaderboardEntries = computed(() => {
  return deckStore.getLeaderboardForDeck(deckId.value)
})

const deckLeaderboard = computed(() => {
  return deckStore.leaderboard[deckId.value] || null
})

onMounted(() => {
  attemptNumber.value = deckStore.getExamAttemptCount(deckId.value) + 1
})

const startExam = () => {
  if (deck.value) {
    showStartScreen.value = false
    session.startExam(deck.value.cards, selectedQuestionType.value)
  }
}

const handleSubmit = (answer: string) => {
  session.submitCurrentAnswer(answer)
}

const handleNext = () => {
  if (!session.isSubmitted.value) {
    examCardRef.value?.submit()
    return
  }
  session.nextCard()
}

const handleFinish = () => {
  if (!session.isSubmitted.value) {
    examCardRef.value?.submit()
    return
  }
  if (deck.value && session.answers.value.length > 0) {
    const result = deckStore.saveExamResult(deckId.value, session.answers.value)
    examResult.value = result
    session.stopTimer()
  }
}

const retryExam = () => {
  examResult.value = null
  attemptNumber.value = deckStore.getExamAttemptCount(deckId.value) + 1
  session.restartExam()
}

const goBack = () => {
  session.resetExam()
  router.push(`/deck/${deckId.value}`)
}

const confirmExit = () => {
  showExitModal.value = true
}

const exitExam = () => {
  session.resetExam()
  router.push(`/deck/${deckId.value}`)
}

useHead({
  title: computed(() => deck.value ? `Exam: ${deck.value.name}` : 'Exam Mode')
})
</script>

<style scoped>
.exam-page {
  @apply min-h-screen bg-gradient-to-b from-gray-50 to-gray-100;
}

.exam-start {
  animation: fadeIn 0.5s ease-out;
}

.exam-complete {
  animation: fadeIn 0.5s ease-out;
}

.card-area {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.exam-type-btn {
  @apply flex flex-col items-center p-6 rounded-2xl border-2 border-gray-200 bg-white transition-all duration-300 min-w-48 hover:border-primary-300 hover:bg-primary-50 focus:outline-none focus:ring-4 focus:ring-primary-200;
}

.exam-type-selected {
  @apply border-primary-500 bg-primary-50 ring-4 ring-primary-200;
}

.answer-dots {
  @apply flex flex-wrap gap-3;
}

.answer-dot {
  @apply w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg transition-all;
}

.dot-correct {
  @apply bg-success-100 text-success-700 border-2 border-success-300;
}

.dot-incorrect {
  @apply bg-danger-100 text-danger-700 border-2 border-danger-300;
}

.dot-pending {
  @apply bg-gray-100 text-gray-500 border-2 border-gray-200;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .card-area {
    min-height: 350px;
  }
  
  .answer-dot {
    @apply w-9 h-9 text-base;
  }
}
</style>
