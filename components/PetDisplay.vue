<template>
  <div 
    class="pet-container relative"
    :style="{ '--pet-color': petColor, '--pet-accent': petAccent }"
  >
    <div 
      class="pet-wrapper relative"
      :class="[animationState, moodState]"
      v-motion
      :initial="{ scale: 1 }"
      :enter="{ scale: 1 }"
      :hovered="{ scale: 1.1 }"
    >
      <!-- Base Pet SVG -->
      <svg 
        class="pet-svg w-full h-full"
        viewBox="0 0 200 200"
        :style="{ filter: `drop-shadow(0 10px 20px ${petColor}40)` }"
      >
        <!-- Body -->
        <ellipse 
          cx="100" cy="130" rx="60" ry="50" 
          :fill="petColor"
          class="pet-body"
        />
        
        <!-- Head -->
        <circle 
          cx="100" cy="80" r="50" 
          :fill="petColor"
          class="pet-head"
        />
        
        <!-- Ears -->
        <path 
          d="M60 50 Q50 20 70 40 Q65 50 60 50" 
          :fill="petColor"
          class="pet-ear-left"
        />
        <path 
          d="M140 50 Q150 20 130 40 Q135 50 140 50" 
          :fill="petColor"
          class="pet-ear-right"
        />
        <path 
          d="M62 48 Q55 25 72 42" 
          :fill="petAccent"
        />
        <path 
          d="M138 48 Q145 25 128 42" 
          :fill="petAccent"
        />
        
        <!-- Inner ears -->
        <path d="M62 48 Q55 30 72 45" fill="#FFB6C1" />
        <path d="M138 48 Q145 30 128 45" fill="#FFB6C1" />
        
        <!-- Eyes (hidden when sleeping) -->
        <g class="pet-eyes" v-if="moodState !== 'sleeping'">
          <!-- Left eye -->
          <circle cx="75" cy="75" r="12" fill="white" />
          <circle 
            :cx="leftPupilX" 
            cy="77" 
            r="8" 
            fill="#2d3436"
            class="pupil"
          />
          <circle 
            :cx="leftPupilX + 2" 
            cy="74" 
            r="3" 
            fill="white"
          />
          <!-- Right eye -->
          <circle cx="125" cy="75" r="12" fill="white" />
          <circle 
            :cx="rightPupilX" 
            cy="77" 
            r="8" 
            fill="#2d3436"
            class="pupil"
          />
          <circle 
            :cx="rightPupilX + 2" 
            cy="74" 
            r="3" 
            fill="white"
          />
        </g>
        
        <!-- Sleeping eyes (closed curves) -->
        <g v-if="moodState === 'sleeping'">
          <path d="M65 75 Q75 80 85 75" stroke="#2d3436" stroke-width="3" fill="none" />
          <path d="M115 75 Q125 80 135 75" stroke="#2d3436" stroke-width="3" fill="none" />
        </g>
        
        <!-- Mouth -->
        <path 
          :d="mouthPath" 
          :stroke="petAccent" 
          stroke-width="3" 
          fill="none" 
          stroke-linecap="round"
          class="pet-mouth"
        />
        
        <!-- Blush -->
        <circle cx="55" cy="90" r="8" fill="#FFB6C1" opacity="0.5" v-if="moodState === 'happy'" />
        <circle cx="145" cy="90" r="8" fill="#FFB6C1" opacity="0.5" v-if="moodState === 'happy'" />
        
        <!-- Nose -->
        <ellipse cx="100" cy="90" rx="6" ry="4" fill="#2d3436" />
        
        <!-- Whiskers -->
        <g stroke="#2d3436" stroke-width="1" opacity="0.3">
          <line x1="60" y1="88" x2="30" y2="85" />
          <line x1="60" y1="92" x2="30" y2="95" />
          <line x1="140" y1="88" x2="170" y2="85" />
          <line x1="140" y1="92" x2="170" y2="95" />
        </g>
        
        <!-- Tail -->
        <path 
          d="M155 140 Q180 120 175 100 Q170 90 160 100" 
          :stroke="petColor" 
          stroke-width="15" 
          fill="none" 
          stroke-linecap="round"
          class="pet-tail"
        />
        
        <!-- Paws -->
        <ellipse cx="60" cy="175" rx="20" ry="10" :fill="petColor" />
        <ellipse cx="140" cy="175" rx="20" ry="10" :fill="petColor" />
        
        <!-- Evolution wings (adult) -->
        <g v-if="evolutionStage === 3" class="pet-wings">
          <path 
            d="M40 100 Q20 80 30 50 Q40 70 45 90" 
            :fill="petAccent"
            opacity="0.7"
          />
          <path 
            d="M160 100 Q180 80 170 50 Q160 70 155 90" 
            :fill="petAccent"
            opacity="0.7"
          />
        </g>
        
        <!-- Evolution star (teen) -->
        <g v-if="evolutionStage === 2" class="pet-star">
          <polygon 
            :points="starPoints" 
            :fill="petAccent"
          />
        </g>
      </svg>
      
      <!-- Accessory Layer -->
      <div class="accessory-layer absolute inset-0 pointer-events-none">
        <!-- Hat -->
        <div 
          v-if="accessories.hat" 
          class="absolute hat w-16 h-12 -top-2 left-1/2 -translate-x-1/2"
          :style="{ background: accessories.hat }"
        >
          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-8 rounded-t-full"></div>
        </div>
        
        <!-- Collar -->
        <div 
          v-if="accessories.collar" 
          class="absolute collar w-20 h-4 -bottom-2 left-1/2 -translate-x-1/2 rounded-full"
          :style="{ background: accessories.collar }"
        ></div>
        
        <!-- Bow -->
        <div 
          v-if="accessories.bow" 
          class="absolute bow -top-1 left-1/2 -translate-x-1/2"
        >
          <div class="w-6 h-4 rounded-full" :style="{ background: accessories.bow }"></div>
          <div class="absolute -top-2 left-0 w-4 h-4 rounded-full" :style="{ background: accessories.bow }"></div>
          <div class="absolute -top-2 right-0 w-4 h-4 rounded-full" :style="{ background: accessories.bow }"></div>
        </div>
        
        <!-- Glasses -->
        <div 
          v-if="accessories.glasses" 
          class="absolute top-14 left-1/2 -translate-x-1/2 flex gap-4"
        >
          <div class="w-10 h-8 rounded-full border-2" :style="{ borderColor: accessories.glasses }"></div>
          <div class="w-10 h-8 rounded-full border-2" :style="{ borderColor: accessories.glasses }"></div>
          <div class="w-4 h-1 mt-3" :style="{ background: accessories.glasses }"></div>
        </div>
      </div>
      
      <!-- Mood indicator -->
      <div 
        v-if="showMoodIndicator" 
        class="mood-indicator absolute -top-4 left-1/2 -translate-x-1/2 text-2xl"
        v-motion
        :initial="{ y: 0, opacity: 0 }"
        :enter="{ y: -10, opacity: 1 }"
      >
        {{ moodEmoji }}
      </div>
      
      <!-- Level badge -->
      <div 
        v-if="showLevelBadge"
        class="level-badge absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
      >
        Lv.{{ level }}
      </div>
    </div>
    
    <!-- Pet name -->
    <p v-if="showName" class="pet-name text-center font-bold text-lg mt-2" :style="{ color: petColor }">
      {{ name }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useMotion } from '@vueuse/motion'

