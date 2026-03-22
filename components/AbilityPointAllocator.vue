<template>
  <div class="ability-allocator">
    <div class="allocator-header">
      <h3 class="text-lg font-bold text-gray-900">{{ $t('pet.abilityPoints') }}</h3>
      <div class="points-display">
        <span class="points-value">{{ availablePoints }}</span>
        <span class="points-label">{{ $t('pet.pointsAvailable') }}</span>
      </div>
    </div>

    <div v-if="availablePoints > 0" class="allocate-section">
      <p class="allocate-hint">{{ $t('pet.allocateHint') }}</p>
      <div class="stat-buttons">
        <button
          class="stat-btn attack"
          :disabled="availablePoints < abilityCosts.attack"
          @click="$emit('allocate', 'attack')"
        >
          <div class="stat-icon">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-name">{{ $t('stats.attack') }}</span>
            <span class="stat-cost">{{ abilityCosts.attack }} pt</span>
            <span class="stat-bonus">+{{ spentPoints.attack }} allocated</span>
          </div>
        </button>

        <button
          class="stat-btn defense"
          :disabled="availablePoints < abilityCosts.defense"
          @click="$emit('allocate', 'defense')"
        >
          <div class="stat-icon">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-name">{{ $t('stats.defense') }}</span>
            <span class="stat-cost">{{ abilityCosts.defense }} pt</span>
            <span class="stat-bonus">+{{ spentPoints.defense }} allocated</span>
          </div>
        </button>

        <button
          class="stat-btn health"
          :disabled="availablePoints < abilityCosts.health"
          @click="$emit('allocate', 'health')"
        >
          <div class="stat-icon">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-name">{{ $t('stats.health') }}</span>
            <span class="stat-cost">{{ abilityCosts.health }} pt</span>
            <span class="stat-bonus">+{{ spentPoints.health * hpPerPoint }} HP allocated</span>
          </div>
        </button>
      </div>
    </div>

    <div v-else-if="canReset" class="reset-section">
      <p class="reset-hint">{{ $t('pet.allSpent') }}</p>
      <button
        v-if="showResetButton"
        class="reset-btn"
        @click="$emit('reset')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        {{ $t('pet.resetAt', { level: resetLevel }) }}
      </button>
    </div>

    <div v-else class="empty-state">
      <p class="empty-hint">{{ $t('pet.levelUp') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AbilityStat, SpentAbilityPoints } from '~/types/pet'
import { ABILITY_COSTS, ABILITY_HP_PER_POINT } from '~/types/pet'

interface Props {
  availablePoints: number
  spentPoints: SpentAbilityPoints
  canReset: boolean
  resetLevel: number
}

const props = withDefaults(defineProps<Props>(), {
  availablePoints: 0,
  spentPoints: () => ({ attack: 0, defense: 0, health: 0 }),
  canReset: false,
  resetLevel: 10
})

defineEmits<{
  (e: 'allocate', stat: AbilityStat): void
  (e: 'reset'): void
}>()

const abilityCosts = ABILITY_COSTS
const hpPerPoint = ABILITY_HP_PER_POINT
const showResetButton = true
</script>

<style scoped>
.ability-allocator {
  @apply space-y-4;
}

.allocator-header {
  @apply flex items-center justify-between;
}

.points-display {
  @apply text-right;
}

.points-value {
  @apply block text-2xl font-bold text-primary-600;
}

.points-label {
  @apply text-sm text-gray-500;
}

.allocate-section {
  @apply space-y-3;
}

.allocate-hint {
  @apply text-sm text-gray-600;
}

.stat-buttons {
  @apply grid grid-cols-3 gap-3;
}

.stat-btn {
  @apply flex flex-col items-center p-4 rounded-xl border-2 border-gray-200 bg-white transition-all duration-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed;
}

.stat-btn:not(:disabled):hover {
  @apply transform scale-105;
}

.stat-btn.attack:not(:disabled):hover {
  @apply border-danger-300 bg-danger-50;
}

.stat-btn.defense:not(:disabled):hover {
  @apply border-primary-300 bg-primary-50;
}

.stat-btn.health:not(:disabled):hover {
  @apply border-success-300 bg-success-50;
}

.stat-icon {
  @apply w-10 h-10 rounded-full flex items-center justify-center mb-2;
}

.attack .stat-icon {
  @apply bg-danger-100 text-danger-600;
}

.defense .stat-icon {
  @apply bg-primary-100 text-primary-600;
}

.health .stat-icon {
  @apply bg-success-100 text-success-600;
}

.stat-info {
  @apply text-center;
}

.stat-name {
  @apply block font-semibold text-gray-900 text-sm;
}

.stat-cost {
  @apply block text-xs text-gray-500 mt-1;
}

.stat-bonus {
  @apply block text-xs text-gray-400 mt-1;
}

.reset-section {
  @apply flex flex-col items-center gap-3;
}

.reset-hint {
  @apply text-sm text-gray-500;
}

.reset-btn {
  @apply flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors;
}

.empty-state {
  @apply text-center py-2;
}

.empty-hint {
  @apply text-sm text-gray-500;
}
</style>
