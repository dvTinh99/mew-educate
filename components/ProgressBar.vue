<template>
  <div class="progress-container">
    <div class="flex justify-between items-center mb-2">
      <span class="text-lg font-medium text-gray-700">{{ label }}</span>
      <span class="text-lg font-semibold text-primary-600">{{ percentage }}%</span>
    </div>
    <div 
      class="progress-bar-bg"
      role="progressbar"
      :aria-valuenow="percentage"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div 
        class="progress-bar-fill"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  percentage: number
  label?: string
}

withDefaults(defineProps<Props>(), {
  label: 'Progress'
})
</script>

<style scoped>
.progress-bar-bg {
  @apply w-full h-4 bg-gray-200 rounded-full overflow-hidden;
}

.progress-bar-fill {
  @apply h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out;
}
</style>
