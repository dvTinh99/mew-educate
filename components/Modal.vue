<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="modelValue"
        class="modal-overlay"
        @click.self="closeOnBackdrop && close()"
        @keydown.escape="close"
      >
        <div 
          class="modal-content"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
        >
          <div class="modal-header">
            <h2 :id="titleId" class="modal-title">{{ title }}</h2>
            <button 
              v-if="showCloseButton"
              type="button"
              class="modal-close-btn"
              aria-label="Close modal"
              @click="close"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <slot />
          </div>
          
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

interface Props {
  modelValue: boolean
  title: string
  showCloseButton?: boolean
  closeOnBackdrop?: boolean
  size?: 'sm' | 'md' | 'lg' | 'full'
}

const props = withDefaults(defineProps<Props>(), {
  showCloseButton: true,
  closeOnBackdrop: true,
  size: 'md'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const titleId = computed(() => `modal-title-${Math.random().toString(36).substr(2, 9)}`)

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm;
}

.modal-content {
  @apply bg-white rounded-2xl shadow-2xl w-full overflow-hidden;
  max-height: calc(100vh - 2rem);
  animation: modalSlideIn 0.3s ease-out;
}

.modal-content.modal-sm {
  @apply max-w-md;
}

.modal-content.modal-md {
  @apply max-w-2xl;
}

.modal-content.modal-lg {
  @apply max-w-4xl;
}

.modal-content.modal-full {
  @apply max-w-full h-full rounded-none;
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b-2 border-gray-200;
}

.modal-title {
  @apply text-2xl font-bold text-gray-900;
}

.modal-close-btn {
  @apply p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500;
}

.modal-body {
  @apply p-6 overflow-y-auto;
  max-height: calc(100vh - 16rem);
}

.modal-footer {
  @apply flex items-center justify-end gap-4 p-6 border-t-2 border-gray-200 bg-gray-50;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content {
  animation: modalSlideIn 0.3s ease-out;
}

.modal-leave-active .modal-content {
  animation: modalSlideOut 0.2s ease-in;
}

@keyframes modalSlideIn {
  from {
    transform: translateY(20px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes modalSlideOut {
  from {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateY(20px) scale(0.95);
    opacity: 0;
  }
}
</style>
