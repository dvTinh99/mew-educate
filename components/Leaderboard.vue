<template>
  <div class="leaderboard">
    <div class="card p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-bold text-gray-900">Leaderboard</h3>
        <span v-if="entries.length > 0" class="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
          {{ entries.length }} {{ entries.length === 1 ? 'attempt' : 'attempts' }}
        </span>
      </div>

      <div v-if="entries.length === 0" class="text-center py-8">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p class="text-lg text-gray-600">No exam attempts yet</p>
        <p class="text-base text-gray-500 mt-1">Start an exam to see your scores here</p>
      </div>

      <div v-else class="space-y-3">
        <div 
          v-for="(entry, index) in entries.slice(0, 10)" 
          :key="index"
          class="leaderboard-entry"
          :class="{ 'entry-best': index === 0 }"
        >
          <div class="entry-rank">
            <span v-if="index === 0" class="crown">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z"/>
              </svg>
            </span>
            <span v-else class="rank-number">#{{ index + 1 }}</span>
          </div>
          
          <div class="entry-score">
            <span class="score-value">{{ entry.score }}%</span>
            <span 
              class="score-grade"
              :class="gradeClasses(entry.grade)"
            >
              {{ entry.grade }}
            </span>
          </div>
          
          <div class="entry-meta">
            <span class="text-sm text-gray-500">
              {{ formatDate(entry.completedAt) }}
            </span>
            <span v-if="index === 0" class="best-badge">
              Best
            </span>
          </div>
        </div>

        <div v-if="entries.length > 10" class="text-center pt-4 border-t border-gray-200">
          <p class="text-base text-gray-500">
            +{{ entries.length - 10 }} more attempts
          </p>
        </div>
      </div>

      <div v-if="bestEntry" class="mt-6 pt-6 border-t-2 border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-base font-medium text-gray-600">Personal Best</p>
            <p class="text-3xl font-bold text-primary-600">{{ bestEntry.score }}%</p>
          </div>
          <span 
            class="px-4 py-2 rounded-xl font-bold text-xl"
            :class="gradeClasses(bestEntry.grade)"
          >
            {{ bestEntry.grade }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExamResult, LeaderboardEntry } from '~/types/exam'

interface Props {
  entries: ExamResult[]
  bestEntry?: LeaderboardEntry | null
}

const props = withDefaults(defineProps<Props>(), {
  bestEntry: null
})

const gradeClasses = (grade: string) => {
  switch (grade) {
    case 'A': return 'bg-success-100 text-success-700'
    case 'B': return 'bg-primary-100 text-primary-700'
    case 'C': return 'bg-warning-100 text-warning-700'
    case 'D': return 'bg-warning-100 text-warning-800'
    case 'F': return 'bg-danger-100 text-danger-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.leaderboard-entry {
  @apply flex items-center gap-4 p-4 rounded-xl bg-gray-50 transition-all;
}

.leaderboard-entry.entry-best {
  @apply bg-primary-50 border-2 border-primary-200;
}

.entry-rank {
  @apply w-10 h-10 flex items-center justify-center;
}

.entry-rank .crown {
  @apply text-warning-500;
}

.entry-rank .rank-number {
  @apply text-lg font-bold text-gray-500;
}

.entry-score {
  @apply flex items-center gap-3 flex-1;
}

.entry-score .score-value {
  @apply text-2xl font-bold text-gray-900;
}

.entry-score .score-grade {
  @apply px-2 py-1 rounded-lg font-bold text-sm;
}

.entry-meta {
  @apply flex items-center gap-3;
}

.entry-meta .best-badge {
  @apply px-2 py-1 bg-success-100 text-success-700 text-xs font-bold rounded-full;
}
</style>
