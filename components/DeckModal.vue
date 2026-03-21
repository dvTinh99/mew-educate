<template>
  <Modal
    v-model="isOpen"
    :title="isEditing ? 'Edit Deck' : 'Create New Deck'"
    size="md"
    @close="resetForm"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label for="deck-name" class="block text-lg font-semibold text-gray-700 mb-3">
          Deck Name <span class="text-danger-500">*</span>
        </label>
        <input
          id="deck-name"
          v-model="form.name"
          type="text"
          class="input"
          placeholder="e.g., Spanish Vocabulary"
          required
          maxlength="50"
        />
      </div>

      <div>
        <label for="deck-description" class="block text-lg font-semibold text-gray-700 mb-3">
          Description <span class="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="deck-description"
          v-model="form.description"
          class="input min-h-24 resize-none"
          placeholder="Brief description of your deck..."
          maxlength="200"
          rows="2"
        ></textarea>
        <p class="mt-2 text-sm text-gray-500">
          {{ form.description?.length || 0 }}/200 characters
        </p>
      </div>
    </form>

    <template #footer>
      <AppButton 
        variant="outline" 
        size="lg"
        type="button"
        @click="close"
      >
        Cancel
      </AppButton>
      <AppButton 
        variant="primary" 
        size="lg"
        :loading="isSubmitting"
        :disabled="!isFormValid"
        @click="handleSubmit"
      >
        {{ isEditing ? 'Save Changes' : 'Create Deck' }}
      </AppButton>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Deck } from '~/stores/deck'

interface Props {
  modelValue: boolean
  deck?: Deck | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', data: { name: string; description?: string }): void
}>()

const form = ref({
  name: '',
  description: ''
})

const isSubmitting = ref(false)

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isEditing = computed(() => !!props.deck)

const isFormValid = computed(() => {
  return form.value.name.trim().length > 0
})

watch(() => props.modelValue, (isOpen) => {
  if (isOpen && props.deck) {
    form.value = {
      name: props.deck.name,
      description: props.deck.description || ''
    }
  } else if (isOpen) {
    resetForm()
  }
})

const handleSubmit = () => {
  if (!isFormValid.value) return
  
  isSubmitting.value = true
  
  emit('save', {
    name: form.value.name.trim(),
    description: form.value.description.trim() || undefined
  })
  
  setTimeout(() => {
    isSubmitting.value = false
    close()
  }, 300)
}

const close = () => {
  isOpen.value = false
}

const resetForm = () => {
  form.value = {
    name: '',
    description: ''
  }
}
</script>

<style scoped>
textarea.input,
input.input {
  @apply text-lg;
}
</style>
