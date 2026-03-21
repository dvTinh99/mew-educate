<template>
  <div class="pet-stats">
    <div class="stat-row">
      <div class="stat-icon attack">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      </div>
      <div class="stat-info">
        <div class="stat-header">
          <span class="stat-label">Attack</span>
          <span class="stat-value">{{ stats.attack }}</span>
        </div>
        <div class="stat-bar-bg">
          <div class="stat-bar-fill attack" :style="{ width: getStatPercent(stats.attack, 200) + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="stat-row">
      <div class="stat-icon defense">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clip-rule="evenodd"/>
        </svg>
      </div>
      <div class="stat-info">
        <div class="stat-header">
          <span class="stat-label">Defense</span>
          <span class="stat-value">{{ stats.defense }}</span>
        </div>
        <div class="stat-bar-bg">
          <div class="stat-bar-fill defense" :style="{ width: getStatPercent(stats.defense, 150) + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="stat-row">
      <div class="stat-icon health">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
        </svg>
      </div>
      <div class="stat-info">
        <div class="stat-header">
          <span class="stat-label">Health</span>
          <span class="stat-value">{{ stats.health }}/{{ stats.maxHealth }}</span>
        </div>
        <div class="stat-bar-bg">
          <div class="stat-bar-fill health" :style="{ width: getHealthPercent() + '%' }"></div>
        </div>
      </div>
    </div>

    <div v-if="showPower" class="power-row">
      <span class="power-label">Battle Power</span>
      <span class="power-value">{{ power }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PetStats } from '~/types/pet'

interface Props {
  stats: PetStats
  power?: number
  showPower?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  power: 0,
  showPower: false
})

const getStatPercent = (value: number, max: number) => {
  return Math.min(100, Math.round((value / max) * 100))
}

const getHealthPercent = () => {
  return Math.round((props.stats.health / props.stats.maxHealth) * 100)
}
</script>

<style scoped>
.pet-stats {
  @apply space-y-4;
}

.stat-row {
  @apply flex items-center gap-3;
}

.stat-icon {
  @apply w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0;
}

.stat-icon.attack {
  @apply bg-danger-100 text-danger-600;
}

.stat-icon.defense {
  @apply bg-primary-100 text-primary-600;
}

.stat-icon.health {
  @apply bg-success-100 text-success-600;
}

.stat-info {
  @apply flex-1;
}

.stat-header {
  @apply flex justify-between items-center mb-1;
}

.stat-label {
  @apply text-sm font-medium text-gray-700;
}

.stat-value {
  @apply text-sm font-bold text-gray-900;
}

.stat-bar-bg {
  @apply w-full h-2 bg-gray-200 rounded-full overflow-hidden;
}

.stat-bar-fill {
  @apply h-full rounded-full transition-all duration-500;
}

.stat-bar-fill.attack {
  @apply bg-gradient-to-r from-danger-400 to-danger-600;
}

.stat-bar-fill.defense {
  @apply bg-gradient-to-r from-primary-400 to-primary-600;
}

.stat-bar-fill.health {
  @apply bg-gradient-to-r from-success-400 to-success-600;
}

.power-row {
  @apply flex justify-between items-center mt-4 pt-4 border-t-2 border-gray-200;
}

.power-label {
  @apply text-lg font-semibold text-gray-700;
}

.power-value {
  @apply text-2xl font-bold text-warning-600;
}
</style>
