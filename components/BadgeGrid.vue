<template>
  <div class="badge-grid">
    <div 
      v-for="badge in allBadges" 
      :key="badge.id"
      class="badge-item"
      :class="{ 'badge-locked': !isUnlocked(badge.id), 'badge-unlocked': isUnlocked(badge.id) }"
    >
      <div class="badge-icon">
        <component :is="getIcon(badge.icon)" class="w-8 h-8" />
      </div>
      <div class="badge-info">
        <span class="badge-name">{{ badge.name }}</span>
        <span class="badge-desc">{{ badge.description }}</span>
        <span class="badge-xp">+{{ badge.xpReward }} XP</span>
      </div>
      <div v-if="isUnlocked(badge.id)" class="badge-check">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
      </div>
      <div v-else class="badge-lock">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useDeckStore } from '~/stores/deck'
import { ALL_BADGES, type Badge } from '~/types/gamification'

const deckStore = useDeckStore()

const allBadges = ALL_BADGES

const isUnlocked = (badgeId: string) => {
  return deckStore.userStats.unlockedBadges.includes(badgeId)
}

const getIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    rocket: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { d: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z' })
    ]),
    fire: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z', 'clip-rule': 'evenodd' })
    ]),
    shield: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z', 'clip-rule': 'evenodd' })
    ]),
    crown: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { d: 'M5 4l3 6 5-4 5 4 3-6H5zm0 12l3-8 3 5 3-5 3 8H5z' })
    ]),
    star: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z', 'clip-rule': 'evenodd' })
    ]),
    bolt: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z', 'clip-rule': 'evenodd' })
    ]),
    cards: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { d: 'M3 5h14v2H3V5zm0 4h14v2H3V9zm0 4h14v2H3v-2zm2-8h10v10H5V5z' })
    ]),
    folder: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z', 'clip-rule': 'evenodd' })
    ]),
    chinese: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { d: 'M10 2a8 8 0 100 16 8 8 0 000-16zM6.5 8a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm4 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm-2 4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z' })
    ]),
    english: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M7 2a1 1 0 011 1v1h3V3a1 1 0 112 0v1h3a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2H1a1 1 0 110-2h1V9H1a1 1 0 010-2h1V5a2 2 0 012-2zm7 5h3a1 1 0 110 2H9v2h3a1 1 0 110 2H9v2h3a1 1 0 110 2H9a1 1 0 01-1-1v-2a1 1 0 00-1-1H7a1 1 0 00-1 1v2a1 1 0 001 1h1v1a1 1 0 11-2 0v-1H4a1 1 0 110-2h1V9H4a1 1 0 110-2h3a1 1 0 001-1V3a1 1 0 00-1-1H7z', 'clip-rule': 'evenodd' })
    ]),
    hundred: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z', 'clip-rule': 'evenodd' })
    ]),
    medal: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z', 'clip-rule': 'evenodd' }),
      h('path', { d: 'M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z' })
    ]),
    trophy: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { d: 'M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z' })
    ]),
    moon: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z', 'clip-rule': 'evenodd' })
    ]),
    sun: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z', 'clip-rule': 'evenodd' })
    ])
  }
  return icons[iconName] || icons.star
}
</script>

<style scoped>
.badge-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.badge-item {
  @apply flex items-center gap-4 p-4 rounded-xl transition-all;
}

.badge-locked {
  @apply bg-gray-50 opacity-60;
}

.badge-unlocked {
  @apply bg-gradient-to-r from-primary-50 to-primary-100 border-2 border-primary-200;
}

.badge-icon {
  @apply w-14 h-14 rounded-xl flex items-center justify-center bg-white shadow;
}

.badge-locked .badge-icon {
  @apply bg-gray-200;
}

.badge-unlocked .badge-icon {
  @apply text-primary-600;
}

.badge-info {
  @apply flex-1;
}

.badge-name {
  @apply font-bold text-gray-900 block;
}

.badge-desc {
  @apply text-sm text-gray-600 block;
}

.badge-xp {
  @apply text-xs text-primary-600 font-medium mt-1 block;
}

.badge-check {
  @apply text-success-500;
}

.badge-lock {
  @apply text-gray-400;
}
</style>
