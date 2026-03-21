<template>
  <div class="pet-page">
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <button 
          @click="router.push('/')"
          class="inline-flex items-center gap-2 text-lg text-gray-600 hover:text-primary-600 mb-4 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Decks
        </button>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">My Pet</h1>
        <p class="text-xl text-gray-600">Care for your pet and make it stronger</p>
      </div>

      <PetLeaderboardMini class="mb-8" />

      <div v-if="!pet" class="card p-12 text-center max-w-lg mx-auto">
        <div class="w-32 h-32 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <span class="text-6xl">🐱</span>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">No Pet Yet!</h2>
        <p class="text-lg text-gray-600 mb-8">
          Complete exams and study sessions to earn food and adopt your very own cat companion
        </p>
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-center gap-4 text-gray-700">
            <div class="flex items-center gap-2">
              <span>🍖</span>
              <span>Earn Food</span>
            </div>
            <span class="text-gray-400">→</span>
            <div class="flex items-center gap-2">
              <span>🐱</span>
              <span>Adopt Pet</span>
            </div>
            <span class="text-gray-400">→</span>
            <div class="flex items-center gap-2">
              <span>⚔️</span>
              <span>BATTLE!</span>
            </div>
          </div>
          <AppButton 
            variant="primary" 
            size="lg"
            :disabled="petStore.totalFood < 10"
            @click="adoptPet"
          >
            <span class="text-xl px-8 py-4">
              Adopt Pet (10 Basic Food)
            </span>
          </AppButton>
          <p class="text-sm text-gray-500">
            You currently have {{ petStore.foodInventory.basic }} basic food
          </p>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <div class="card p-8">
            <div class="pet-header mb-6">
              <div v-if="!isRenaming" class="flex items-center justify-between">
                <h2 class="text-2xl font-bold text-gray-900">{{ pet.name }}</h2>
                <button
                  type="button"
                  class="rename-btn"
                  @click="startRename"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span class="hidden sm:inline">Rename</span>
                </button>
              </div>
              <div v-else class="rename-form">
                <input
                  v-model="newPetName"
                  type="text"
                  class="rename-input"
                  placeholder="Enter new name"
                  maxlength="20"
                  @keyup.enter="confirmRename"
                  @keyup.escape="cancelRename"
                  ref="nameInputRef"
                />
                <div class="rename-actions">
                  <button type="button" class="rename-confirm" @click="confirmRename">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button type="button" class="rename-cancel" @click="cancelRename">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="flex flex-col md:flex-row items-center gap-8">
              <div class="relative">
                <PetDisplay
                  :name="pet.name"
                  :level="pet.level"
                  :evolution-stage="pet.evolutionStage"
                  :pet-color="pet.customization?.color || '#FF9F43'"
                  :pet-accent="pet.customization?.accentColor || '#FFEAA7'"
                  :accessories="pet.customization?.accessories || {}"
                  :show-name="false"
                  :show-level-badge="true"
                  :show-mood-indicator="true"
                  :mood="currentMood"
                  size="lg"
                  :animated="true"
                />
                <button
                  class="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                  @click="showCustomizeModal = true"
                  title="Customize Pet"
                >
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              
              <div class="flex-1 space-y-6">
                <div class="xp-section">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-lg font-semibold text-gray-700">Experience</span>
                    <span class="text-lg font-bold text-primary-600">
                      {{ pet.experience }} / {{ xpRequired }} XP
                    </span>
                  </div>
                  <div class="xp-bar-bg">
                    <div 
                      class="xp-bar-fill" 
                      :style="{ width: xpProgressPercent + '%' }"
                    ></div>
                  </div>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ xpToNextLevel }} XP to Level {{ pet.level + 1 }}
                  </p>
                </div>

                <PetStats
                  :stats="pet.stats"
                  :power="petStore.petPower"
                  :show-power="true"
                />
              </div>
            </div>
          </div>

          <div class="card p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Food Inventory</h2>
            <FoodInventory
              :inventory="petStore.foodInventory"
              :max-capacity="petStore.maxFoodCapacity"
            />
            <AppButton 
              variant="primary" 
              size="lg"
              class="mt-6 w-full"
              :disabled="!petStore.canFeed"
              @click="showFeedModal = true"
            >
              <span class="flex items-center justify-center gap-2 text-xl py-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Feed {{ pet.name }}
              </span>
            </AppButton>
          </div>
        </div>

        <div class="space-y-8">
          <div class="card p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="w-6 h-6 text-warning-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Battle Stats
            </h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Total Battles</span>
                <span class="font-bold text-gray-900">{{ petStore.battleHistory.length }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Wins</span>
                <span class="font-bold text-success-600">{{ petStore.battleWins }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Losses</span>
                <span class="font-bold text-danger-600">{{ petStore.battleLosses }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Win Rate</span>
                <span class="font-bold text-primary-600">{{ petStore.winRate }}%</span>
              </div>
            </div>
          </div>

          <AppButton 
            variant="warning" 
            size="lg"
            full-width
            @click="router.push('/battle')"
          >
            <span class="flex items-center justify-center gap-2 text-xl py-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
              Enter Battle Arena
            </span>
          </AppButton>

          <div class="card p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Evolution Guide</h3>
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <span class="text-2xl">🐱</span>
                </div>
                <div>
                  <p class="font-semibold text-gray-900">Baby (Lv. 1-10)</p>
                  <p class="text-sm text-gray-500">Starting form</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <span class="text-2xl">🐱</span>
                </div>
                <div>
                  <p class="font-semibold text-gray-900">Teen (Lv. 11-30)</p>
                  <p class="text-sm text-gray-500">Unlocks special abilities</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-warning-100 flex items-center justify-center">
                  <span class="text-2xl">🐱</span>
                </div>
                <div>
                  <p class="font-semibold text-gray-900">Adult (Lv. 31+)</p>
                  <p class="text-sm text-gray-500">Maximum power</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FeedPetModal
        v-model="showFeedModal"
        @fed="handleFed"
      />

      <EvolutionModal
        :show="showEvolutionModal"
        :pet-name="pet?.name ?? 'Whiskers'"
        :level="pet?.level ?? 1"
        :old-stage="evolutionOldStage"
        :new-stage="evolutionNewStage"
        @close="showEvolutionModal = false"
      />

      <CustomizePetModal
        v-model="showCustomizeModal"
        :pet-name="pet?.name ?? 'Pet'"
        :pet-level="pet?.level ?? 1"
        :evolution-stage="pet?.evolutionStage ?? 1"
        :initial-color="pet?.customization?.color"
        :initial-accent="pet?.customization?.accentColor"
        :initial-accessories="pet?.customization?.accessories"
        @save="handleCustomizationSave"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { usePetStore } from '~/stores/pet'
import { getXPForNextLevel, type EvolutionStage, type PetCustomization } from '~/types/pet'
import PetDisplay from '~/components/PetDisplay.vue'
import PetStats from '~/components/PetStats.vue'
import FoodInventory from '~/components/FoodInventory.vue'
import FeedPetModal from '~/components/FeedPetModal.vue'
import EvolutionModal from '~/components/EvolutionModal.vue'
import CustomizePetModal from '~/components/CustomizePetModal.vue'
import AppButton from '~/components/AppButton.vue'
import PetLeaderboardMini from '~/components/PetLeaderboardMini.vue'

const router = useRouter()
const petStore = usePetStore()

const showFeedModal = ref(false)
const showEvolutionModal = ref(false)
const showCustomizeModal = ref(false)
const evolutionOldStage = ref<EvolutionStage>(1)
const evolutionNewStage = ref<EvolutionStage>(1)
const isRenaming = ref(false)
const newPetName = ref('')

const pet = computed(() => petStore.pet)
const currentMood = computed(() => {
  if (!pet.value) return 'normal'
  const hoursSinceFed = pet.value.lastFed 
    ? (Date.now() - new Date(pet.value.lastFed).getTime()) / (1000 * 60 * 60) 
    : 999
  if (hoursSinceFed > 48) return 'sad'
  if (hoursSinceFed > 24) return 'hungry'
  if (pet.value.feedingStreak >= 3) return 'happy'
  return 'normal'
})
const nameInputRef = ref<HTMLInputElement | null>(null)

const xpRequired = computed(() => {
  return getXPForNextLevel(pet.value?.level ?? 1)
})

const xpProgressPercent = computed(() => {
  if (!pet.value) return 0
  return Math.round((pet.value.experience / xpRequired.value) * 100)
})

const xpToNextLevel = computed(() => {
  return xpRequired.value - (pet.value?.experience ?? 0)
})

const adoptPet = () => {
  if (petStore.foodInventory.basic >= 10) {
    petStore.foodInventory.basic -= 10
    petStore.createStarterPet()
    petStore.saveToStorage()
  }
}

const startRename = () => {
  newPetName.value = pet.value?.name ?? ''
  isRenaming.value = true
  nextTick(() => {
    nameInputRef.value?.focus()
  })
}

const confirmRename = () => {
  const trimmedName = newPetName.value.trim()
  if (trimmedName && trimmedName.length > 0) {
    petStore.renamePet(trimmedName)
  }
  isRenaming.value = false
}

const cancelRename = () => {
  isRenaming.value = false
  newPetName.value = ''
}

const handleFed = (result: { leveled: boolean; evolved: boolean }) => {
  if (result.evolved && pet.value) {
    evolutionOldStage.value = pet.value.evolutionStage
    evolutionNewStage.value = pet.value.evolutionStage
    petStore.hasSeenEvolution = true
    showEvolutionModal.value = true
  }
}

const handleCustomizationSave = (customization: { color: string; accent: string; accessories: any }) => {
  if (pet.value) {
    petStore.updatePetCustomization(customization)
  }
  petStore.saveToStorage()
}

onMounted(() => {
  petStore.loadFromStorage()
})

useHead({
  title: 'My Pet - Learn by Game'
})
</script>

<style scoped>
.pet-page {
  @apply min-h-screen bg-gradient-to-b from-amber-50 to-orange-50;
}

.xp-section {
  @apply space-y-2;
}

.xp-bar-bg {
  @apply w-full h-4 bg-gray-200 rounded-full overflow-hidden;
}

.xp-bar-fill {
  @apply h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500;
}

.pet-header {
  @apply flex items-center justify-between;
}

.rename-btn {
  @apply flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors;
}

.rename-form {
  @apply flex items-center gap-3 w-full;
}

.rename-input {
  @apply flex-1 px-4 py-3 text-lg border-2 border-primary-300 rounded-xl focus:outline-none focus:border-primary-500 transition-colors;
}

.rename-actions {
  @apply flex items-center gap-2;
}

.rename-confirm {
  @apply w-12 h-12 rounded-xl bg-success-500 text-white flex items-center justify-center hover:bg-success-600 transition-colors;
}

.rename-cancel {
  @apply w-12 h-12 rounded-xl bg-gray-300 text-gray-600 flex items-center justify-center hover:bg-gray-400 transition-colors;
}
</style>
