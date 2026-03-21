<template>
  <div 
    class="exam-timer"
    :class="timerClasses"
    role="timer"
    :aria-label="`Time remaining: ${timeRemaining} seconds`"
  >
    <div class="timer-icon">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <div class="timer-text">
      <span class="timer-value">{{ formatTime(timeRemaining) }}</span>
      <span class="timer-label">{{ label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  timeRemaining: number
  label?: string
  warningThreshold?: number
  dangerThreshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Time Remaining',
  warningThreshold: 10,
  dangerThreshold: 5
})

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins > 0) {
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  return `${secs}s`
}

const timerClasses = computed(() => {
  if (props.timeRemaining <= props.dangerThreshold) {
    return 'timer-danger'
  }
  if (props.timeRemaining <= props.warningThreshold) {
    return 'timer-warning'
  }
  return 'timer-normal'
})
</script>

<style scoped>
.exam-timer {
  @apply inline-flex items-center gap-3 px-5 py-3 rounded-2xl font-medium transition-all duration-300;
}

.timer-normal {
  @apply bg-primary-100 text-primary-700 border-2 border-primary-300;
}

.timer-warning {
  @apply bg-warning-100 text-warning-700 border-2 border-warning-300 animate-pulse;
}

.timer-danger {
  @apply bg-danger-100 text-danger-700 border-2 border-danger-300 animate-pulse;
}

.timer-icon {
  @apply flex items-center justify-center;
}

.timer-text {
  @apply flex flex-col;
}

.timer-value {
  @apply text-2xl font-bold leading-none;
}

.timer-label {
  @apply text-xs font-medium opacity-80 mt-0.5;
}
</style>
