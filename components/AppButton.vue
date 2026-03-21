<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    class="btn"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="inline-block animate-spin mr-2">
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false
})

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const buttonClasses = computed(() => {
  const classes = [props.variant ? `btn-${props.variant}` : '']
  
  if (props.size === 'sm') {
    classes.push('px-4 py-2 text-base min-h-10')
  } else if (props.size === 'lg') {
    classes.push('px-8 py-5 text-xl min-h-16')
  }
  
  if (props.fullWidth) {
    classes.push('w-full')
  }
  
  return classes.join(' ')
})
</script>

<style scoped>
.btn {
  @apply inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
  min-height: 48px;
}

.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 active:scale-95;
}

.btn-success {
  @apply bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 active:scale-95;
}

.btn-warning {
  @apply bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500 active:scale-95;
}

.btn-danger {
  @apply bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500 active:scale-95;
}

.btn-outline {
  @apply bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500 active:scale-95;
}
</style>
