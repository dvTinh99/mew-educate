<template>
  <Modal
    v-model="isOpen"
    :title="$t('inquiry.title')"
    size="md"
    @close="close"
  >
    <div class="inquiry-form">
      <div v-if="successMessage" class="success-message mb-4">
        <div class="p-4 bg-success-50 border border-success-200 rounded-xl">
          <p class="text-success-700 font-medium">{{ successMessage }}</p>
        </div>
      </div>

      <div v-if="errors.general" class="mb-4">
        <div class="p-3 bg-red-50 border border-red-200 rounded-xl">
          <p class="text-red-600 text-sm">{{ errors.general }}</p>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('inquiry.category') }}
          </label>
          <select
            v-model="form.category"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
            :class="{ 'border-danger-500': errors.category }"
          >
            <option value="">{{ $t('inquiry.selectCategory') }}</option>
            <option value="bug">{{ $t('inquiry.categories.bug') }}</option>
            <option value="feature">{{ $t('inquiry.categories.feature') }}</option>
            <option value="question">{{ $t('inquiry.categories.question') }}</option>
            <option value="other">{{ $t('inquiry.categories.other') }}</option>
          </select>
          <p v-if="errors.category" class="text-danger-500 text-sm mt-1">{{ errors.category }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('inquiry.subject') }}
          </label>
          <input
            v-model="form.subject"
            type="text"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
            :class="{ 'border-danger-500': errors.subject }"
            :placeholder="$t('inquiry.subjectPlaceholder')"
            maxlength="100"
          />
          <p v-if="errors.subject" class="text-danger-500 text-sm mt-1">{{ errors.subject }}</p>
          <p class="text-gray-400 text-xs mt-1">{{ form.subject.length }}/100</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('inquiry.message') }}
          </label>
          <textarea
            v-model="form.message"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors resize-none"
            :class="{ 'border-danger-500': errors.message }"
            :placeholder="$t('inquiry.messagePlaceholder')"
            rows="5"
            maxlength="1000"
          ></textarea>
          <p v-if="errors.message" class="text-danger-500 text-sm mt-1">{{ errors.message }}</p>
          <p class="text-gray-400 text-xs mt-1">{{ form.message.length }}/1000</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('inquiry.email') }}
          </label>
          <input
            v-model="form.email"
            type="email"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
            :class="{ 'border-danger-500': errors.email }"
            :placeholder="$t('inquiry.emailPlaceholder')"
          />
          <p v-if="errors.email" class="text-danger-500 text-sm mt-1">{{ errors.email }}</p>
        </div>
      </form>
    </div>

    <template #footer>
      <AppButton variant="outline" size="lg" @click="close">
        {{ $t('common.cancel') || 'Cancel' }}
      </AppButton>
      <AppButton 
        variant="primary" 
        size="lg"
        :loading="isSubmitting"
        @click="handleSubmit"
      >
        {{ $t('inquiry.submit') }}
      </AppButton>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'
import Modal from './Modal.vue'
import AppButton from './AppButton.vue'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const authStore = useAuthStore()

const form = ref({
  category: '',
  subject: '',
  message: '',
  email: ''
})

const errors = ref({
  category: '',
  subject: '',
  message: '',
  email: '',
  general: ''
})

const isSubmitting = ref(false)
const successMessage = ref('')

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    if (authStore.user?.email) {
      form.value.email = authStore.user.email
    }
    successMessage.value = ''
  } else {
    resetForm()
  }
})

const resetForm = () => {
  form.value = {
    category: '',
    subject: '',
    message: '',
    email: authStore.user?.email || ''
  }
  errors.value = {
    category: '',
    subject: '',
    message: '',
    email: '',
    general: ''
  }
  successMessage.value = ''
}

const close = () => {
  isOpen.value = false
}

const validate = () => {
  let isValid = true
  
  errors.value = {
    category: '',
    subject: '',
    message: '',
    email: '',
    general: ''
  }

  if (!form.value.category) {
    errors.value.category = 'Category is required'
    isValid = false
  }

  if (!form.value.subject) {
    errors.value.subject = 'Subject is required'
    isValid = false
  } else if (form.value.subject.length < 3) {
    errors.value.subject = 'Subject must be at least 3 characters'
    isValid = false
  }

  if (!form.value.message) {
    errors.value.message = 'Message is required'
    isValid = false
  } else if (form.value.message.length < 10) {
    errors.value.message = 'Message must be at least 10 characters'
    isValid = false
  }

  if (!form.value.email) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validate()) return

  isSubmitting.value = true
  errors.value.general = ''

  try {
    const response = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })

    if (response.ok) {
      successMessage.value = 'Inquiry sent successfully!'
      setTimeout(() => {
        close()
      }, 1500)
    } else {
      const data = await response.json()
      errors.value.general = data.message || 'Failed to send inquiry'
    }
  } catch (error) {
    errors.value.general = 'Failed to send inquiry. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
