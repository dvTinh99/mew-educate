<template>
  <Modal
    :model-value="modelValue"
    title="Feed Your Pet"
    size="md"
  >
    <div class="feed-pet-content">
      <div class="pet-preview mb-6">
        <PetDisplay
          v-if="pet"
          :name="pet.name"
          :level="pet.level"
          :stage="pet.evolutionStage"
          :show-name="true"
          :show-level="true"
          :show-stage="true"
          size="150"
          :animate="isAnimating"
        />
      </div>

      <div class="xp-progress mb-6">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700">Experience</span>
          <span class="text-sm font-bold text-primary-600">
            {{ pet?.experience ?? 0 }} / {{ xpRequired }} XP
          </span>
        </div>
        <div class="xp-bar-bg">
          <div 
            class="xp-bar-fill" 
            :style="{ width: xpProgressPercent + '%' }"
          ></div>
        </div>
      </div>

      <FoodInventory
        :inventory="inventory"
        :max-capacity="maxCapacity"
        :selected-type="selectedFood"
        @select="selectedFood = $event"
      />

      <div v-if="selectedFood && inventory[selectedFood] > 0" class="selected-info mt-4">
        <div class="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
          <div>
            <p class="font-semibold text-gray-900">
              {{ getFoodName(selectedFood) }}
            </p>
            <p class="text-sm text-gray-600">
              +{{ getFoodXP(selectedFood) }} XP
              <span v-if="getFoodBonus(selectedFood)" class="ml-2">
                +{{ getFoodBonus(selectedFood) }} stats
              </span>
            </p>
          </div>
          <div class="text-2xl">
            {{ getFoodEmoji(selectedFood) }}
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <AppButton variant="outline" size="lg" @click="close">
        Cancel
      </AppButton>
      <AppButton 
        variant="primary" 
        size="lg"
        :disabled="!selectedFood || inventory[selectedFood] <= 0"
        :loading="isFeeding"
        @click="feedPet"
      >
        <span class="flex items-center gap-2">
          Feed {{ pet?.name }}
        </span>
      </AppButton>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePetStore } from '~/stores/pet'
import { FOOD_TYPES, getXPForNextLevel } from '~/types/pet'
import type { FoodType } from '~/types/pet'
import Modal from './Modal.vue'
import PetDisplay from './PetDisplay.vue'
import FoodInventory from './FoodInventory.vue'
import AppButton from './AppButton.vue'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'fed', result: { leveled: boolean; evolved: boolean }): void
}>()

const petStore = usePetStore()

const selectedFood = ref<FoodType | null>(null)
const isAnimating = ref(false)
const isFeeding = ref(false)

const pet = computed(() => petStore.pet)
const inventory = computed(() => petStore.foodInventory)
const maxCapacity = computed(() => petStore.maxFoodCapacity)

const xpRequired = computed(() => {
  return getXPForNextLevel(pet.value?.level ?? 1)
})

const xpProgressPercent = computed(() => {
  if (!pet.value) return 0
  return Math.round((pet.value.experience / xpRequired.value) * 100)
})

const close = () => {
  emit('update:modelValue', false)
}

const getFoodName = (type: FoodType) => FOOD_TYPES[type].name
const getFoodXP = (type: FoodType) => FOOD_TYPES[type].xpValue
const getFoodBonus = (type: FoodType) => {
  const bonus = FOOD_TYPES[type].statBonus
  if (!bonus) return null
  return Object.values(bonus).reduce((a, b) => a + b, 0)
}
const getFoodEmoji = (type: FoodType) => {
  if (type === 'basic') return '🍖'
  if (type === 'premium') return '🐟'
  return '🐟✨'
}

const feedPet = async () => {
  if (!selectedFood.value || petStore.foodInventory[selectedFood.value] <= 0) return

  isFeeding.value = true
  isAnimating.value = true

  await new Promise(resolve => setTimeout(resolve, 500))

  const result = petStore.feedPet(selectedFood.value)

  await new Promise(resolve => setTimeout(resolve, 1000))

  isAnimating.value = false
  isFeeding.value = false

  emit('fed', result || { leveled: false, evolved: false })

  close()
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    selectedFood.value = null
  }
})
</script>

<style scoped>
.feed-pet-content {
  @apply space-y-4;
}

.pet-preview {
  @apply flex justify-center;
}

.xp-progress {
  @apply space-y-2;
}

.xp-bar-bg {
  @apply w-full h-3 bg-gray-200 rounded-full overflow-hidden;
}

.xp-bar-fill {
  @apply h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500;
}

.selected-info {
  @apply animate-fade-in;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
