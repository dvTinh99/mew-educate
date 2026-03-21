<template>
  <nav 
    v-if="authStore.isLoggedIn"
    class="mobile-nav md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 z-50 safe-area-pb"
  >
    <div class="flex items-center justify-around py-2 px-1">
      <NuxtLink 
        v-for="item in navItems" 
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center py-1 px-3 rounded-lg transition-all min-w-[60px]"
        :class="[
          isActive(item.path) 
            ? 'text-primary-600 bg-primary-50' 
            : 'text-gray-500 hover:text-gray-700'
        ]"
      >
        <div class="relative">
          <span class="text-2xl">{{ item.icon }}</span>
          <span 
            v-if="item.badge && item.badge > 0" 
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
          >
            {{ item.badge > 9 ? '9+' : item.badge }}
          </span>
        </div>
        <span class="text-[10px] mt-1 font-medium">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { usePetStore } from '~/stores/pet'
import { useDeckStore } from '~/stores/deck'
import { useRoute } from 'vue-router'

const authStore = useAuthStore()
const petStore = usePetStore()
const route = useRoute()

const navItems = computed(() => [
  {
    path: '/profile',
    icon: '📚',
    label: 'Decks'
  },
  {
    path: '/pet',
    icon: petStore.pet ? '🐱' : '🐱',
    label: 'Pet',
    badge: petStore.pet ? 0 : 0
  },
  {
    path: '/stats',
    icon: '📊',
    label: 'Stats'
  },
  {
    path: '/leaderboard',
    icon: '🏆',
    label: 'Rank'
  }
])

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<style scoped>
.mobile-nav {
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
}

.safe-area-pb {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

@media (max-width: 768px) {
  .app-main {
    padding-bottom: 70px;
  }
}
</style>
