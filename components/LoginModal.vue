<template>
  <Modal
    :model-value="modelValue"
    :title="$t('auth.login.title')"
    size="sm"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="close"
  >
    <div class="login-form">
      <p class="subtitle mb-6">{{ $t('auth.login.subtitle') }}</p>
      
      <button
        type="button"
        class="google-btn mb-6"
        @click="handleGoogleLogin"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {{ $t('auth.login.google') }}
      </button>

      <div class="divider">
        <span>{{ $t('auth.login.or') }}</span>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div v-if="errors.general" class="p-3 bg-red-50 border border-red-200 rounded-xl">
          <p class="text-red-600 text-sm">{{ errors.general }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('auth.login.email') }}
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
            {{ $t('auth.login.password') }}
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
        
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-lg rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Loading...' : $t('auth.login.submit') }}
        </button>
      </form>
      
      <div class="mt-6 text-center">
        <p class="text-gray-600">
          {{ $t('auth.login.noAccount') }}
          <button 
            type="button"
            class="text-primary-600 font-semibold hover:underline"
            @click="switchToRegister"
          >
            {{ $t('auth.login.registerLink') }}
          </button>
        </p>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue'
import { useAuthStore } from '~/stores/auth'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
  (e: 'switchToRegister'): void
}>()

const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errors = ref({
  email: '',
  password: '',
  general: ''
})
const isLoading = ref(false)

const close = () => {
  email.value = ''
  password.value = ''
  errors.value = { email: '', password: '', general: '' }
  isLoading.value = false
  emit('update:modelValue', false)
}

const switchToRegister = () => {
  close()
  emit('switchToRegister')
}

const validate = () => {
  let isValid = true
  
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
  
  return isValid
}

const handleLogin = async () => {
  if (!validate()) return
  
  isLoading.value = true
  errors.value.general = ''
  
  const result = await authStore.login(email.value, password.value)
  
  isLoading.value = false
  
  if (result.success) {
    emit('success')
    close()
  } else {
    errors.value.general = result.error || 'Login failed'
  }
}

const handleGoogleLogin = () => {
  window.location.href = '/api/auth/google'
}
</script>

<style scoped>
.subtitle {
  @apply text-gray-600 text-center;
}

.google-btn {
  @apply w-full py-3 px-4 border-2 border-gray-200 rounded-xl font-medium text-gray-700 flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-300 transition-all;
}

.google-btn:hover {
  @apply bg-gray-50;
}

.divider {
  @apply flex items-center gap-4 my-6;
}

.divider::before,
.divider::after {
  @apply flex-1 h-px bg-gray-200 content-[''];
}

.divider span {
  @apply text-sm text-gray-500;
}
</style>
