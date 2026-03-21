<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useDeckStore } from '~/stores/deck'
import { useAuthStore } from '~/stores/auth'
import { useRouter, useRoute } from 'vue-router'

const deckStore = useDeckStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

onMounted(async () => {
  deckStore.loadFromStorage()
  authStore.loadFromStorage()
  
  if (deckStore.decks.length === 0) {
    await deckStore.loadPrebuiltDecks()
  }
  
  deckStore.generateDailyChallenges()

  const isLandingPage = route.path === '/'
  const isAuthPage = route.path === '/onboarding' || route.path === '/login' || route.path === '/register'
  
  if (!deckStore.userStats.onboardingCompleted && !isLandingPage && !isAuthPage) {
    router.push('/onboarding')
  }
})
</script>
