<template>
  <div class="study-page">
    <div class="container mx-auto px-4 py-8">
      <!-- Loading/Error State -->
      <div v-if="!deck || deck.cards.length === 0" class="card text-center py-16">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">No Cards to Study</h2>
        <p class="text-lg text-gray-600 mb-6">Add some cards to this deck first</p>
        <AppButton variant="primary" size="lg" @click="router.push(`/deck/${deckId}`)">
          Go to Deck
        </AppButton>
      </div>

      <!-- Session Complete -->
      <div v-else-if="session.sessionComplete.value" class="study-complete max-w-2xl mx-auto">
        <div class="card text-center py-12">
          <div class="w-24 h-24 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Session Complete!</h1>
          <p class="text-xl text-gray-600 mb-8">
            Great job! You've reviewed all {{ deck.cards.length }} cards
          </p>

          <!-- Session Stats -->
          <div class="stats-grid mb-8">
            <div class="stat-item bg-danger-50 border-2 border-danger-200">
              <span class="stat-value text-danger-600">{{ stats.again }}</span>
              <span class="stat-label">Again</span>
            </div>
            <div class="stat-item bg-warning-50 border-2 border-warning-200">
              <span class="stat-value text-warning-600">{{ stats.hard }}</span>
              <span class="stat-label">Hard</span>
            </div>
            <div class="stat-item bg-success-50 border-2 border-success-200">
              <span class="stat-value text-success-600">{{ stats.good }}</span>
              <span class="stat-label">Good</span>
            </div>
            <div class="stat-item bg-primary-50 border-2 border-primary-200">
              <span class="stat-value text-primary-600">{{ stats.easy }}</span>
              <span class="stat-label">Easy</span>
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
            <AppButton variant="primary" size="lg" @click="restartSession">
              <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Study Again
              </span>
            </AppButton>
          </div>
        </div>
      </div>

      <!-- Study Mode -->
      <div v-else class="study-mode">
        <!-- Header -->
        <div class="mb-8">
          <button 
            @click="exitStudy"
            class="inline-flex items-center gap-2 text-lg text-gray-600 hover:text-primary-600 mb-4 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Exit Study Mode
          </button>

          <div class="flex items-center justify-between mb-4">
            <h1 class="text-3xl font-bold text-gray-900">{{ deck.name }}</h1>
            <span class="text-lg text-gray-600 font-medium">
              Card {{ session.currentIndex.value + 1 }} of {{ deck.cards.length }}
            </span>
          </div>

          <!-- Progress Bar -->
          <ProgressBar 
            :percentage="session.progress.value" 
            label="Session Progress"
          />
        </div>

        <!-- Card Area -->
        <div class="card-area mb-8">
          <Flashcard 
            v-if="session.currentCard.value"
            :card="session.currentCard.value"
            :is-flipped="session.isFlipped.value"
            @flip="session.flipCard"
          />
        </div>

        <!-- Answer Buttons -->
        <Transition name="fade">
          <div v-if="session.isFlipped.value" class="answer-buttons">
            <p class="text-center text-xl text-gray-600 mb-6 font-medium">
              How well did you know this?
            </p>
            
            <div class="button-grid">
              <button 
                type="button"
                class="answer-btn answer-btn-again"
                @click="handleAnswer('again')"
              >
                <span class="btn-label">Again</span>
                <span class="btn-hint">Didn't know it</span>
              </button>
              
              <button 
                type="button"
                class="answer-btn answer-btn-hard"
                @click="handleAnswer('hard')"
              >
                <span class="btn-label">Hard</span>
                <span class="btn-hint">Struggled to recall</span>
              </button>
              
              <button 
                type="button"
                class="answer-btn answer-btn-good"
                @click="handleAnswer('good')"
              >
                <span class="btn-label">Good</span>
                <span class="btn-hint">Remembered with effort</span>
              </button>
              
              <button 
                type="button"
                class="answer-btn answer-btn-easy"
                @click="handleAnswer('easy')"
              >
                <span class="btn-label">Easy</span>
                <span class="btn-hint">Knew it well</span>
              </button>
            </div>
          </div>
        </Transition>

        <!-- Tap to Reveal Hint -->
        <div v-if="!session.isFlipped.value" class="text-center text-gray-500 text-lg">
          <p>Tap the card to reveal the answer</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDeckStore } from '~/stores/deck'
import { useStudySession } from '~/composables/useStudySession'

const router = useRouter()
const route = useRoute()
const deckStore = useDeckStore()

const deckId = computed(() => route.params.id as string)
const deck = computed(() => deckStore.getDeckById(deckId.value))

const session = useStudySession()

const stats = computed(() => session.getSessionStats())

onMounted(() => {
  if (deck.value && deck.value.cards.length > 0) {
    session.startSession(deck.value.cards)
  }
})

onUnmounted(() => {
  if (deck.value && session.answers.value.length > 0) {
    deckStore.markDeckStudied(deckId.value)
  }
})

const handleAnswer = (difficulty: 'again' | 'hard' | 'good' | 'easy') => {
  session.nextCard(difficulty)
  
  if (session.sessionComplete.value && deck.value) {
    deckStore.markDeckStudied(deckId.value)
  }
}

const restartSession = () => {
  if (deck.value) {
    session.startSession(deck.value.cards)
  }
}

const exitStudy = () => {
  session.resetSession()
  router.push(`/deck/${deckId.value}`)
}

useHead({
  title: computed(() => deck.value ? `Study: ${deck.value.name}` : 'Study Mode')
})
</script>

<style scoped>
.study-page {
  @apply min-h-screen bg-gradient-to-b from-gray-50 to-gray-100;
}

.study-complete {
  animation: fadeIn 0.5s ease-out;
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

.card-area {
  min-height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.answer-buttons {
  animation: slideUp 0.4s ease-out;
}

.button-grid {
  @apply grid grid-cols-2 gap-4 max-w-4xl mx-auto;
}

.answer-btn {
  @apply flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 min-h-24 md:min-h-32 focus:outline-none focus:ring-4 focus:ring-offset-2;
}

.answer-btn-again {
  @apply bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-300;
}

.answer-btn-hard {
  @apply bg-warning-500 text-white hover:bg-warning-600 focus:ring-warning-300;
}

.answer-btn-good {
  @apply bg-success-500 text-white hover:bg-success-600 focus:ring-success-300;
}

.answer-btn-easy {
  @apply bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-300;
}

.btn-label {
  @apply text-2xl md:text-3xl font-bold mb-2;
}

.btn-hint {
  @apply text-sm md:text-base opacity-90 font-medium;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
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
  
  .button-grid {
    @apply gap-3;
  }
  
  .answer-btn {
    @apply p-4 min-h-20;
  }
  
  .btn-label {
    @apply text-xl mb-1;
  }
  
  .btn-hint {
    @apply text-xs;
  }
}
</style>
