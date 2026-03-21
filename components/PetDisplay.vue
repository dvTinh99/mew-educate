<template>
  <div class="pet-display" :class="[`stage-${stage}`, { 'is-bouncing': animate }]">
    <div class="pet-container">
      <svg class="pet-svg" viewBox="0 0 100 100" :class="`size-${size}`">
        <defs>
          <radialGradient :id="`glow-${uid}`" cx="50%" cy="50%" r="50%">
            <stop offset="0%" :stop-color="glowColor" stop-opacity="0.3" />
            <stop offset="100%" :stop-color="glowColor" stop-opacity="0" />
          </radialGradient>
        </defs>
        
        <circle v-if="showGlow" :cx="centerX" :cy="centerY" r="45" :fill="`url(#glow-${uid})`" />
        
        <g :transform="`translate(${centerX - 25}, ${centerY - 25}) scale(${size / 100})`">
          <ellipse cx="25" cy="70" rx="15" ry="5" fill="rgba(0,0,0,0.1)" />
          
          <path d="M5 30 L10 10 L20 25" :fill="catColor" />
          <path d="M45 30 L40 10 L30 25" :fill="catColor" />
          
          <ellipse cx="25" cy="45" rx="20" ry="18" :fill="catColor" />
          
          <ellipse cx="25" cy="35" rx="15" ry="12" fill="#FFE4C9" />
          
          <ellipse cx="18" cy="32" rx="4" ry="5" fill="white" />
          <ellipse cx="32" cy="32" rx="4" ry="5" fill="white" />
          <circle cx="18" cy="33" r="2.5" :fill="eyeColor" />
          <circle cx="32" cy="33" r="2.5" :fill="eyeColor" />
          <circle cx="17" cy="32" r="1" fill="white" />
          <circle cx="31" cy="32" r="1" fill="white" />
          
          <ellipse cx="25" cy="38" rx="2" ry="1.5" fill="#FFB6C1" />
          
          <path d="M23 40 Q25 42 27 40" stroke="#333" stroke-width="0.5" fill="none" />
          
          <line x1="8" y1="35" x2="15" y2="33" stroke="#333" stroke-width="0.5" />
          <line x1="8" y1="38" x2="15" y2="38" stroke="#333" stroke-width="0.5" />
          <line x1="42" y1="33" x2="35" y2="35" stroke="#333" stroke-width="0.5" />
          <line x1="42" y1="38" x2="35" y2="38" stroke="#333" stroke-width="0.5" />
          
          <ellipse cx="10" cy="55" rx="8" ry="12" :fill="catColor" />
          <ellipse cx="40" cy="55" rx="8" ry="12" :fill="catColor" />
          
          <path d="M38 65 Q50 70 42 80" :stroke="tailColor" stroke-width="4" fill="none" stroke-linecap="round" />
          
          <g v-if="stage >= 2" class="accessory">
            <circle cx="25" cy="20" r="8" fill="rgba(255,215,0,0.6)" />
            <text x="25" y="23" text-anchor="middle" font-size="8" fill="#FFD700">★</text>
          </g>
          
          <g v-if="stage >= 3" class="wings">
            <path d="M-5 45 Q-15 35 -10 25" :stroke="wingColor" stroke-width="3" fill="none" stroke-linecap="round" />
            <path d="M55 45 Q65 35 60 25" :stroke="wingColor" stroke-width="3" fill="none" stroke-linecap="round" />
          </g>
        </g>
        
        <text v-if="showName" :x="centerX" :y="95" text-anchor="middle" class="pet-name">
          {{ name }}
        </text>
      </svg>
      
      <div v-if="showLevel" class="level-badge" :class="`level-stage-${stage}`">
        Lv.{{ level }}
      </div>
      
      <div v-if="showStage" class="stage-badge">
        {{ stageName }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EvolutionStage } from '~/types/pet'

interface Props {
  name?: string
  level?: number
  stage?: EvolutionStage
  size?: number
  showName?: boolean
  showLevel?: boolean
  showStage?: boolean
  showGlow?: boolean
  animate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  name: 'Whiskers',
  level: 1,
  stage: 1,
  size: 100,
  showName: false,
  showLevel: true,
  showStage: true,
  showGlow: true,
  animate: false
})

const uid = Math.random().toString(36).substr(2, 9)

const centerX = 50
const centerY = 45

const catColor = computed(() => {
  if (props.stage === 1) return '#FFB347'
  if (props.stage === 2) return '#FF8C42'
  return '#FF6B35'
})

const tailColor = computed(() => {
  if (props.stage === 1) return '#E6952E'
  if (props.stage === 2) return '#E67332'
  return '#CC5522'
})

const eyeColor = computed(() => {
  if (props.stage === 1) return '#333'
  if (props.stage === 2) return '#FFD700'
  return '#FF4500'
})

const glowColor = computed(() => {
  if (props.stage === 1) return '#FFB347'
  if (props.stage === 2) return '#FFD700'
  return '#FF6B35'
})

const wingColor = computed(() => 'rgba(255, 215, 0, 0.7)')

const stageName = computed(() => {
  if (props.stage === 1) return 'Baby'
  if (props.stage === 2) return 'Teen'
  return 'Adult'
})
</script>

<style scoped>
.pet-display {
  @apply relative;
}

.pet-container {
  @apply relative flex flex-col items-center;
}

.pet-svg {
  @apply w-full h-auto;
}

.size-100 {
  @apply max-w-32 max-h-32;
}

.size-150 {
  @apply max-w-48 max-h-48;
}

.size-200 {
  @apply max-w-64 max-h-64;
}

.is-bouncing {
  animation: bounce 0.5s ease infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.level-badge {
  @apply absolute top-0 right-0 px-2 py-1 rounded-full text-sm font-bold text-white;
}

.level-stage-1 {
  @apply bg-gray-400;
}

.level-stage-2 {
  @apply bg-primary-500;
}

.level-stage-3 {
  @apply bg-warning-500;
}

.stage-badge {
  @apply mt-2 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700;
}

.stage-2 .stage-badge {
  @apply bg-primary-100 text-primary-700;
}

.stage-3 .stage-badge {
  @apply bg-warning-100 text-warning-700;
}

.pet-name {
  @apply text-lg font-bold fill-gray-800;
}

.accessory {
  animation: sparkle 1s ease infinite;
}

@keyframes sparkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.2); }
}

.wings {
  animation: flutter 0.5s ease infinite;
}

@keyframes flutter {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(5deg); }
}
</style>
