<template>
  <div class="leaderboard-page">
    <div class="container mx-auto px-4 py-6 md:py-8">
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
        <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 md:mb-2">Pet Leaderboard</h1>
        <p class="text-base md:text-xl text-gray-600">Compare your pet's stats with others</p>
      </div>

      <PetLeaderboardFull />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import PetLeaderboardFull from '~/components/PetLeaderboardFull.vue'

const router = useRouter()

useHead({
  title: 'Pet Leaderboard - FlashLearn'
})
</script>

<style scoped>
.leaderboard-page {
  @apply min-h-screen bg-gradient-to-b from-gray-50 to-gray-100;
}
</style>
