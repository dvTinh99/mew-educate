<template>
  <div class="battle-page">
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <button 
          @click="handleBack"
          class="inline-flex items-center gap-2 text-lg text-gray-600 hover:text-primary-600 mb-4 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {{ session.isActive.value ? 'Exit Battle' : 'Back' }}
        </button>
        
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold text-gray-900 mb-2">Battle Arena</h1>
            <p class="text-xl text-gray-600">Test your pet's strength!</p>
          </div>
          
          <div v-if="!session.isActive.value" class="flex items-center gap-4">
            <PetDisplay
              v-if="pet"
              :name="pet.name"
              :level="pet.level"
              :stage="pet.evolutionStage"
              size="80"
            />
            <div class="text-right">
              <p class="font-bold text-gray-900">{{ pet?.name }}</p>
              <p class="text-sm text-gray-500">Power: {{ petStore.petPower }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!pet" class="card p-12 text-center max-w-lg mx-auto">
        <div class="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <span class="text-5xl">🐱</span>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">No Pet Available</h2>
        <p class="text-lg text-gray-600 mb-8">
          You need to adopt a pet first before you can battle!
        </p>
        <AppButton variant="primary" size="lg" @click="router.push('/pet')">
          <span class="text-xl px-8 py-4">
            Go to Pet Page
          </span>
        </AppButton>
      </div>

      <div v-else-if="!session.isActive.value && !session.battleComplete.value" class="opponent-selection">
        <div class="difficulty-tabs mb-8">
          <button
            v-for="diff in difficulties"
            :key="diff.value"
            type="button"
            class="difficulty-tab"
            :class="{ active: selectedDifficulty === diff.value }"
            @click="selectedDifficulty = diff.value"
          >
            <span class="diff-icon">{{ diff.icon }}</span>
            <span class="diff-name">{{ diff.name }}</span>
            <span class="diff-desc">{{ diff.description }}</span>
          </button>
        </div>

        <div class="opponents-grid">
          <button
            v-for="opponent in generatedOpponents"
            :key="opponent.id"
            type="button"
            class="opponent-card"
            @click="startBattle(opponent)"
          >
            <PetDisplay
              :name="opponent.name"
              :level="opponent.level"
              :stage="opponent.evolutionStage"
              size="100"
              :show-name="true"
              :show-level="true"
            />
            <div class="opponent-stats">
              <div class="stat-row">
                <span class="stat-icon">⚔️</span>
                <span>ATK: {{ opponent.stats.attack }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-icon">🛡️</span>
                <span>DEF: {{ opponent.stats.defense }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-icon">❤️</span>
                <span>HP: {{ opponent.stats.maxHealth }}</span>
              </div>
            </div>
            <div class="rewards-preview">
              <span class="reward-item">
                <span>✨</span>
                <span>+{{ getXPPreview(opponent) }} XP</span>
              </span>
              <span class="reward-item">
                <span>{{ getFoodEmoji(opponent) }}</span>
                <span>+{{ getFoodAmount(opponent) }}</span>
              </span>
            </div>
          </button>
        </div>
      </div>

      <div v-else class="battle-content">
        <BattleArena
          :player-pet="session.playerPet.value"
          :enemy-pet="session.enemyPet.value"
          :current-turn="session.currentTurn.value"
          :max-turns="session.maxTurns.value"
          :player-h-p="session.playerHP.value"
          :enemy-h-p="session.enemyHP.value"
          :critical-streak="session.criticalStreak.value"
          :is-player-turn="session.isPlayerTurn.value"
          :battle-complete="session.battleComplete.value"
          :battle-result="session.battleResult.value"
          :battle-log="session.battleLog.value"
          :current-question="session.currentQuestion.value"
          :question-answered="session.questionAnswered.value"
          :last-answer-correct="session.lastAnswerCorrect.value"
          @submit-answer="handleSubmitAnswer"
          @attack="handleAttack"
          @finish="handleFinish"
        />
      </div>

      <Modal
        v-model="showExitModal"
        title="Exit Battle?"
        size="sm"
      >
        <div class="text-lg">
          <p class="mb-4">
            Are you sure you want to exit? Your battle progress will be lost.
          </p>
        </div>
        
        <template #footer>
          <AppButton variant="outline" size="lg" @click="showExitModal = false">
            Continue Fighting
          </AppButton>
          <AppButton variant="danger" size="lg" @click="confirmExit">
            Exit Battle
          </AppButton>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePetStore } from '~/stores/pet'
import { useDeckStore } from '~/stores/deck'
import { useBattleSession } from '~/composables/useBattleSession'
import type { BattleOpponent, FoodType } from '~/types/pet'
import PetDisplay from '~/components/PetDisplay.vue'
import BattleArena from '~/components/BattleArena.vue'
import Modal from '~/components/Modal.vue'
import AppButton from '~/components/AppButton.vue'

const router = useRouter()
const petStore = usePetStore()
const deckStore = useDeckStore()
const session = useBattleSession()

const selectedDifficulty = ref<'easy' | 'medium' | 'hard'>('easy')
const showExitModal = ref(false)

const pet = computed(() => petStore.pet)

const difficulties = [
  { 
    value: 'easy' as const, 
    name: 'Easy', 
    icon: '🌱',
    description: 'Great for beginners'
  },
  { 
    value: 'medium' as const, 
    name: 'Medium', 
    icon: '⚡',
    description: 'A fair challenge'
  },
  { 
    value: 'hard' as const, 
    name: 'Hard', 
    icon: '🔥',
    description: 'For experienced trainers'
  }
]

const generatedOpponents = computed(() => {
  return [
    petStore.generateOpponent(selectedDifficulty.value),
    petStore.generateOpponent(selectedDifficulty.value),
    petStore.generateOpponent(selectedDifficulty.value)
  ]
})

const startBattle = (opponent: BattleOpponent) => {
  if (!pet.value) return
  
  if (deckStore.decks.length === 0) {
    alert('You need at least one deck with cards to battle!')
    return
  }
  
  session.startBattle(opponent)
}

const handleSubmitAnswer = (answer: string) => {
  session.submitAnswer(answer)
}

const handleAttack = () => {
  session.executePlayerAttack()
}

const handleFinish = () => {
  session.resetBattle()
}

const handleBack = () => {
  if (session.isActive.value) {
    showExitModal.value = true
  } else {
    router.push('/pet')
  }
}

const confirmExit = () => {
  session.resetBattle()
  showExitModal.value = false
  router.push('/pet')
}

const getXPPreview = (opponent: BattleOpponent) => {
  let base = 50 + opponent.level * 10
  if (opponent.difficulty === 'medium') base *= 1.5
  if (opponent.difficulty === 'hard') base *= 2
  return Math.round(base)
}

const getFoodAmount = (opponent: BattleOpponent) => {
  if (opponent.difficulty === 'hard') return 2
  if (opponent.difficulty === 'medium') return 3
  return 5
}

const getFoodEmoji = (opponent: BattleOpponent) => {
  if (opponent.difficulty === 'hard') return '🐟✨'
  if (opponent.difficulty === 'medium') return '🐟'
  return '🍖'
}

onMounted(() => {
  petStore.loadFromStorage()
  deckStore.loadFromStorage()
})

useHead({
  title: 'Battle Arena - Learn by Game'
})
</script>

<style scoped>
.battle-page {
  @apply min-h-screen bg-gradient-to-b from-gray-50 to-gray-100;
}

.difficulty-tabs {
  @apply flex justify-center gap-4;
}

.difficulty-tab {
  @apply flex flex-col items-center p-6 rounded-2xl border-2 border-gray-200 bg-white transition-all hover:border-gray-300 min-w-40;
}

.difficulty-tab.active {
  @apply border-primary-500 bg-primary-50;
}

.diff-icon {
  @apply text-4xl mb-2;
}

.diff-name {
  @apply font-bold text-gray-900 text-lg;
}

.diff-desc {
  @apply text-sm text-gray-500;
}

.opponents-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-6;
}

.opponent-card {
  @apply bg-white rounded-2xl shadow-lg p-6 text-center transition-all hover:scale-105 hover:shadow-xl;
}

.opponent-stats {
  @apply my-4 space-y-2;
}

.stat-row {
  @apply flex items-center justify-center gap-2 text-sm text-gray-600;
}

.rewards-preview {
  @apply flex justify-center gap-4 pt-4 border-t border-gray-100;
}

.reward-item {
  @apply flex items-center gap-1 text-sm font-medium text-gray-700;
}

.battle-content {
  @apply max-w-4xl mx-auto;
}
</style>
