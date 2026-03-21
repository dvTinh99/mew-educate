<template>
  <div class="exam-card-wrapper">
    <div class="card exam-card">
      <span class="text-sm font-medium text-primary-600 uppercase tracking-wide mb-4">
        Question {{ cardIndex + 1 }}
      </span>
      <p class="text-3xl md:text-4xl font-bold text-center text-gray-900 leading-relaxed mb-8">
        {{ card.front }}
      </p>
    </div>

    <div v-if="isSubmitted" class="answer-submitted mt-6">
      <div class="card p-6 bg-gray-50 border-2 border-gray-200 text-center">
        <div class="flex items-center justify-center gap-3">
          <svg class="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="text-xl font-semibold text-gray-700">Answer submitted!</span>
        </div>
        <p class="text-lg text-gray-500 mt-2">Moving to next question...</p>
      </div>
    </div>

    <div v-else-if="questionType === 'multiple-choice'" class="answer-mc mt-6">
      <p class="text-lg font-medium text-gray-700 mb-4 text-center">
        Select the correct answer:
      </p>
      <div class="mc-options space-y-3">
        <button
          v-for="option in options"
          :key="option.value"
          type="button"
          class="mc-option w-full p-4 rounded-xl border-2 border-gray-200 text-left transition-all hover:border-primary-400 hover:bg-primary-50 focus:outline-none focus:ring-4 focus:ring-primary-200"
          :class="{ 'border-primary-500 bg-primary-50': selectedOption === option.value }"
          @click="selectOption(option.value)"
        >
          <span class="mc-option-label">{{ option.label }}.</span>
          <span class="mc-option-value">{{ option.value }}</span>
        </button>
      </div>
      <p v-if="showError" class="text-danger-600 text-base mt-3 text-center">
        Please select an answer before submitting.
      </p>
    </div>

    <div v-else class="answer-input mt-6">
      <label for="exam-answer" class="block text-lg font-medium text-gray-700 mb-3">
        Type your answer:
      </label>
      <input
        id="exam-answer"
        ref="inputRef"
        v-model="userAnswerValue"
        type="text"
        class="input text-xl"
        :class="{ 'border-danger-500': showError }"
        placeholder="Type your answer here..."
        @keydown.enter="handleSubmit"
      />
      <p v-if="showError" class="text-danger-600 text-base mt-2">
        Please enter your answer before submitting.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { Card } from '~/stores/deck'
import type { ExamQuestionType, MultipleChoiceOption } from '~/types/exam'

interface Props {
  card: Card
  cardIndex: number
  questionType?: ExamQuestionType
  options?: MultipleChoiceOption[]
  isSubmitted?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  questionType: 'input',
  options: () => [],
  isSubmitted: false
})

const emit = defineEmits<{
  (e: 'submit', answer: string): void
}>()

const userAnswerValue = ref('')
const selectedOption = ref('')
const showError = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

watch(() => props.isSubmitted, async (submitted) => {
  if (!submitted) {
    userAnswerValue.value = ''
    selectedOption.value = ''
    showError.value = false
    await nextTick()
    if (props.questionType === 'input') {
      inputRef.value?.focus()
    }
  }
})

watch(selectedOption, () => {
  if (selectedOption.value) {
    showError.value = false
  }
})

watch(userAnswerValue, () => {
  if (userAnswerValue.value.trim()) {
    showError.value = false
  }
})

const selectOption = (value: string) => {
  selectedOption.value = value
}

const handleSubmit = () => {
  if (props.questionType === 'multiple-choice') {
    if (!selectedOption.value) {
      showError.value = true
      return
    }
    emit('submit', selectedOption.value)
  } else {
    if (!userAnswerValue.value.trim()) {
      showError.value = true
      inputRef.value?.focus()
      return
    }
    emit('submit', userAnswerValue.value.trim())
  }
}

defineExpose({
  submit: handleSubmit
})
</script>

<style scoped>
.exam-card {
  @apply bg-white rounded-2xl shadow-lg p-8 min-h-64 flex flex-col items-center justify-center;
}

.answer-input input {
  @apply w-full px-4 py-4 text-xl border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-200 transition-all;
}

.mc-option {
  @apply flex items-center gap-3;
}

.mc-option-label {
  @apply w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center flex-shrink-0;
}

.mc-option-value {
  @apply text-xl text-gray-900;
}
</style>
