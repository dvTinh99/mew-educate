<template>
  <div class="app-layout min-h-screen flex flex-col">
    <header class="app-header bg-white border-b-2 border-gray-200 sticky top-0 z-40">
      <div class="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <nav class="flex items-center justify-between">
          <NuxtLink 
            to="/" 
            class="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg sm:rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span class="hidden sm:inline">FlashLearn</span>
          </NuxtLink>

          <div class="flex items-center gap-1 sm:gap-2 lg:gap-4">
            <LanguageSwitcher />
            
            <div v-if="authStore.isLoggedIn" class="hidden xl:flex items-center gap-3">
              <XpBar />
              <StreakBadge />
            </div>
            
            <template v-if="authStore.isLoggedIn">
              <NuxtLink 
                to="/leaderboard" 
                class="p-2 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors hidden md:block"
                :title="'Leaderboard'"
              >
                <span class="text-lg">🏆</span>
              </NuxtLink>
              
              <NuxtLink 
                to="/pet" 
                class="p-2 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors hidden md:block"
                :title="'My Pet'"
              >
                <span class="text-lg">🐱</span>
              </NuxtLink>
              
              <NuxtLink 
                to="/stats" 
                class="p-2 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors hidden md:block"
                :title="'Profile'"
              >
                <span class="hidden sm:inline text-lg">👤</span>
                <svg class="sm:hidden w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </NuxtLink>
              
              <NuxtLink 
                to="/profile" 
                class="p-2 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors hidden md:block"
                :title="'My Decks'"
              >
                <span class="hidden sm:inline text-lg">📚</span>
                <svg class="sm:hidden w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </NuxtLink>
              
              <NuxtLink 
                to="/settings" 
                class="p-2 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors hidden lg:block"
                :title="'Settings'"
              >
                <span class="text-lg">⚙️</span>
              </NuxtLink>
              
              <button 
                class="p-2 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors hidden lg:block"
                :title="'Logout'"
                @click="handleLogout"
              >
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </template>
            
            <template v-else>
              <button 
                class="px-4 py-2 sm:px-6 sm:py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-md sm:shadow-lg hover:shadow-xl text-sm sm:text-base"
                @click="router.push('/?login=true')"
              >
                Login
              </button>
            </template>
          </div>
        </nav>
      </div>
    </header>

    <main class="app-main flex-1 pb-16 md:pb-0">
      <slot />
    </main>

    <MobileNavbar />
    <FloatingInquiryButton @click="showInquiryModal = true" />

    <InquiryModal v-model="showInquiryModal" />

    <footer class="app-footer bg-white border-t-2 border-gray-200 py-4 sm:py-6 mt-auto hidden md:block">
      <div class="container mx-auto px-4 text-center">
        <p class="text-gray-500 text-sm sm:text-base">
          Built with care for effective learning
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useDeckStore } from '~/stores/deck'
import { usePetStore } from '~/stores/pet'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'
import MobileNavbar from '~/components/MobileNavbar.vue'
import FloatingInquiryButton from '~/components/FloatingInquiryButton.vue'
import InquiryModal from '~/components/InquiryModal.vue'

const deckStore = useDeckStore()
const petStore = usePetStore()
const authStore = useAuthStore()
const router = useRouter()
const showInquiryModal = ref(false)

onMounted(async () => {
  deckStore.loadFromStorage()
  petStore.loadFromStorage()
  authStore.loadFromStorage()
  if (deckStore.decks.length === 0) {
    await deckStore.loadPrebuiltDecks()
  }
  deckStore.generateDailyChallenges()
})

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

</script>

<style scoped>
.app-layout {
  @apply bg-gray-50;
}
</style>
