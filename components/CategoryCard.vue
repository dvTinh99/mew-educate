<template>
  <div class="category-card" :style="{ '--category-color': categoryColor }">
    <div class="category-icon">
      <component :is="iconComponent" class="w-12 h-12" />
    </div>
    <div class="category-info">
      <h3 class="category-name">{{ name }}</h3>
      <p class="category-desc">{{ description }}</p>
      <div class="category-stats">
        <span class="stat">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
          </svg>
          {{ deckCount }} {{ deckCount === 1 ? 'deck' : 'decks' }}
        </span>
        <span class="stat">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
          </svg>
          {{ cardCount }} cards
        </span>
      </div>
    </div>
    <div class="category-arrow">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'

interface Props {
  name: string
  description: string
  icon: 'chinese' | 'english' | 'general' | 'math' | 'geography'
  deckCount: number
  cardCount: number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary'
})

const iconComponent = computed(() => {
  const icons: Record<string, any> = {
    chinese: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { d: 'M10 2a8 8 0 100 16 8 8 0 000-16zM6.5 8a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm4 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm-2 4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z' })
    ]),
    english: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M7 2a1 1 0 011 1v1h3V3a1 1 0 112 0v1h3a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2H1a1 1 0 110-2h1V9H1a1 1 0 010-2h1V5a2 2 0 012-2zm7 5h3a1 1 0 110 2H9v2h3a1 1 0 110 2H9v2h3a1 1 0 110 2H9a1 1 0 01-1-1v-2a1 1 0 00-1-1H7a1 1 0 00-1 1v2a1 1 0 001 1h1v1a1 1 0 11-2 0v-1H4a1 1 0 110-2h1V9H4a1 1 0 110-2h3a1 1 0 001-1V3a1 1 0 00-1-1H7z', 'clip-rule': 'evenodd' })
    ]),
    general: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z', 'clip-rule': 'evenodd' })
    ]),
    math: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 14a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z', 'clip-rule': 'evenodd' })
    ]),
    geography: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 3.276a1 1 0 00.747 1.522H8a1 1 0 001-1v-.58a1 1 0 00-.58-.948l-1.5-2.5a1 1 0 00-1.74-.34l-1.106 1.84a4 4 0 00-.106 4.148l3.998 5.52a1 1 0 001.74-.34l.702-1.173a1 1 0 00-.58-.948H11a4 4 0 000-8z', 'clip-rule': 'evenodd' })
    ])
  }
  return icons[props.icon] || icons.general
})

const categoryColor = computed(() => {
  const colors: Record<string, string> = {
    chinese: '#ef4444',
    english: '#3b82f6',
    general: '#8b5cf6',
    math: '#f97316',
    geography: '#22c55e'
  }
  return colors[props.icon] || colors.general
})
</script>

<style scoped>
.category-card {
  @apply flex items-center gap-6 p-6 rounded-2xl bg-white border-2 border-transparent cursor-pointer transition-all duration-300;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.category-card:hover {
  @apply border-current;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.category-icon {
  @apply w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br from-current to-current/80 text-white shadow-lg;
  background-color: var(--category-color);
}

.category-info {
  @apply flex-1;
}

.category-name {
  @apply text-xl font-bold text-gray-900 mb-1;
}

.category-desc {
  @apply text-gray-600 text-sm mb-3;
}

.category-stats {
  @apply flex gap-4;
}

.stat {
  @apply flex items-center gap-1 text-sm text-gray-500;
}

.category-arrow {
  @apply text-gray-400;
}

.category-card:hover .category-arrow {
  @apply text-gray-600;
}
</style>
