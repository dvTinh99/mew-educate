<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useDeckStore } from '~/stores/deck'
import { useRouter, definePageMeta } from 'vue-router'

const deckStore = useDeckStore()
const router = useRouter()

onMounted(async () => {
  deckStore.loadFromStorage()
  
  if (deckStore.decks.length === 0) {
    await deckStore.loadPrebuiltDecks()
  }
  
  deckStore.generateDailyChallenges()

  if (!deckStore.userStats.onboardingCompleted) {
    router.push('/onboarding')
  }
})
</script>
