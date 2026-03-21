<template>
  <Modal
    v-model="isOpen"
    :title="isEditing ? 'Edit Card' : 'Add New Card'"
    size="lg"
    @close="resetForm"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label for="card-front" class="block text-lg font-semibold text-gray-700 mb-3">
          Front (Question) <span class="text-danger-500">*</span>
        </label>
        <textarea
          id="card-front"
          v-model="form.front"
          class="input min-h-32 resize-none"
          placeholder="Enter the question or term..."
          required
          rows="3"
        ></textarea>
      </div>

      <div>
        <label for="card-back" class="block text-lg font-semibold text-gray-700 mb-3">
          Back (Answer) <span class="text-danger-500">*</span>
        </label>
        <textarea
          id="card-back"
          v-model="form.back"
          class="input min-h-32 resize-none"
          placeholder="Enter the answer or definition..."
          required
          rows="3"
        ></textarea>
      </div>

      <div>
        <label for="card-hint" class="block text-lg font-semibold text-gray-700 mb-3">
          Hint <span class="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          id="card-hint"
          v-model="form.hint"
          type="text"
          class="input"
          placeholder="Enter a helpful hint..."
          maxlength="100"
        />
        <p class="mt-2 text-sm text-gray-500">
          {{ form.hint?.length || 0 }}/100 characters
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
        {{ isEditing ? 'Save Changes' : 'Add Card' }}
      </AppButton>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Card } from '~/stores/deck'

interface Props {
  modelValue: boolean
  card?: Card | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', data: { front: string; back: string; hint?: string }): void
}>()

const form = ref({
  front: '',
  back: '',
  hint: ''
})

const isSubmitting = ref(false)

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isEditing = computed(() => !!props.card)

const isFormValid = computed(() => {
  return form.value.front.trim().length > 0 && form.value.back.trim().length > 0
})

watch(() => props.modelValue, (isOpen) => {
  if (isOpen && props.card) {
    form.value = {
      front: props.card.front,
      back: props.card.back,
      hint: props.card.hint || ''
    }
  } else if (isOpen) {
    resetForm()
  }
})

const handleSubmit = () => {
  if (!isFormValid.value) return
  
  isSubmitting.value = true
  
  emit('save', {
    front: form.value.front.trim(),
    back: form.value.back.trim(),
    hint: form.value.hint.trim() || undefined
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
    front: '',
    back: '',
    hint: ''
  }
}
</script>

<style scoped>
textarea.input,
input.input {
  @apply text-lg;
}
</style>