interface Props {
  name?: string
  level?: number
  evolutionStage?: 1 | 2 | 3
  mood?: 'happy' | 'sad' | 'hungry' | 'sleeping' | 'normal'
  petColor?: string
  petAccent?: string
  accessories?: {
    hat?: string
    collar?: string
    bow?: string
    glasses?: string
  }
  size?: 'sm' | 'md' | 'lg'
  showMoodIndicator?: boolean
  showLevelBadge?: boolean
  showName?: boolean
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  name: 'Pet',
  level: 1,
  evolutionStage: 1,
  mood: 'normal',
  petColor: '#FF9F43',
  petAccent: '#FFEAA7',
  accessories: () => ({}),
  size: 'md',
  showMoodIndicator: true,
  showLevelBadge: true,
  showName: true,
  animated: true,
})

const moodState = computed(() => props.mood)
const animationState = computed(() => props.animated ? 'animated' : '')

const leftPupilX = computed(() => {
  switch (props.mood) {
    case 'happy': return 78
    case 'sad': return 72
    default: return 75
  }
})

const rightPupilX = computed(() => {
  switch (props.mood) {
    case 'happy': return 128
    case 'sad': return 122
    default: return 125
  }
})

const mouthPath = computed(() => {
  switch (props.mood) {
    case 'happy': return 'M85 100 Q100 115 115 100'
    case 'sad': return 'M85 105 Q100 95 115 105'
    case 'sleeping': return 'M90 100 Q100 102 110 100'
    default: return 'M90 100 Q100 105 110 100'
  }
})

