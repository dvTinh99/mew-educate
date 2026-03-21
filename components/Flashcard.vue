<template>
  <div 
    class="flashcard-wrapper"
    role="button"
    tabindex="0"
    :aria-label="isFlipped ? 'Showing answer. Click to see question.' : 'Showing question. Click to reveal answer.'"
    @click="flip"
    @keydown.enter="flip"
    @keydown.space.prevent="flip"
  >
    <div class="flashcard-container">
      <div 
        class="flashcard card-flip"
        :class="{ 'is-flipped': isFlipped }"
      >
        <!-- Front Side -->
        <div class="flashcard-face flashcard-front">
          <div class="flex flex-col items-center justify-center h-full p-8">
            <span class="text-sm font-medium text-primary-600 uppercase tracking-wide mb-4">
              Question
            </span>
            <p class="text-3xl md:text-4xl font-bold text-center text-gray-900 leading-relaxed mb-6">
              {{ card.front }}
            </p>
            <div v-if="card.hint" class="hint-badge">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>Hint available</span>
            </div>
            <div class="mt-6 text-gray-400 text-base animate-bounce">
              <span>Tap to flip</span>
              <svg class="w-6 h-6 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Back Side -->
        <div class="flashcard-face flashcard-back">
          <div class="flex flex-col items-center justify-center h-full p-8">
            <span class="text-sm font-medium text-success-600 uppercase tracking-wide mb-4">
              Answer
            </span>
            <p class="text-3xl md:text-4xl font-bold text-center text-gray-900 leading-relaxed mb-4">
              {{ card.back }}
            </p>
            <div v-if="card.hint" class="hint-text">
              <span class="font-medium">Hint:</span> {{ card.hint }}
            </div>
            <div class="mt-6 text-gray-400 text-base">
              <span>Tap to see question</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Card } from '~/stores/deck'

interface Props {
  card: Card
  isFlipped?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isFlipped: false
})

const emit = defineEmits<{
  (e: 'flip'): void
}>()

const flip = () => {
  emit('flip')
}
</script>

<style scoped>
.flashcard-wrapper {
  @apply w-full max-w-2xl mx-auto cursor-pointer;
}

.flashcard-container {
  perspective: 1000px;
}

.flashcard {
  @apply relative w-full min-h-96 md:min-h-128;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.flashcard.is-flipped {
  transform: rotateY(180deg);
}

.flashcard-face {
  @apply absolute inset-0 flex flex-col items-center justify-center p-8 rounded-2xl;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.flashcard-front {
  @apply bg-white;
}

.flashcard-back {
  @apply bg-gradient-to-br from-success-50 to-success-100;
  transform: rotateY(180deg);
}

.hint-badge {
  @apply inline-flex items-center gap-2 px-4 py-2 bg-warning-100 text-warning-800 rounded-lg text-base font-medium;
}

.hint-text {
  @apply text-xl text-gray-600 bg-gray-100 px-4 py-3 rounded-lg;
}

@media (max-width: 640px) {
  .flashcard {
    @apply min-h-80;
  }
  
  .flashcard-face {
    @apply p-6;
  }
}
</style>
