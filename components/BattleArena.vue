<template>
  <div class="battle-arena">
    <div class="battle-header">
      <div class="turn-indicator">
        Turn {{ currentTurn }} / {{ maxTurns }}
      </div>
      <div class="critical-indicator" :class="{ active: criticalStreak > 0 }">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <span>{{ criticalStreak }}x Combo</span>
      </div>
    </div>

    <div class="battle-field">
      <div class="pet-battle-card player">
        <div class="pet-info">
          <span class="pet-name">{{ playerPet?.name }}</span>
          <span class="pet-level">Lv.{{ playerPet?.level }}</span>
        </div>
        <PetDisplay
          v-if="playerPet"
          :name="playerPet.name"
          :level="playerPet.level"
          :stage="playerPet.evolutionStage"
          size="120"
          :animate="isPlayerTurn"
        />
        <div class="hp-bar">
          <div class="hp-text">
            HP: {{ playerHP }} / {{ playerPet?.stats.maxHealth }}
          </div>
          <div class="hp-bar-bg">
            <div 
              class="hp-bar-fill player" 
              :style="{ width: playerHPPercent + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <div class="vs-badge">
        <span>VS</span>
      </div>

      <div class="pet-battle-card enemy">
        <div class="pet-info">
          <span class="pet-name">{{ enemyPet?.name }}</span>
          <span class="pet-level">Lv.{{ enemyPet?.level }}</span>
          <span class="difficulty-badge" :class="enemyPet?.difficulty">
            {{ enemyPet?.difficulty }}
          </span>
        </div>
        <PetDisplay
          v-if="enemyPet"
          :name="enemyPet.name"
          :level="enemyPet.level"
          :stage="enemyPet.evolutionStage"
          size="120"
          :show-glow="false"
        />
        <div class="hp-bar">
          <div class="hp-text">
            HP: {{ enemyHP }} / {{ enemyPet?.stats.maxHealth }}
          </div>
          <div class="hp-bar-bg">
            <div 
              class="hp-bar-fill enemy" 
              :style="{ width: enemyHPPercent + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentQuestion && !battleComplete" class="question-area">
      <div class="question-card">
        <div class="question-header">
          <span class="turn-label" :class="{ 'your-turn': isPlayerTurn }">
            {{ isPlayerTurn ? 'Your Turn!' : "Enemy's Turn..." }}
          </span>
        </div>
        
        <div class="question-content">
          <p class="question-text">{{ currentQuestion.question }}</p>
          
          <div v-if="isPlayerTurn && currentQuestion.options" class="answer-options">
            <button
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              type="button"
              class="answer-btn"
              :class="{
                'selected': selectedAnswer === option,
                'correct': showResult && option === currentQuestion.correctAnswer,
                'incorrect': showResult && selectedAnswer === option && option !== currentQuestion.correctAnswer
              }"
              :disabled="showResult || !isPlayerTurn"
              @click="selectAnswer(option)"
            >
              <span class="option-letter">{{ ['A', 'B', 'C', 'D'][index] }}</span>
              <span class="option-text">{{ option }}</span>
            </button>
          </div>

          <div v-else-if="!isPlayerTurn" class="waiting-message">
            <p>Waiting for enemy attack...</p>
          </div>
        </div>

        <div class="question-footer">
          <div v-if="isPlayerTurn && selectedAnswer && !showResult" class="submit-section">
            <AppButton 
              variant="primary" 
              size="lg"
              full-width
              @click="submitAnswer"
            >
              <span class="text-xl py-3">
                Attack!
              </span>
            </AppButton>
          </div>
          
          <div v-if="showResult" class="result-section">
            <div v-if="lastAnswerCorrect" class="result-message correct">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span>Correct! Damage increased!</span>
            </div>
            <div v-else class="result-message incorrect">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
              <span>Incorrect! Normal damage dealt.</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="battleComplete" class="battle-result">
      <div class="result-content" :class="battleResult">
        <h2 class="text-4xl font-bold mb-4">
          {{ resultText }}
        </h2>
        
        <div class="rewards-section">
          <h3 class="text-lg font-semibold mb-4">Battle Rewards</h3>
          <div class="rewards-grid">
            <div class="reward-item">
              <span class="reward-icon">✨</span>
              <span class="reward-value">+{{ xpEarned }} XP</span>
            </div>
            <div v-if="foodReward" class="reward-item">
              <span class="reward-icon">{{ foodEmoji }}</span>
              <span class="reward-value">+{{ foodReward.amount }} {{ foodReward.type }}</span>
            </div>
          </div>
        </div>

        <AppButton variant="primary" size="lg" @click="$emit('finish')" class="mt-6">
          <span class="text-xl px-8 py-3">
            Continue
          </span>
        </AppButton>
      </div>
    </div>

    <BattleLog v-if="battleLog.length > 0" :log="battleLog" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Pet, BattleOpponent, BattleQuestion, BattleLogEntry, BattleResult, FoodType } from '~/types/pet'
