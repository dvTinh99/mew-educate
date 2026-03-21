<template>
  <Teleport to="body">
    <Transition name="evolution">
      <div v-if="show" class="evolution-overlay">
        <div class="evolution-content">
          <div class="stars">
            <span v-for="i in 20" :key="i" class="star" :style="getStarStyle(i)">✨</span>
          </div>

          <div class="evolution-text">
            <h2 class="text-4xl font-bold text-gray-900 mb-2">EVOLUTION!</h2>
            <p class="text-2xl text-gray-700">
              {{ petName }} evolved into a {{ newStageName }}!
            </p>
          </div>

          <div class="pet-evolution">
            <div class="old-form">
              <PetDisplay
                :name="petName"
                :level="level"
                :stage="oldStage"
                size="100"
                :show-name="true"
              />
              <span class="form-label">Before</span>
            </div>

            <div class="evolution-arrow">
              <svg class="w-12 h-12 text-warning-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>

            <div class="new-form">
              <PetDisplay
                :name="petName"
                :level="level"
                :stage="newStage"
                size="150"
                :show-name="true"
                :show-stage="true"
                :animate="true"
              />
              <span class="form-label">After</span>
            </div>
          </div>

          <div class="evolution-stats">
            <div class="stat-change">
              <span class="stat-label">Attack</span>
              <span class="stat-bonus">+{{ attackBonus }}</span>
            </div>
            <div class="stat-change">
              <span class="stat-label">Defense</span>
              <span class="stat-bonus">+{{ defenseBonus }}</span>
            </div>
            <div class="stat-change">
              <span class="stat-label">Max Health</span>
              <span class="stat-bonus">+{{ healthBonus }}</span>
            </div>
          </div>

          <AppButton variant="primary" size="lg" @click="close" class="mt-8">
            <span class="text-xl px-8 py-4">
              Awesome!
            </span>
          </AppButton>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { EvolutionStage } from '~/types/pet'
import PetDisplay from './PetDisplay.vue'
import AppButton from './AppButton.vue'

interface Props {
  show: boolean
  petName: string
  level: number
  oldStage: EvolutionStage
  newStage: EvolutionStage
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const newStageName = (stage: EvolutionStage) => {
  if (stage === 2) return 'Teen Cat'
  if (stage === 3) return 'Adult Cat'
  return 'Baby Cat'
}

const attackBonus = 5
const defenseBonus = 3
const healthBonus = 20

const getStarStyle = (index: number) => {
  const angle = (index / 20) * 360
  const distance = 150 + Math.random() * 100
  const delay = Math.random() * 2
  return {
    '--angle': `${angle}deg`,
    '--distance': `${distance}px`,
    '--delay': `${delay}s`
  }
}

const close = () => {
  emit('close')
}
</script>

<style scoped>
.evolution-overlay {
  @apply fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80;
}

.evolution-content {
  @apply text-center p-8 relative;
}

.evolution-enter-active {
  animation: evolution-in 1s ease-out;
}

.evolution-leave-active {
  animation: evolution-out 0.5s ease-in;
}

@keyframes evolution-in {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes evolution-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
}

.stars {
  @apply absolute inset-0 pointer-events-none overflow-hidden;
}

.star {
  @apply absolute text-2xl;
  top: 50%;
  left: 50%;
  animation: star-burst 2s ease-out forwards;
  animation-delay: var(--delay);
}

@keyframes star-burst {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(0deg) translateY(0);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(var(--angle)) translateY(calc(var(--distance) * -1));
  }
}

.evolution-text {
  @apply mb-8 relative z-10;
}

.pet-evolution {
  @apply flex items-center justify-center gap-8 mb-8 relative z-10;
}

.old-form,
.new-form {
  @apply flex flex-col items-center;
}

.form-label {
  @apply text-sm font-medium text-gray-500 mt-2;
}

.evolution-arrow {
  @apply animate-pulse;
}

.evolution-stats {
  @apply flex justify-center gap-8 relative z-10;
}

.stat-change {
  @apply flex flex-col items-center;
}

.stat-label {
  @apply text-sm text-gray-400;
}

.stat-bonus {
  @apply text-2xl font-bold text-success-500;
}
</style>
