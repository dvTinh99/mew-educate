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
      
      <form @submit.prevent="handleLogin" class="space-y-4">
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
          class="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-lg rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {{ $t('auth.login.submit') }}
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

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
  (e: 'switchToRegister'): void
}>()

const email = ref('')
const password = ref('')
const errors = ref({
  email: '',
  password: ''
})

const close = () => {
  email.value = ''
  password.value = ''
  errors.value = { email: '', password: '' }
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

const handleLogin = () => {
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
