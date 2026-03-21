<template>
  <div class="challenge-card" :class="{ 'challenge-completed': challenge.isCompleted }">
    <div class="challenge-icon">
      <component :is="getTypeIcon(challenge.type)" class="w-6 h-6" />
    </div>
    <div class="challenge-info">
      <h4 class="challenge-title">{{ challenge.title }}</h4>
      <p class="challenge-desc">{{ challenge.description }}</p>
      <div class="challenge-progress">
        <div class="progress-bar-bg">
          <div 
            class="progress-bar-fill" 
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>
        <span class="progress-text">{{ challenge.progress }}/{{ challenge.target }}</span>
      </div>
    </div>
    <div class="challenge-reward">
      <span class="reward-xp">+{{ challenge.xpReward }} XP</span>
      <svg v-if="challenge.isCompleted" class="w-6 h-6 text-success-500" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import type { DailyChallenge } from '~/types/gamification'

interface Props {
  challenge: DailyChallenge
}

const props = defineProps<Props>()

const progressPercent = computed(() => {
  return Math.min(100, Math.round((props.challenge.progress / props.challenge.target) * 100))
})

const getTypeIcon = (type: string) => {
  const icons: Record<string, any> = {
    cards: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { d: 'M3 5h14v2H3V5zm0 4h14v2H3V9zm0 4h14v2H3v-2zm2-8h10v10H5V5z' })
    ]),
    study: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z', 'clip-rule': 'evenodd' })
    ]),
    exam: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z', 'clip-rule': 'evenodd' })
    ])
  }
  return icons[props.challenge.type] || icons.study
}
</script>

<style scoped>
.challenge-card {
  @apply flex items-center gap-4 p-4 rounded-xl bg-white border-2 border-gray-100 transition-all;
}

.challenge-completed {
  @apply border-success-200 bg-success-50;
}

.challenge-icon {
  @apply w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center;
}

.challenge-completed .challenge-icon {
  @apply bg-success-100 text-success-600;
}

.challenge-info {
  @apply flex-1 min-w-0;
}

.challenge-title {
  @apply font-bold text-gray-900 mb-0.5;
}

.challenge-desc {
  @apply text-sm text-gray-600 mb-2;
}

.challenge-progress {
  @apply flex items-center gap-3;
}

.progress-bar-bg {
  @apply flex-1 h-2 bg-gray-200 rounded-full overflow-hidden;
}

.progress-bar-fill {
  @apply h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500;
}

.challenge-completed .progress-bar-fill {
  @apply bg-gradient-to-r from-success-500 to-success-600;
}

.progress-text {
  @apply text-sm font-medium text-gray-600 whitespace-nowrap;
}

.challenge-reward {
  @apply flex flex-col items-center gap-1;
}

.reward-xp {
  @apply text-sm font-bold text-warning-600;
}
</style>
