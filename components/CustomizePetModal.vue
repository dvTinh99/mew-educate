<template>
  <Modal
    :model-value="modelValue"
    title="Customize Your Pet"
    size="md"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="close"
  >
    <div class="customization-panel space-y-6">
      <!-- Color Selection -->
      <div>
        <h3 class="text-lg font-semibold mb-3">Choose Your Color</h3>
        <div class="color-grid grid grid-cols-6 gap-3">
          <button
            v-for="color in petColors"
            :key="color.value"
            class="color-btn w-12 h-12 rounded-full border-4 transition-all hover:scale-110"
            :class="selectedColor === color.value ? 'border-primary-500 scale-110' : 'border-transparent'"
            :style="{ backgroundColor: color.value, boxShadow: `0 4px 10px ${color.value}50` }"
            :title="color.name"
            @click="selectedColor = color.value"
          >
            <span v-if="selectedColor === color.value" class="text-white drop-shadow-lg">✓</span>
          </button>
        </div>
      </div>

      <!-- Accent Color -->
      <div>
        <h3 class="text-lg font-semibold mb-3">Accent Color</h3>
        <div class="flex gap-2">
          <button
            v-for="accent in accentColors"
            :key="accent"
            class="accent-btn w-8 h-8 rounded-full border-2 transition-all hover:scale-110"
            :class="selectedAccent === accent ? 'border-gray-800 scale-110' : 'border-transparent'"
            :style="{ backgroundColor: accent }"
            @click="selectedAccent = accent"
          />
        </div>
      </div>

      <!-- Accessories -->
      <div>
        <h3 class="text-lg font-semibold mb-3">Accessories</h3>
        
        <!-- Hats -->
        <div class="mb-4">
          <p class="text-sm text-gray-600 mb-2">Hats</p>
          <div class="flex gap-2">
            <button
              class="px-4 py-2 rounded-lg border-2 transition-all"
              :class="selectedAccessories.hat ? 'border-primary-500 bg-primary-50' : 'border-gray-200'"
              @click="toggleAccessory('hat')"
            >
              🎩
            </button>
            <button
              v-if="selectedAccessories.hat"
              class="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center"
              contenteditable
              @input="updateAccessoryColor('hat', ($event.target as HTMLElement).style.backgroundColor || '#FF0000')"
            >
              <input 
                type="color" 
                class="w-full h-full opacity-0 cursor-pointer"
                :value="selectedAccessories.hat"
                @input="updateAccessoryColor('hat', ($event.target as HTMLInputElement).value)"
              />
            </button>
          </div>
        </div>

        <!-- Collars -->
        <div class="mb-4">
          <p class="text-sm text-gray-600 mb-2">Collars</p>
          <div class="flex gap-2">
            <button
              class="px-4 py-2 rounded-lg border-2 transition-all"
              :class="selectedAccessories.collar ? 'border-primary-500 bg-primary-50' : 'border-gray-200'"
              @click="toggleAccessory('collar')"
            >
              🎀
            </button>
            <button
              v-if="selectedAccessories.collar"
              class="w-8 h-8 rounded-full border-2 border-gray-300 overflow-hidden"
            >
              <input 
                type="color" 
                class="w-full h-full cursor-pointer"
                :value="selectedAccessories.collar || '#FF0000'"
                @input="updateAccessoryColor('collar', ($event.target as HTMLInputElement).value)"
              />
            </button>
          </div>
        </div>

        <!-- Glasses -->
        <div class="mb-4">
          <p class="text-sm text-gray-600 mb-2">Glasses</p>
          <div class="flex gap-2">
            <button
              class="px-4 py-2 rounded-lg border-2 transition-all"
              :class="selectedAccessories.glasses ? 'border-primary-500 bg-primary-50' : 'border-gray-200'"
              @click="toggleAccessory('glasses')"
            >
              👓
            </button>
            <button
              v-if="selectedAccessories.glasses"
              class="w-8 h-8 rounded-full border-2 border-gray-300 overflow-hidden"
            >
              <input 
                type="color" 
                class="w-full h-full cursor-pointer"
                :value="selectedAccessories.glasses || '#000000'"
                @input="updateAccessoryColor('glasses', ($event.target as HTMLInputElement).value)"
              />
            </button>
          </div>
        </div>

        <!-- Bows -->
        <div class="mb-4">
          <p class="text-sm text-gray-600 mb-2">Bows</p>
          <div class="flex gap-2">
            <button
              class="px-4 py-2 rounded-lg border-2 transition-all"
              :class="selectedAccessories.bow ? 'border-primary-500 bg-primary-50' : 'border-gray-200'"
              @click="toggleAccessory('bow')"
            >
              🎀
            </button>
            <button
              v-if="selectedAccessories.bow"
              class="w-8 h-8 rounded-full border-2 border-gray-300 overflow-hidden"
            >
              <input 
                type="color" 
                class="w-full h-full cursor-pointer"
                :value="selectedAccessories.bow || '#FF69B4'"
                @input="updateAccessoryColor('bow', ($event.target as HTMLInputElement).value)"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div class="preview-section bg-gray-50 rounded-xl p-6 flex flex-col items-center">
        <p class="text-sm text-gray-500 mb-2">Preview</p>
        <PetDisplay
          :name="petName"
          :level="petLevel"
          :evolution-stage="evolutionStage"
          :mood="previewMood"
          :pet-color="selectedColor"
          :pet-accent="selectedAccent"
          :accessories="selectedAccessories"
          :show-mood-indicator="true"
          :show-level-badge="true"
          :show-name="true"
        />
        <div class="mt-4 flex gap-2">
          <button
            v-for="mood in ['normal', 'happy', 'sad', 'sleeping', 'hungry']"
            :key="mood"
            class="px-3 py-1 text-xs rounded-full border transition-all capitalize"
            :class="previewMood === mood ? 'bg-primary-100 border-primary-300' : 'border-gray-200'"
            @click="previewMood = mood as any"
          >
            {{ mood }}
          </button>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 pt-4">
        <button
          class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          @click="resetToDefault"
        >
          Reset
        </button>
        <button
          class="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg"
          @click="saveCustomization"
        >
          Save Changes
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue'
import PetDisplay from './PetDisplay.vue'

