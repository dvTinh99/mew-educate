<template>
  <div class="settings-page">
    <div class="container mx-auto px-4 py-6 md:py-8 max-w-2xl">
      <div class="mb-6 md:mb-8">
        <button 
          @click="router.back()"
          class="inline-flex items-center gap-2 text-base md:text-lg text-gray-600 hover:text-primary-600 mb-3 md:mb-4 transition-colors"
        >
          <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 md:mb-2">Settings</h1>
        <p class="text-base md:text-xl text-gray-600">Customize your experience</p>
      </div>

      <div class="space-y-4 md:space-y-6">
        <div class="card p-4 md:p-6">
          <h2 class="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <span class="text-xl md:text-2xl">🎮</span>
            Simulation Settings
          </h2>
          
          <div class="space-y-3 md:space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 md:p-4 bg-gray-50 rounded-xl">
              <div class="flex-1">
                <p class="font-semibold text-gray-900">Enable AI Pets</p>
                <p class="text-xs md:text-sm text-gray-600">Show simulated pets from other trainers in the leaderboard</p>
              </div>
              <button 
                class="relative w-12 h-7 sm:w-14 sm:h-8 rounded-full transition-colors duration-200 flex-shrink-0"
                :class="petStore.leaderboardSettings.simulationEnabled ? 'bg-primary-500' : 'bg-gray-300'"
                @click="toggleSimulation"
              >
                <span 
                  class="absolute top-0.5 sm:top-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full shadow-md transition-transform duration-200"
                  :class="petStore.leaderboardSettings.simulationEnabled ? 'translate-x-6 sm:translate-x-7' : 'translate-x-1'"
                ></span>
              </button>
            </div>

            <div v-if="petStore.leaderboardSettings.simulationEnabled" class="p-3 md:p-4 bg-gray-50 rounded-xl">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <p class="font-medium text-gray-900 text-sm md:text-base">Last Refreshed</p>
                  <p class="text-xs md:text-sm text-gray-600">
                    {{ lastRefreshedFormatted || 'Never' }}
                  </p>
                </div>
                <button 
                  class="px-3 py-2 md:px-4 md:py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors text-sm md:text-base w-fit"
                  @click="refreshLeaderboard"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
              <p class="text-xs text-gray-500">
                AI pets are regenerated each session. Connect to a backend for persistent leaderboard.
              </p>
            </div>

            <div v-else class="p-3 md:p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p class="text-sm text-blue-800">
                💡 AI pets are disabled. The leaderboard will only show your pet (if you have one).
              </p>
            </div>
          </div>
        </div>

        <div class="card p-4 md:p-6">
          <h2 class="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <span class="text-xl md:text-2xl">📊</span>
            Leaderboard Stats
          </h2>
          
          <div class="grid grid-cols-2 gap-3 md:gap-4">
            <div class="p-3 md:p-4 bg-gray-50 rounded-xl text-center">
              <p class="text-2xl md:text-3xl font-bold text-primary-600">{{ totalPets }}</p>
              <p class="text-xs md:text-sm text-gray-600">Total Pets</p>
            </div>
            <div class="p-3 md:p-4 bg-gray-50 rounded-xl text-center">
              <p class="text-2xl md:text-3xl font-bold text-warning-600">{{ aiPetsCount }}</p>
              <p class="text-xs md:text-sm text-gray-600">AI Pets</p>
            </div>
          </div>
        </div>

        <div class="card p-4 md:p-6">
          <h2 class="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <span class="text-xl md:text-2xl">ℹ️</span>
            About
          </h2>
          
          <div class="space-y-2 md:space-y-3 text-gray-600 text-sm md:text-base">
            <p>
              <strong class="text-gray-900">Pet Leaderboard:</strong> Compete with other players to see whose pet is the strongest!
            </p>
            <p>
              <strong class="text-gray-900">Ranking Categories:</strong>
            </p>
            <ul class="list-disc list-inside pl-2 md:pl-4 space-y-1 text-xs md:text-sm">
              <li><strong>Level</strong> - Sort by pet level</li>
              <li><strong>Power</strong> - Calculated combat strength</li>
              <li><strong>Defense</strong> - Defensive stats</li>
              <li><strong>Health</strong> - Maximum HP</li>
              <li><strong>Beauty</strong> - Based on evolution stage and likes</li>
            </ul>
            <p class="text-xs md:text-sm text-gray-500 mt-3 md:mt-4">
              The leaderboard resets each session. A backend integration is planned for persistent rankings.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePetStore } from '~/stores/pet'

const router = useRouter()
const petStore = usePetStore()

const totalPets = computed(() => petStore.allLeaderboardPets.length)
const aiPetsCount = computed(() => petStore.aiPets.length)

const lastRefreshedFormatted = computed(() => {
  if (!petStore.leaderboardSettings.lastRefreshed) return null
  return new Date(petStore.leaderboardSettings.lastRefreshed).toLocaleString()
})

const toggleSimulation = () => {
  petStore.toggleSimulation()
}

const refreshLeaderboard = () => {
  petStore.refreshLeaderboard()
}

useHead({
  title: 'Settings - FlashLearn'
})
</script>

<style scoped>
.settings-page {
  @apply min-h-screen bg-gradient-to-b from-gray-50 to-gray-100;
}
</style>
