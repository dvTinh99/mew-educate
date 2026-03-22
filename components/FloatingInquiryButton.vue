<template>
  <div class="floating-container">
    <button
      class="floating-btn"
      :title="$t('inquiry.title')"
      @click="$emit('click')"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'click'): void
}>()
</script>

<style scoped>
.floating-container {
  @apply fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40;
}

.floating-btn {
  @apply w-14 h-14 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center;
  @apply focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2;
}

.floating-btn:hover {
  @apply from-primary-600 to-primary-700;
}

.floating-btn:active {
  @apply transform scale-95;
}
</style>
