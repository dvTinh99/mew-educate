<template>
  <div class="deck-detail-page">
    <div class="container mx-auto px-4 py-8">
      <!-- Loading/Error State -->
      <div v-if="!deck" class="card text-center py-16">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Deck Not Found</h2>
        <p class="text-lg text-gray-600 mb-6">The deck you're looking for doesn't exist.</p>
        <AppButton variant="primary" size="lg" @click="router.push('/')">
          Go Back Home
        </AppButton>
      </div>

      <!-- Deck Content -->
      <div v-else>
        <!-- Header -->
        <div class="mb-8">
          <button 
            @click="router.push('/')"
            class="inline-flex items-center gap-2 text-lg text-gray-600 hover:text-primary-600 mb-6 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to All Decks
          </button>

          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ deck.name }}</h1>
              <p v-if="deck.description" class="text-xl text-gray-600">{{ deck.description }}</p>
            </div>
            
            <div class="flex flex-wrap gap-3">
              <AppButton variant="outline" size="lg" @click="handleEditDeck">
                <span class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Deck
                </span>
              </AppButton>
              <AppButton 
                variant="primary" 
                size="lg"
                :disabled="deck.cards.length === 0"
                @click="startExam"
              >
                <span class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Start Exam
                </span>
              </AppButton>
              <AppButton 
                variant="success" 
                size="lg"
                :disabled="deck.cards.length === 0"
                @click="startStudy"
              >
                <span class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                  Study Now
                </span>
              </AppButton>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex items-center gap-6 text-lg text-gray-600">
            <span class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {{ deck.cards.length }} cards
            </span>
            <span v-if="deck.lastStudied" class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Last studied {{ formatLastStudied(deck.lastStudied) }}
            </span>
          </div>
        </div>

        <!-- Cards Section -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Cards</h2>
            <AppButton variant="primary" size="md" @click="openAddCardModal">
              <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Card
              </span>
            </AppButton>
          </div>

          <!-- Empty Cards State -->
          <div v-if="deck.cards.length === 0" class="card text-center py-12">
            <div class="max-w-md mx-auto">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">No Cards Yet</h3>
              <p class="text-lg text-gray-600 mb-6">Add your first flashcard to this deck</p>
              <AppButton variant="primary" size="lg" @click="openAddCardModal">
                Add First Card
              </AppButton>
            </div>
          </div>

          <!-- Cards List -->
          <div v-else class="grid gap-4">
            <CardPreview
              v-for="(card, index) in deck.cards"
              :key="card.id"
              :card="card"
              @click="openEditCardModal(card)"
              @edit="openEditCardModal(card)"
              @delete="confirmDeleteCard(card, index)"
            />
          </div>
        </div>

        <!-- Delete Deck Button -->
        <div class="mt-12 pt-8 border-t-2 border-gray-200">
          <button 
            class="inline-flex items-center gap-2 text-lg text-danger-600 hover:text-danger-700 font-medium transition-colors"
            @click="confirmDeleteDeck"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete This Deck
          </button>
        </div>
      </div>

      <!-- Card Modal -->
      <CardModal
        v-model="showCardModal"
        :card="selectedCard"
        @save="handleSaveCard"
      />

      <!-- Deck Edit Modal -->
      <DeckModal
        v-model="showDeckModal"
        :deck="deck"
        @save="handleUpdateDeck"
      />

      <!-- Delete Confirmation Modal -->
      <Modal
        v-model="showDeleteModal"
        title="Confirm Delete"
        size="sm"
      >
        <div class="text-lg">
          <p v-if="deleteType === 'card'" class="mb-4">
            Are you sure you want to delete this card?
          </p>
          <p v-else class="mb-4">
            Are you sure you want to delete this deck and all its cards?
          </p>
          <p class="text-danger-600 font-medium">This action cannot be undone.</p>
        </div>
        
        <template #footer>
          <AppButton variant="outline" size="lg" @click="showDeleteModal = false">
            Cancel
          </AppButton>
          <AppButton variant="danger" size="lg" @click="executeDelete">
            Delete
          </AppButton>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDeckStore } from '~/stores/deck'
import type { Card } from '~/stores/deck'

const router = useRouter()
const route = useRoute()
const deckStore = useDeckStore()

const deckId = computed(() => route.params.id as string)
const deck = computed(() => deckStore.getDeckById(deckId.value))

const showCardModal = ref(false)
const showDeckModal = ref(false)
const showDeleteModal = ref(false)
const selectedCard = ref<Card | null>(null)
const deleteType = ref<'card' | 'deck'>('card')
const cardToDelete = ref<{ card: Card; index: number } | null>(null)

const openAddCardModal = () => {
  selectedCard.value = null
  showCardModal.value = true
}

const openEditCardModal = (card: Card) => {
  selectedCard.value = card
  showCardModal.value = true
}

const handleSaveCard = (data: { front: string; back: string; hint?: string }) => {
  if (selectedCard.value) {
    deckStore.updateCard(deckId.value, selectedCard.value.id, data)
  } else {
    deckStore.addCardToDeck(deckId.value, data.front, data.back, data.hint)
  }
}

const handleEditDeck = () => {
  showDeckModal.value = true
}

const handleUpdateDeck = (data: { name: string; description?: string }) => {
  deckStore.updateDeck(deckId.value, data)
}

const startStudy = () => {
  router.push(`/study/${deckId.value}`)
}

const startExam = () => {
  router.push(`/exam/${deckId.value}`)
}

const confirmDeleteCard = (card: Card, index: number) => {
  deleteType.value = 'card'
  cardToDelete.value = { card, index }
  showDeleteModal.value = true
}

const confirmDeleteDeck = () => {
  deleteType.value = 'deck'
  showDeleteModal.value = true
}

const executeDelete = () => {
  if (deleteType.value === 'card' && cardToDelete.value) {
    deckStore.deleteCard(deckId.value, cardToDelete.value.card.id)
  } else {
    deckStore.deleteDeck(deckId.value)
    router.push('/')
  }
  showDeleteModal.value = false
  cardToDelete.value = null
}

const formatLastStudied = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}
</script>
