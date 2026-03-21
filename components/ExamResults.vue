<template>
  <div class="exam-results">
    <div class="card p-8 text-center">
      <div 
        class="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
        :class="gradeClasses"
      >
        <span class="text-4xl font-bold">{{ result.grade }}</span>
      </div>

      <h2 class="text-3xl font-bold text-gray-900 mb-2">
        Exam Complete!
      </h2>
      <p class="text-xl text-gray-600 mb-6">
        {{ deckName }}
      </p>

      <div class="score-display mb-8">
        <span class="score-value">{{ result.score }}%</span>
        <span class="score-label">Final Score</span>
      </div>

      <div class="stats-grid mb-8">
        <div class="stat-item bg-success-50 border-2 border-success-200">
          <span class="stat-value text-success-600">{{ result.correct }}</span>
          <span class="stat-label">Correct</span>
        </div>
        <div class="stat-item bg-danger-50 border-2 border-danger-200">
          <span class="stat-value text-danger-600">{{ result.total - result.correct }}</span>
          <span class="stat-label">Incorrect</span>
        </div>
        <div class="stat-item bg-primary-50 border-2 border-primary-200">
          <span class="stat-value text-primary-600">{{ result.total }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-item bg-gray-50 border-2 border-gray-200">
          <span class="stat-value text-gray-600">#{{ attemptNumber }}</span>
          <span class="stat-label">Attempt</span>
        </div>
      </div>

      <div class="flex flex-wrap justify-center gap-2 text-base text-gray-600 mb-8">
        <span class="px-4 py-2 bg-gray-100 rounded-full">
          {{ questionTypeLabel }}
        </span>
        <span class="px-4 py-2 bg-gray-100 rounded-full">
          {{ formatDate(result.completedAt) }}
        </span>
      </div>

      <div class="answer-review mb-8">
        <button 
          class="inline-flex items-center gap-2 text-lg text-primary-600 hover:text-primary-700 font-medium transition-colors"
          @click="showReview = !showReview"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {{ showReview ? 'Hide' : 'Show' }} Answer Review
        </button>

        <Transition name="slide">
          <div v-if="showReview" class="mt-6 text-left max-h-96 overflow-y-auto">
            <div 
              v-for="(answer, index) in result.answers" 
              :key="answer.cardId"
              class="p-4 mb-3 rounded-xl border-2"
              :class="answer.isCorrect ? 'bg-success-50 border-success-200' : 'bg-danger-50 border-danger-200'"
            >
              <div class="flex items-start gap-3">
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  :class="answer.isCorrect ? 'bg-success-100' : 'bg-danger-100'"
                >
                  <svg v-if="answer.isCorrect" class="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else class="w-4 h-4 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="font-semibold text-gray-900 mb-1">Question {{ index + 1 }}</p>
                  <p class="text-gray-700">
                    <span class="text-danger-600">Your answer:</span> {{ answer.userAnswer || '(no answer)' }}
                  </p>
                  <p v-if="!answer.isCorrect" class="text-gray-700">
                    <span class="text-success-600">Correct answer:</span> {{ answer.correctAnswer }}
                  </p>
                </div>
                <span class="text-sm text-gray-500">{{ answer.timeSpent }}s</span>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <AppButton variant="outline" size="lg" @click="$emit('back')">
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Deck
          </span>
        </AppButton>
        <AppButton variant="primary" size="lg" @click="$emit('retry')">
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </span>
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ExamResult } from '~/types/exam'

interface Props {
  result: ExamResult
  deckName: string
  attemptNumber: number
}

const props = defineProps<Props>()

defineEmits<{
  (e: 'back'): void
  (e: 'retry'): void
}>()

const showReview = ref(false)

const questionTypeLabel = computed(() => {
  return props.result.questionType === 'multiple-choice' ? 'Multiple Choice' : 'Type Answer'
})

const gradeClasses = computed(() => {
  switch (props.result.grade) {
    case 'A': return 'bg-success-100 text-success-700'
    case 'B': return 'bg-primary-100 text-primary-700'
    case 'C': return 'bg-warning-100 text-warning-700'
    case 'D': return 'bg-warning-100 text-warning-800'
    case 'F': return 'bg-danger-100 text-danger-700'
    default: return 'bg-gray-100 text-gray-700'
  }
})

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.score-display {
  @apply flex flex-col items-center;
}

.score-value {
  @apply text-6xl font-bold text-primary-600;
}

.score-label {
  @apply text-lg text-gray-600 font-medium;
}

.stats-grid {
  @apply grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto;
}

.stat-item {
  @apply rounded-xl p-4 text-center;
}

.stat-value {
  @apply block text-3xl font-bold mb-1;
}

.stat-label {
  @apply text-base font-medium text-gray-600;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
