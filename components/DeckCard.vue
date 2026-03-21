<template>
  <div 
    class="deck-card card group hover:shadow-xl transition-all duration-300 cursor-pointer"
    tabindex="0"
    role="button"
    :aria-label="`${deck.name} deck with ${deck.cards.length} cards`"
    @click="$emit('click')"
    @keydown.enter="$emit('click')"
    @keydown.space.prevent="$emit('click')"
  >
    <div class="flex flex-col h-full">
      <div class="flex-1 mb-4">
        <h3 class="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {{ deck.name }}
        </h3>
        <p v-if="deck.description" class="text-lg text-gray-600 mb-4">
          {{ deck.description }}
        </p>
        <div class="flex items-center gap-4 text-lg text-gray-500">
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {{ deck.cards.length }} cards
          </span>
          <span v-if="deck.lastStudied" class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ formatLastStudied(deck.lastStudied) }}
          </span>
        </div>
      </div>
      
      <AppButton 
        variant="success" 
        size="lg" 
        fullWidth
        :disabled="deck.cards.length === 0"
        @click.stop="$emit('study')"
      >
        <span class="flex items-center gap-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Study Now
        </span>
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Deck } from '~/stores/deck'

interface Props {
  deck: Deck
}

defineProps<Props>()

defineEmits<{
  (e: 'click'): void
  (e: 'study'): void
}>()

const formatLastStudied = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}
</script>

<style scoped>
.deck-card {
  @apply relative overflow-hidden;
}

.deck-card::before {
  content: '';
  @apply absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-primary-600;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease-out;
}

.deck-card:hover::before,
.deck-card:focus::before {
  transform: scaleX(1);
}
</style>
