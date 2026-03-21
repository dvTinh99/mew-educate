<template>
  <div class="battle-log">
    <div class="log-header">
      <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Battle Log
      </h3>
    </div>
    
    <div class="log-entries">
      <TransitionGroup name="log">
        <div 
          v-for="(entry, index) in entries" 
          :key="index"
          class="log-entry"
          :class="{
            'player-action': entry.attacker === 'player',
            'enemy-action': entry.attacker === 'enemy',
            'critical': entry.isCritical,
            'miss': entry.isMiss
          }"
        >
          <span class="turn-badge">T{{ entry.turn }}</span>
          <span class="entry-icon">
            <span v-if="entry.isMiss">💨</span>
            <span v-else-if="entry.isCritical">💥</span>
            <span v-else>⚔️</span>
          </span>
          <span class="entry-text">{{ entry.description }}</span>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BattleLogEntry } from '~/types/pet'

interface Props {
  log: BattleLogEntry[]
}

const props = defineProps<Props>()

const entries = computed(() => {
  return [...props.log].reverse()
})
</script>

<style scoped>
.battle-log {
  @apply max-w-2xl mx-auto;
}

.log-header {
  @apply mb-4;
}

.log-entries {
  @apply space-y-2 max-h-64 overflow-y-auto;
}

.log-entry {
  @apply flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 transition-all;
}

.log-entry.player-action {
  @apply border-l-4 border-primary-500;
}

.log-entry.enemy-action {
  @apply border-l-4 border-danger-500;
}

.log-entry.critical {
  @apply bg-warning-50 border-warning-500;
}

.log-entry.miss {
  @apply bg-gray-50 opacity-70;
}

.turn-badge {
  @apply px-2 py-0.5 rounded bg-gray-100 text-xs font-bold text-gray-600;
}

.entry-icon {
  @apply text-xl;
}

.entry-text {
  @apply flex-1 text-sm font-medium text-gray-700;
}

.log-enter-active {
  animation: slide-in 0.3s ease-out;
}

.log-leave-active {
  animation: slide-out 0.2s ease-in;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-out {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(20px);
  }
}
</style>