import PetDisplay from './PetDisplay.vue'
import AppButton from './AppButton.vue'
import BattleLog from './BattleLog.vue'

interface Props {
  playerPet: Pet | null
  enemyPet: BattleOpponent | null
  currentTurn: number
  maxTurns: number
  playerHP: number
  enemyHP: number
  criticalStreak: number
  isPlayerTurn: boolean
  battleComplete: boolean
  battleResult: BattleResult | null
  battleLog: BattleLogEntry[]
  currentQuestion: BattleQuestion | null
  questionAnswered: boolean
  lastAnswerCorrect: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'submitAnswer', answer: string): void
  (e: 'attack'): void
  (e: 'finish'): void
}>()

const selectedAnswer = ref<string | null>(null)
const showResult = ref(false)

const playerHPPercent = computed(() => {
  if (!props.playerPet) return 0
  return Math.round((props.playerHP / props.playerPet.stats.maxHealth) * 100)
})

const enemyHPPercent = computed(() => {
  if (!props.enemyPet) return 0
  return Math.round((props.enemyHP / props.enemyPet.stats.maxHealth) * 100)
})

const resultText = computed(() => {
  if (props.battleResult === 'win') return 'Victory!'
  if (props.battleResult === 'lose') return 'Defeat!'
  return 'Draw!'
})

const xpEarned = computed(() => {
  if (!props.battleResult || props.battleResult === 'draw') return 20
  let base = 50 + (props.enemyPet?.level ?? 1) * 10
  if (props.enemyPet?.difficulty === 'medium') base *= 1.5
  if (props.enemyPet?.difficulty === 'hard') base *= 2
  return Math.round(base)
})

const foodReward = computed(() => {
  if (!props.battleResult || props.battleResult === 'draw') return null
  if (props.enemyPet?.difficulty === 'hard') return { type: 'rare' as FoodType, amount: 2 }
  if (props.enemyPet?.difficulty === 'medium') return { type: 'premium' as FoodType, amount: 3 }
  return { type: 'basic' as FoodType, amount: 5 }
})

const foodEmoji = computed(() => {
  if (!foodReward.value) return ''
  if (foodReward.value.type === 'rare') return '🐟✨'
  if (foodReward.value.type === 'premium') return '🐟'
  return '🍖'
})

const selectAnswer = (option: string) => {
  if (!props.isPlayerTurn || showResult.value) return
  selectedAnswer.value = option
}

const submitAnswer = () => {
  if (!selectedAnswer.value || !props.currentQuestion) return
  
  emit('submitAnswer', selectedAnswer.value)
  emit('attack')
  
  setTimeout(() => {
    showResult.value = true
  }, 100)
}

watch(() => props.questionAnswered, (answered) => {
  if (!answered) {
    selectedAnswer.value = null
    showResult.value = false
  }
})

watch(() => props.isPlayerTurn, () => {
  if (props.isPlayerTurn) {
    selectedAnswer.value = null
    showResult.value = false
  }
})
</script>

<style scoped>
.battle-arena {
  @apply space-y-6;
}

.battle-header {
  @apply flex justify-between items-center;
}

.turn-indicator {
  @apply px-4 py-2 bg-gray-100 rounded-full text-lg font-bold text-gray-700;
}

.critical-indicator {
  @apply flex items-center gap-2 px-4 py-2 rounded-full text-lg font-bold text-gray-400;
}