interface Props {
  modelValue: boolean
  petName?: string
  petLevel?: number
  evolutionStage?: 1 | 2 | 3
  initialColor?: string
  initialAccent?: string
  initialAccessories?: {
    hat?: string
    collar?: string
    bow?: string
    glasses?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  petName: 'Pet',
  petLevel: 1,
  evolutionStage: 1,
  initialColor: '#FF9F43',
  initialAccent: '#FFEAA7',
  initialAccessories: () => ({}),
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', customization: { color: string; accent: string; accessories: typeof props.initialAccessories }): void
  (e: 'close'): void
}>()

const petColors = [
  { name: 'Orange', value: '#FF9F43' },
  { name: 'Gray', value: '#A4B0BE' },
  { name: 'Black', value: '#2D3436' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Brown', value: '#A0522D' },
  { name: 'Cream', value: '#FFFDD0' },
  { name: 'Pink', value: '#FFB6C1' },
  { name: 'Purple', value: '#9B59B6' },
  { name: 'Blue', value: '#74B9FF' },
  { name: 'Green', value: '#55EFC4' },
  { name: 'Yellow', value: '#FDCB6E' },
  { name: 'Red', value: '#E17055' },
]

const accentColors = [
  '#FFEAA7',
  '#FF7675',
  '#74B9FF',
  '#55EFC4',
  '#FD79A8',
  '#A29BFE',
]

const selectedColor = ref(props.initialColor)
const selectedAccent = ref(props.initialAccent)
const selectedAccessories = ref<{
  hat?: string
  collar?: string
  bow?: string
  glasses?: string
}>({ ...props.initialAccessories })
const previewMood = ref<'normal' | 'happy' | 'sad' | 'sleeping' | 'hungry'>('normal')

const toggleAccessory = (type: 'hat' | 'collar' | 'bow' | 'glasses') => {
  if (selectedAccessories.value[type]) {
    selectedAccessories.value[type] = undefined
  } else {
    const defaultColors: Record<string, string> = {
      hat: '#FF0000',
      collar: '#FF69B4',
      bow: '#FF69B4',
      glasses: '#000000',
    }
    selectedAccessories.value[type] = defaultColors[type]
  }
}

const updateAccessoryColor = (type: 'hat' | 'collar' | 'bow' | 'glasses', color: string) => {
  selectedAccessories.value[type] = color
}

const resetToDefault = () => {
  selectedColor.value = '#FF9F43'
  selectedAccent.value = '#FFEAA7'
  selectedAccessories.value = {}
  previewMood.value = 'normal'
}

const saveCustomization = () => {
  emit('save', {
    color: selectedColor.value,
    accent: selectedAccent.value,
    accessories: { ...selectedAccessories.value },
  })
  close()
}

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<style scoped>
.color-btn {
  transition: all 0.2s ease;
}

.color-btn:hover {
  transform: scale(1.1);
}

.accent-btn {
  transition: all 0.2s ease;
}
</style>
