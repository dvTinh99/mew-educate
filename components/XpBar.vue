<template>
  <div class="xp-bar">
    <div class="level-badge" :class="levelClass">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
      <span>{{ level }}</span>
    </div>
    
    <div class="xp-info">
      <div class="xp-text">
        <span class="xp-current">{{ progress.current.toLocaleString() }}</span>
        <span class="xp-separator">/</span>
        <span class="xp-required">{{ progress.required.toLocaleString() }} XP</span>
      </div>
      <div class="progress-bar-bg">
        <div 
          class="progress-bar-fill" 
          :style="{ width: progress.progress + '%' }"
        ></div>
      </div>
      <span class="multiplier" v-if="multiplier > 1">
        {{ multiplier.toFixed(1) }}x Streak Bonus!
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDeckStore } from '~/stores/deck'

const deckStore = useDeckStore()

const level = computed(() => deckStore.userLevel)
const progress = computed(() => deckStore.xpProgress)
const multiplier = computed(() => deckStore.streakMultiplier)

const levelClass = computed(() => {
  const lvl = level.value
  if (lvl >= 50) return 'level-legendary'
  if (lvl >= 25) return 'level-epic'
  if (lvl >= 10) return 'level-rare'
  return 'level-common'
})
</script>

<style scoped>
.xp-bar {
  @apply flex items-center gap-4;
}

.level-badge {
  @apply flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-white;
}

.level-common {
  @apply bg-gray-400;
}

.level-rare {
  @apply bg-primary-500;
}

.level-epic {
  @apply bg-purple-500;
}

.level-legendary {
  @apply bg-warning-500;
}

.xp-info {
  @apply flex-1 min-w-0;
}

.xp-text {
  @apply flex items-center gap-1 text-sm mb-1;
}

.xp-current {
  @apply font-bold text-gray-900;
}

.xp-separator {
  @apply text-gray-400;
}

.xp-required {
  @apply text-gray-500;
}

.progress-bar-bg {
  @apply w-full h-2 bg-gray-200 rounded-full overflow-hidden;
}

.progress-bar-fill {
  @apply h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500;
}

.multiplier {
  @apply text-xs text-warning-600 font-medium mt-1 block;
}
</style>