.critical-indicator.active {
  @apply bg-warning-100 text-warning-600 animate-pulse;
}

.battle-field {
  @apply flex items-center justify-between gap-4;
}

.pet-battle-card {
  @apply flex-1 p-6 rounded-2xl bg-white shadow-lg;
}

.pet-battle-card.player {
  @apply border-l-4 border-primary-500;
}

.pet-battle-card.enemy {
  @apply border-r-4 border-danger-500;
}

.pet-info {
  @apply flex items-center gap-2 mb-4;
}

.pet-name {
  @apply font-bold text-gray-900;
}

.pet-level {
  @apply text-sm text-gray-500;
}

.difficulty-badge {
  @apply px-2 py-0.5 rounded-full text-xs font-bold;
}

.difficulty-badge.easy {
  @apply bg-success-100 text-success-700;
}

.difficulty-badge.medium {
  @apply bg-warning-100 text-warning-700;
}

.difficulty-badge.hard {
  @apply bg-danger-100 text-danger-700;
}

.hp-bar {
  @apply mt-4 space-y-1;
}

.hp-text {
  @apply text-sm font-medium text-gray-600;
}

.hp-bar-bg {
  @apply w-full h-3 bg-gray-200 rounded-full overflow-hidden;
}

.hp-bar-fill {
  @apply h-full rounded-full transition-all duration-500;
}

.hp-bar-fill.player {
  @apply bg-gradient-to-r from-primary-400 to-primary-600;
}

.hp-bar-fill.enemy {
  @apply bg-gradient-to-r from-danger-400 to-danger-600;
}

.vs-badge {
  @apply flex-shrink-0 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center;
}

.vs-badge span {
  @apply text-2xl font-bold text-gray-500;
}

.question-area {
  @apply max-w-2xl mx-auto;
}

.question-card {
  @apply bg-white rounded-2xl shadow-lg p-8;
}

.question-header {
  @apply mb-6;
}

.turn-label {
  @apply text-xl font-bold text-gray-500;
}

.turn-label.your-turn {
  @apply text-success-600;
}

.question-text {
  @apply text-2xl font-bold text-gray-900 text-center mb-8;
}

.answer-options {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.answer-btn {
  @apply flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 bg-white transition-all hover:border-primary-300 hover:bg-primary-50 disabled:opacity-100 disabled:cursor-default;
}

.answer-btn.selected {
  @apply border-primary-500 bg-primary-100;
}

.answer-btn.correct {
  @apply border-success-500 bg-success-100;
}

.answer-btn.incorrect {
  @apply border-danger-500 bg-danger-100;
}

.option-letter {
  @apply w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700;
}

.answer-btn.selected .option-letter {
  @apply bg-primary-500 text-white;
}

.answer-btn.correct .option-letter {
  @apply bg-success-500 text-white;
}

.answer-btn.incorrect .option-letter {
  @apply bg-danger-500 text-white;
}

.option-text {
  @apply flex-1 text-left font-medium text-gray-900;
}

.waiting-message {
  @apply text-center text-gray-500 text-lg py-8;
}

.result-section {
  @apply text-center py-4;
}

.result-message {
  @apply flex items-center justify-center gap-3 text-xl font-bold;
}

.result-message.correct {
  @apply text-success-600;
}

.result-message.incorrect {
  @apply text-danger-600;
}

.battle-result {
  @apply max-w-md mx-auto;
}

.result-content {
  @apply bg-white rounded-2xl shadow-lg p-8 text-center;
}

.result-content.win {
  @apply bg-gradient-to-br from-success-50 to-success-100;
}

.result-content.lose {
  @apply bg-gradient-to-br from-danger-50 to-danger-100;
}

.result-content.draw {
  @apply bg-gradient-to-br from-gray-50 to-gray-100;
}

.rewards-section {
  @apply mt-6;
}

.rewards-grid {
  @apply flex justify-center gap-8;
}

.reward-item {
  @apply flex flex-col items-center gap-2;
}

.reward-icon {
  @apply text-4xl;
}

.reward-value {
  @apply font-bold text-gray-900;
}
</style>
