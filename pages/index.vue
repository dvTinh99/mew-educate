<template>
  <div class="dashboard-page">
    <div class="container mx-auto px-4 py-8">
      <NuxtPage />

      <!-- Daily Challenges -->
      <div v-if="activeChallenges.length > 0" class="challenges-section mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg class="w-6 h-6 text-warning-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"/>
          </svg>
          Daily Challenges
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DailyChallenge 
            v-for="challenge in activeChallenges" 
            :key="challenge.id"
            :challenge="challenge"
          />
        </div>
      </div>

      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Learn by Game
        </h1>
        <p class="text-xl text-gray-600">
          Master any subject with flashcards, exams, and track your progress
        </p>
      </div>

      <!-- Categories Section -->
      <div class="categories-section mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            class="category-btn"
            @click="selectedCategory = cat.id"
            :class="{ 'category-selected': selectedCategory === cat.id }"
          >
            <component :is="cat.icon" class="w-8 h-8 mb-2" />
            <span class="font-bold">{{ cat.name }}</span>
            <span class="text-sm opacity-80">{{ cat.count }} decks</span>
          </button>
        </div>
      </div>

      <!-- Pre-built Decks -->
      <div v-if="selectedCategory !== 'my'" class="prebuilt-section mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          {{ getCategoryName(selectedCategory) }} Decks
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DeckCard
            v-for="deck in getDecksByCategory(selectedCategory)"
            :key="deck.id"
            :deck="deck"
            @click="navigateToDeck(deck.id)"
            @study="startStudy(deck.id)"
          />
        </div>
      </div>

      <!-- My Decks (when category is 'my') -->
      <div v-if="selectedCategory === 'my'" class="my-decks-section mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">My Decks</h2>
          <AppButton variant="primary" size="md" @click="showDeckModal = true">
            <span class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              New Deck
            </span>
          </AppButton>
        </div>

        <!-- Empty State -->
        <div v-if="myDecks.length === 0" class="card text-center py-12">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">No custom decks yet</h3>
          <p class="text-lg text-gray-600 mb-6">Create your own deck or browse pre-built decks above</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DeckCard
            v-for="deck in myDecks"
            :key="deck.id"
            :deck="deck"
            @click="navigateToDeck(deck.id)"
            @study="startStudy(deck.id)"
          />
        </div>
      </div>

      <!-- Empty State for Pre-built -->
      <div v-if="selectedCategory !== 'my' && getDecksByCategory(selectedCategory).length === 0" class="card text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">No decks in this category</h3>
        <p class="text-lg text-gray-600">Check back later for new content</p>
      </div>

      <!-- Create Deck FAB -->
      <div class="fixed bottom-8 right-8 z-30">
        <button
          type="button"
          class="fab-button"
          aria-label="Create new deck"
          @click="showDeckModal = true"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <!-- Deck Modal -->
      <DeckModal
        v-model="showDeckModal"
        @save="handleCreateDeck"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDeckStore, type DeckCategory } from '~/stores/deck'

const router = useRouter()
const deckStore = useDeckStore()
const showDeckModal = ref(false)
const selectedCategory = ref<DeckCategory | 'my'>('general')

onMounted(async () => {
  if (deckStore.decks.length === 0) {
    await deckStore.loadPrebuiltDecks()
  }
  deckStore.generateDailyChallenges()
})

const activeChallenges = computed(() => {
  return deckStore.getActiveChallenges
})

const myDecks = computed(() => {
  return deckStore.getCustomDecks
})

const getDecksByCategory = (category: DeckCategory) => {
  return deckStore.getDecksByCategory(category)
}

const getCategoryName = (category: string) => {
  const names: Record<string, string> = {
    general: 'General',
    hsk: 'HSK Chinese',
    toeic: 'TOEIC English'
  }
  return names[category] || category
}

const ChineseIcon = () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { d: 'M10 2a8 8 0 100 16 8 8 0 000-16zM6.5 8a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm4 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm-2 4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z' })
])

const EnglishIcon = () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { 'fill-rule': 'evenodd', d: 'M7 2a1 1 0 011 1v1h3V3a1 1 0 112 0v1h3a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2H1a1 1 0 110-2h1V9H1a1 1 0 010-2h1V5a2 2 0 012-2zm7 5h3a1 1 0 110 2H9v2h3a1 1 0 110 2H9v2h3a1 1 0 110 2H9a1 1 0 01-1-1v-2a1 1 0 00-1-1H7a1 1 0 00-1 1v2a1 1 0 001 1h1v1a1 1 0 11-2 0v-1H4a1 1 0 110-2h1V9H4a1 1 0 110-2h3a1 1 0 001-1V3a1 1 0 00-1-1H7z', 'clip-rule': 'evenodd' })
])

const GeneralIcon = () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { 'fill-rule': 'evenodd', d: 'M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z', 'clip-rule': 'evenodd' })
])

const MyDecksIcon = () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { d: 'M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z' })
])

const categories = computed(() => {
  const cats = [
    { id: 'my' as const, name: 'My Decks', icon: MyDecksIcon, count: myDecks.value.length },
    { id: 'general' as const, name: 'General', icon: GeneralIcon, count: deckStore.getDecksByCategory('general').length },
    { id: 'hsk' as const, name: 'HSK Chinese', icon: ChineseIcon, count: deckStore.getDecksByCategory('hsk').length },
    { id: 'toeic' as const, name: 'TOEIC English', icon: EnglishIcon, count: deckStore.getDecksByCategory('toeic').length }
  ]
  return cats
})

const navigateToDeck = (deckId: string) => {
  router.push(`/deck/${deckId}`)
}

const startStudy = (deckId: string) => {
  router.push(`/study/${deckId}`)
}

const handleCreateDeck = (data: { name: string; description?: string }) => {
  const newDeck = deckStore.createDeck(data.name, data.description)
  if (newDeck) {
    router.push(`/deck/${newDeck.id}`)
  }
}
</script>

<style scoped>
.fab-button {
  @apply w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:shadow-2xl hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary-300;
}

.category-btn {
  @apply flex flex-col items-center justify-center p-6 rounded-2xl bg-white border-2 border-gray-100 transition-all duration-300;
}

.category-btn:hover {
  @apply border-primary-300 bg-primary-50;
}

.category-selected {
  @apply border-primary-500 bg-primary-50;
}
</style>
