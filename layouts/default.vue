<template>
  <div class="app-layout min-h-screen flex flex-col">
    <header class="app-header bg-white border-b-2 border-gray-200 sticky top-0 z-40">
      <div class="container mx-auto px-4 py-3">
        <nav class="flex items-center justify-between">
          <NuxtLink 
            to="/" 
            class="flex items-center gap-3 text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span class="hidden sm:inline">FlashLearn</span>
          </NuxtLink>

          <div class="flex items-center gap-4">
            <div class="hidden lg:flex items-center gap-4">
              <XpBar />
              <StreakBadge />
            </div>
            <NuxtLink 
              to="/stats" 
              class="text-lg font-medium text-gray-600 hover:text-primary-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Profile
            </NuxtLink>
            <NuxtLink 
              to="/" 
              class="text-lg font-medium text-gray-600 hover:text-primary-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              My Decks
            </NuxtLink>
          </div>
        </nav>
      </div>
    </header>

    <main class="app-main flex-1">
      <slot />
    </main>

    <footer class="app-footer bg-white border-t-2 border-gray-200 py-6 mt-auto">
      <div class="container mx-auto px-4 text-center">
        <p class="text-gray-500 text-base">
          Built with care for effective learning
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useDeckStore } from '~/stores/deck'

const deckStore = useDeckStore()

onMounted(async () => {
  deckStore.loadFromStorage()
  if (deckStore.decks.length === 0) {
    await deckStore.loadPrebuiltDecks()
  }
  deckStore.generateDailyChallenges()
})
</script>

<style scoped>
.app-layout {
  @apply bg-gray-50;
}
</style>
