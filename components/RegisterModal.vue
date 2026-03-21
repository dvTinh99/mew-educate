<template>
  <Modal
    :model-value="modelValue"
    :title="$t('auth.register.title')"
    size="sm"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="close"
  >
    <div class="register-form">
      <p class="subtitle mb-6">{{ $t('auth.register.subtitle') }}</p>
      
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('auth.register.username') }}
          </label>
          <input
            v-model="username"
            type="text"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
            :class="{ 'border-danger-500': errors.username }"
            @input="errors.username = ''"
          />
          <p v-if="errors.username" class="text-danger-500 text-sm mt-1">{{ errors.username }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('auth.register.email') }}
          </label>
          <input
            v-model="email"
            type="email"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
            :class="{ 'border-danger-500': errors.email }"
            @input="errors.email = ''"
          />
          <p v-if="errors.email" class="text-danger-500 text-sm mt-1">{{ errors.email }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('auth.register.password') }}
          </label>
          <input
            v-model="password"
            type="password"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
            :class="{ 'border-danger-500': errors.password }"
            @input="errors.password = ''"
          />
          <p v-if="errors.password" class="text-danger-500 text-sm mt-1">{{ errors.password }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('auth.register.confirmPassword') }}
          </label>
          <input
            v-model="confirmPassword"
            type="password"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
            :class="{ 'border-danger-500': errors.confirmPassword }"
            @input="errors.confirmPassword = ''"
          />
          <p v-if="errors.confirmPassword" class="text-danger-500 text-sm mt-1">{{ errors.confirmPassword }}</p>
        </div>
        
        <button
          type="submit"
          class="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-lg rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {{ $t('auth.register.submit') }}
        </button>
      </form>
      
      <div class="mt-6 text-center">
        <p class="text-gray-600">
          {{ $t('auth.register.hasAccount') }}
          <button 
            type="button"
            class="text-primary-600 font-semibold hover:underline"
            @click="switchToLogin"
          >
            {{ $t('auth.register.loginLink') }}
          </button>
        </p>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
  (e: 'switchToLogin'): void
}>()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errors = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const close = () => {
  username.value = ''
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  errors.value = { username: '', email: '', password: '', confirmPassword: '' }
  emit('update:modelValue', false)
}

const switchToLogin = () => {
  close()
  emit('switchToLogin')
}

const validate = () => {
  let isValid = true
  
  if (!username.value) {
    errors.value.username = 'Username is required'
    isValid = false
  }
  
  if (!email.value) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Please enter a valid email'
    isValid = false
  }
  
  if (!password.value) {
    errors.value.password = 'Password is required'
    isValid = false
  } else if (password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    isValid = false
  }
  
  if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Passwords do not match'
    isValid = false
  }
  
  return isValid
}

const handleRegister = () => {
  if (!validate()) return
  
  emit('success')
  close()
}
</script>

<style scoped>
.subtitle {
  @apply text-gray-600 text-center;
}
</style>
