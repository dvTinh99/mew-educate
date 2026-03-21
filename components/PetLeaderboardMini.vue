<template>
  <div class="pet-leaderboard-mini">
    <div class="card p-4 md:p-6">
      <div class="flex items-center justify-between mb-3 md:mb-4">
        <h3 class="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
          <span class="text-xl md:text-2xl">🏆</span>
          <span class="hidden sm:inline">Top Pets</span>
          <span class="sm:hidden">Top</span>
        </h3>
        <NuxtLink 
          to="/leaderboard" 
          class="text-primary-600 hover:text-primary-700 font-medium text-xs md:text-sm flex items-center gap-1"
        >
          View All
          <svg class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>

      <div v-if="topPets.length === 0" class="text-center py-4 md:py-6">
        <p class="text-sm md:text-base text-gray-500">No pets in leaderboard yet</p>
      </div>

      <div v-else class="space-y-2 md:space-y-3">
        <div 
          v-for="(pet, index) in topPets" 
          :key="pet.id"
          class="leaderboard-entry flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl transition-all"
          :class="{ 
            'bg-primary-50 border-2 border-primary-200': pet.isPlayerPet,
            'bg-gray-50': !pet.isPlayerPet && index === 0,
            'hover:bg-gray-100': !pet.isPlayerPet && index !== 0
          }"
        >
          <div class="rank-badge w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full font-bold flex-shrink-0"
            :class="getRankClass(index)"
          >
            <span v-if="index < 3" class="text-base md:text-lg">{{ getRankEmoji(index) }}</span>
            <span v-else class="text-xs md:text-sm">#{{ index + 1 }}</span>
          </div>
          
          <div class="pet-avatar w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0"
            :class="getAvatarClass(pet.evolutionStage)"
          >
            <span class="text-base md:text-xl">{{ getPetEmoji(pet.evolutionStage) }}</span>
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1 md:gap-2">
              <p class="font-semibold text-gray-900 text-sm md:text-base truncate max-w-[80px] md:max-w-[120px]">{{ pet.petName }}</p>
              <span v-if="pet.isPlayerPet" class="px-1.5 py-0.5 md:px-2 md:py-0.5 bg-primary-100 text-primary-700 text-[10px] md:text-xs font-medium rounded-full flex-shrink-0">
                You
              </span>
            </div>
            <p class="text-[10px] md:text-sm text-gray-500">Lv. {{ pet.level }} • {{ pet.power }} ⚔️</p>
          </div>
          
          <div class="text-right flex-shrink-0 hidden xs:block">
            <p class="text-xs md:text-sm font-medium text-gray-700">{{ pet.evolutionStageNames[pet.evolutionStage - 1] }}</p>
            <p class="text-[10px] md:text-xs text-gray-500">{{ pet.winRate }}% Win</p>
          </div>
        </div>
      </div>

      <div v-if="playerRank && playerRank.rank && playerRank.rank > 3" class="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
        <NuxtLink 
          to="/leaderboard" 
          class="flex items-center justify-between text-xs md:text-sm"
        >
          <span class="text-gray-600">Your Rank: <span class="font-bold text-primary-600">#{{ playerRank.rank }}</span></span>
          <span class="text-primary-600 font-medium">View →</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePetStore } from '~/stores/pet'

const petStore = usePetStore()

const topPets = computed(() => petStore.topPets)
const playerRank = computed(() => petStore.playerRank)

const evolutionStageNames = ['Baby', 'Teen', 'Adult']

const getRankEmoji = (index: number) => {
  const emojis = ['🥇', '🥈', '🥉']
  return emojis[index] || ''
}

const getRankClass = (index: number) => {
  if (index === 0) return 'bg-yellow-100 text-yellow-700'
  if (index === 1) return 'bg-gray-100 text-gray-600'
  if (index === 2) return 'bg-amber-100 text-amber-700'
  return 'bg-gray-100 text-gray-500'
}

const getPetEmoji = (stage: number) => {
  if (stage >= 3) return '🐱'
  if (stage >= 2) return '😺'
  return '🐱'
}

const getAvatarClass = (stage: number) => {
  if (stage >= 3) return 'bg-warning-100'
  if (stage >= 2) return 'bg-primary-100'
  return 'bg-amber-100'
}
</script>

<style scoped>
.leaderboard-entry {
  @apply cursor-default;
}
</style>
