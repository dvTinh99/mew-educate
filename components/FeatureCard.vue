<template>
  <div class="feature-card">
    <div class="icon-wrapper">
      <span class="icon">{{ icon }}</span>
    </div>
    <h3 class="title">{{ title }}</h3>
    <p class="description">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  title: string
  description: string
}

defineProps<Props>()
</script>

<style scoped>
.feature-card {
  @apply bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1;
}

.icon-wrapper {
  @apply w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-4;
}

.icon {
  @apply text-3xl;
}

.title {
  @apply text-xl font-bold text-gray-900 mb-2;
}

.description {
  @apply text-gray-600 leading-relaxed;
}
</style>