const moodEmoji = computed(() => {
  switch (props.mood) {
    case 'happy': return '💕'
    case 'sad': return '😢'
    case 'hungry': return '🍖'
    case 'sleeping': return '💤'
    default: return ''
  }
})

const starPoints = computed(() => {
  const cx = 100
  const cy = 35
  const points = []
  for (let i = 0; i < 10; i++) {
    const angle = (i * 36 - 90) * Math.PI / 180
    const radius = i % 2 === 0 ? 12 : 6
    points.push(`${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`)
  }
  return points.join(' ')
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-24 h-24'
    case 'lg': return 'w-48 h-48'
    default: return 'w-32 h-32'
  }
})
</script>

<style scoped>
.pet-container {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

.pet-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
}

/* Animations */
.animated .pet-body {
  animation: bodyBounce 2s ease-in-out infinite;
}

.animated .pet-head {
  animation: headBob 2s ease-in-out infinite;
}

.animated .pet-ear-left {
  animation: earWiggleLeft 3s ease-in-out infinite;
}

.animated .pet-ear-right {
  animation: earWiggleRight 3s ease-in-out infinite;
}

.animated .pet-tail {
  animation: tailWag 1s ease-in-out infinite;
}

.animated .pet-eyes {
  animation: blink 4s ease-in-out infinite;
}

.animated .pet-mouth {
  animation: mouthTalk 2s ease-in-out infinite;
}

/* Mood-based animations */
.happy .pet-body {
  animation: happyBounce 0.5s ease-in-out infinite;
}

.happy .pet-tail {
  animation: tailWagFast 0.3s ease-in-out infinite;
}

.sad .pet-body {
  animation: sadDroop 3s ease-in-out infinite;
}

.sad .pet-head {
  transform: translateY(5px);
}

.sleeping .pet-body {
  animation: sleepBreathe 3s ease-in-out infinite;
}

.sleeping .pet-head {
  animation: sleepNod 4s ease-in-out infinite;
}

.hungry .pet-body {
  animation: hungryShake 0.5s ease-in-out infinite;
}

/* Keyframes */
@keyframes bodyBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes happyBounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.02); }
}

@keyframes sadDroop {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(3px); }
}

@keyframes sleepBreathe {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.03); }
}

@keyframes hungryShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

@keyframes headBob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

@keyframes sleepNod {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(3deg); }
}

@keyframes earWiggleLeft {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

@keyframes earWiggleRight {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(5deg); }
  75% { transform: rotate(-5deg); }
}

@keyframes tailWag {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(10deg); }
}

@keyframes tailWagFast {
  0%, 100% { transform: rotate(-10deg); }
  50% { transform: rotate(10deg); }
}

@keyframes blink {
  0%, 90%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.1); }
}

@keyframes mouthTalk {
  0%, 100% { transform: scaleX(1); }
  50% { transform: scaleX(1.1); }
}

/* Wings animation for adult */
.pet-wings {
  animation: wingsFlap 0.5s ease-in-out infinite;
  transform-origin: center;
}

@keyframes wingsFlap {
  0%, 100% { transform: scaleX(1); }
  50% { transform: scaleX(0.8); }
}

/* Star animation for teen */
.pet-star {
  animation: starSparkle 1s ease-in-out infinite;
}

@keyframes starSparkle {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
  50% { transform: scale(1.2) rotate(10deg); opacity: 0.8; }
}

/* Accessory styles */
.accessory-layer {
  pointer-events: none;
}

.hat {
  clip-path: polygon(20% 100%, 80% 100%, 100% 0%, 0% 0%);
}

.collar {
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.bow {
  animation: bowBounce 1s ease-in-out infinite;
}

@keyframes bowBounce {
  0%, 100% { transform: translateX(-50%) scale(1); }
  50% { transform: translateX(-50%) scale(1.1); }
}

/* Mood indicator */
.mood-indicator {
  animation: moodPop 0.5s ease-out;
}

@keyframes moodPop {
  0% { transform: translateX(-50%) scale(0); }
  50% { transform: translateX(-50%) scale(1.2); }
  100% { transform: translateX(-50%) scale(1); }
}

/* Level badge */
.level-badge {
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.5); }
  50% { box-shadow: 0 0 0 8px rgba(251, 191, 36, 0); }
}
</style>
