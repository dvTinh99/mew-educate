<template>
  <div class="pet-leaderboard-full">
    <div class="card p-4 md:p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 md:mb-6">
        <h2 class="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span class="text-2xl md:text-3xl">🏆</span>
          <span class="hidden sm:inline">Pet Leaderboard</span>
          <span class="sm:hidden">Leaderboard</span>
        </h2>
        <div class="flex items-center gap-2">
          <button 
            v-if="petStore.leaderboardSettings.simulationEnabled"
            class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1"
            @click="refreshLeaderboard"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span class="hidden sm:inline">Refresh</span>
          </button>
          <NuxtLink 
            to="/settings" 
            class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="hidden sm:inline">Settings</span>
          </NuxtLink>
        </div>
      </div>

      <div class="mb-4 md:mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center gap-3 p-3 md:p-4 bg-primary-50 rounded-xl border-2 border-primary-200">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 md:w-12 md:h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <span class="text-xl md:text-2xl">{{ playerPet ? getPetEmoji(playerPet.evolutionStage) : '🐱' }}</span>
            </div>
            <div>
              <p class="text-sm text-gray-600">Your Pet Rank</p>
              <p class="text-xl md:text-2xl font-bold text-primary-700">
                #{{ playerRank?.rank || '-' }} 
                <span class="text-sm md:text-base font-normal text-gray-500">of {{ currentLeaderboard.length }}</span>
              </p>
            </div>
          </div>
          <div v-if="playerPet" class="sm:ml-auto text-left sm:text-right mt-2 sm:mt-0">
            <p class="font-semibold text-gray-900">{{ playerPet.petName }}</p>
            <p class="text-sm text-gray-600">Lv. {{ playerPet.level }} • {{ playerPet.power }} ⚔️</p>
          </div>
          <div v-else class="sm:ml-auto text-left sm:text-right mt-2 sm:mt-0">
            <p class="text-gray-500">No pet yet</p>
          </div>
        </div>
      </div>

      <div class="mb-4 md:mb-6">
        <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            class="px-3 py-2 md:px-4 rounded-lg font-medium whitespace-nowrap transition-all text-sm md:text-base"
            :class="selectedCategory === cat.id 
              ? 'bg-primary-500 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            @click="selectedCategory = cat.id"
          >
            {{ cat.icon }} {{ cat.label }}
          </button>
        </div>
      </div>

      <div v-if="currentLeaderboard.length === 0" class="text-center py-8 md:py-12">
        <div class="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-3xl md:text-4xl">🐱</span>
        </div>
        <p class="text-base md:text-lg text-gray-600">No pets in leaderboard</p>
        <p class="text-sm text-gray-500 mt-1">Adopt a pet to see rankings</p>
      </div>

      <div v-else>
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b-2 border-gray-200">
                <th class="text-left py-3 px-3 font-bold text-gray-700 w-16">Rank</th>
                <th class="text-left py-3 px-3 font-bold text-gray-700">Pet</th>
                <th class="text-center py-3 px-3 font-bold text-gray-700 w-20">Level</th>
                <th class="text-center py-3 px-3 font-bold text-gray-700 w-24">Power ⚔️</th>
                <th class="text-center py-3 px-3 font-bold text-gray-700 w-24">Defense 🛡️</th>
                <th class="text-center py-3 px-3 font-bold text-gray-700 w-24">Health ❤️</th>
                <th class="text-center py-3 px-3 font-bold text-gray-700 w-20">Stage</th>
                <th class="text-center py-3 px-3 font-bold text-gray-700 w-20">Win %</th>
                <th class="text-center py-3 px-3 font-bold text-gray-700 w-20">❤️</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(pet, index) in currentLeaderboard" 
                :key="pet.id"
                class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                :class="{ 
                  'bg-primary-50': pet.isPlayerPet,
                  'bg-yellow-50': index === 0 && !pet.isPlayerPet
                }"
              >
                <td class="py-3 px-3">
                  <div class="flex items-center justify-center">
                    <span v-if="index < 3" class="text-2xl">{{ getRankEmoji(index) }}</span>
                    <span v-else class="font-bold text-gray-500">#{{ index + 1 }}</span>
                  </div>
                </td>
                <td class="py-3 px-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      :class="getAvatarClass(pet.evolutionStage)"
                    >
                      <span class="text-xl">{{ getPetEmoji(pet.evolutionStage) }}</span>
                    </div>
                    <div class="min-w-0">
                      <div class="flex items-center gap-2 flex-wrap">
                        <p class="font-semibold text-gray-900 truncate max-w-[120px]">{{ pet.petName }}</p>
                        <span v-if="pet.isPlayerPet" class="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                          You
                        </span>
                        <span v-if="pet.isAIPet" class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          AI
                        </span>
                      </div>
                      <p class="text-sm text-gray-500 truncate max-w-[120px]">{{ pet.ownerName }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-3 text-center">
                  <span class="font-bold text-gray-900">{{ pet.level }}</span>
                </td>
                <td class="py-3 px-3 text-center">
                  <span class="font-bold text-orange-600">{{ pet.power }}</span>
                </td>
                <td class="py-3 px-3 text-center">
                  <span class="font-bold text-blue-600">{{ pet.defense }}</span>
                </td>
                <td class="py-3 px-3 text-center">
                  <span class="font-bold text-red-600">{{ pet.health }}</span>
                </td>
                <td class="py-3 px-3 text-center">
                  <span class="px-2 py-1 rounded-lg text-sm font-medium"
                    :class="getStageClass(pet.evolutionStage)"
                  >
                    {{ getStageName(pet.evolutionStage) }}
                  </span>
                </td>
                <td class="py-3 px-3 text-center">
                  <span class="font-medium"
                    :class="pet.winRate >= 60 ? 'text-green-600' : pet.winRate >= 40 ? 'text-yellow-600' : 'text-red-600'"
                  >
                    {{ pet.winRate }}%
                  </span>
                </td>
                <td class="py-3 px-3 text-center">
                  <span class="text-gray-700">{{ pet.likes }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="md:hidden space-y-3">
          <div 
            v-for="(pet, index) in currentLeaderboard" 
            :key="pet.id"
            class="p-4 rounded-xl transition-all"
            :class="{ 
              'bg-primary-50 border-2 border-primary-200': pet.isPlayerPet,
              'bg-yellow-50 border border-yellow-200': index === 0 && !pet.isPlayerPet,
              'bg-gray-50': index !== 0 && !pet.isPlayerPet
            }"
          >
            <div class="flex items-center gap-3 mb-3">
              <div class="flex items-center justify-center w-10 h-10 rounded-full"
                :class="getAvatarClass(pet.evolutionStage)"
              >
                <span class="text-xl">{{ getPetEmoji(pet.evolutionStage) }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <p class="font-semibold text-gray-900">{{ pet.petName }}</p>
                  <span v-if="pet.isPlayerPet" class="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                    You
                  </span>
                  <span v-if="pet.isAIPet" class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    AI
                  </span>
                </div>
                <p class="text-sm text-gray-500">{{ pet.ownerName }}</p>
              </div>
              <div class="text-center">
                <span v-if="index < 3" class="text-2xl">{{ getRankEmoji(index) }}</span>
                <span v-else class="font-bold text-gray-500 text-lg">#{{ index + 1 }}</span>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                <span class="text-gray-600">Level</span>
                <span class="font-bold text-gray-900">{{ pet.level }}</span>
              </div>
              <div class="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                <span class="text-gray-600">Power ⚔️</span>
                <span class="font-bold text-orange-600">{{ pet.power }}</span>
              </div>
              <div class="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                <span class="text-gray-600">Defense 🛡️</span>
                <span class="font-bold text-blue-600">{{ pet.defense }}</span>
              </div>
              <div class="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                <span class="text-gray-600">Health ❤️</span>
                <span class="font-bold text-red-600">{{ pet.health }}</span>
              </div>
            </div>
            
            <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 rounded-lg text-xs font-medium"
                  :class="getStageClass(pet.evolutionStage)"
                >
                  {{ getStageName(pet.evolutionStage) }}
                </span>
                <span class="text-sm text-gray-600">
                  {{ pet.winRate }}% Win
                </span>
              </div>
              <span class="text-sm text-gray-500">❤️ {{ pet.likes }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePetStore } from '~/stores/pet'
import type { LeaderboardCategory } from '~/types/pet'

const petStore = usePetStore()
const selectedCategory = ref<LeaderboardCategory>('level')

const categories = [
  { id: 'level' as LeaderboardCategory, label: 'Level', icon: '📊' },
  { id: 'power' as LeaderboardCategory, label: 'Power', icon: '⚔️' },
  { id: 'defense' as LeaderboardCategory, label: 'Defense', icon: '🛡️' },
  { id: 'health' as LeaderboardCategory, label: 'Health', icon: '❤️' },
  { id: 'beauty' as LeaderboardCategory, label: 'Beauty', icon: '✨' }
]

const currentLeaderboard = computed(() => {
  return petStore.getLeaderboardByCategory(selectedCategory.value)
})

const playerRank = computed(() => {
  return petStore.playerRankByCategory(selectedCategory.value)
})

const playerPet = computed(() => {
  return currentLeaderboard.value.find(p => p.isPlayerPet)
})

const refreshLeaderboard = () => {
  petStore.refreshLeaderboard()
}

const getRankEmoji = (index: number) => {
  const emojis = ['🥇', '🥈', '🥉']
  return emojis[index] || ''
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

const getStageName = (stage: number) => {
  const names = ['Baby', 'Teen', 'Adult']
  return names[stage - 1] || 'Unknown'
}

const getStageClass = (stage: number) => {
  if (stage >= 3) return 'bg-warning-100 text-warning-700'
  if (stage >= 2) return 'bg-primary-100 text-primary-700'
  return 'bg-amber-100 text-amber-700'
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
