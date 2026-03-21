<template>
  <div 
    class="card-preview card group hover:shadow-xl transition-all duration-300"
    tabindex="0"
    role="button"
    :aria-label="`Card: ${card.front}`"
    @click="$emit('click')"
    @keydown.enter="$emit('click')"
    @keydown.space.prevent="$emit('click')"
  >
    <div class="flex items-start justify-between gap-4">
      <div class="flex-1 min-w-0">
        <div class="flex items-start gap-3 mb-2">
          <span class="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
            Front
          </span>
          <span v-if="card.hint" class="flex items-center gap-1 text-warning-600 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Has hint
          </span>
        </div>
        <p class="text-xl font-semibold text-gray-900 truncate">
          {{ card.front }}
        </p>
      </div>
      
      <div class="flex gap-2 flex-shrink-0">
        <button 
          type="button"
          class="p-3 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
          aria-label="Edit card"
          @click.stop="$emit('edit')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button 
          type="button"
          class="p-3 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors duration-200"
          aria-label="Delete card"
          @click.stop="$emit('delete')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Card } from '~/stores/deck'

interface Props {
  card: Card
}

defineProps<Props>()

defineEmits<{
  (e: 'click'): void
  (e: 'edit'): void
  (e: 'delete'): void
}>()
</script>
