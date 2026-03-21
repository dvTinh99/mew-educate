<template>
  <div class="onboarding-page">
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div class="max-w-4xl w-full">
        <div class="card p-8 md:p-12">
          <div class="flex justify-end mb-4">
            <button 
              @click="skipOnboarding"
              class="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Skip
            </button>
          </div>

          <Transition name="slide" mode="out-in">
            <div :key="currentStep">
              <div v-if="currentStep === 1" class="step-content">
                <div class="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
                  Welcome to Learn by Game!
                </h1>
                <p class="text-xl text-gray-600 text-center mb-8">
                  Master any subject with flashcards, timed exams, and earn XP
                </p>
              </div>

              <div v-if="currentStep === 2" class="step-content">
                <div class="w-24 h-24 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
                  Study with Flashcards
                </h2>
                <p class="text-xl text-gray-600 text-center mb-8">
                  Flip cards to reveal answers. Rate your recall with easy difficulty buttons to track what you know
                </p>
              </div>

              <div v-if="currentStep === 3" class="step-content">
                <div class="w-24 h-24 bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
                  Take Timed Exams
                </h2>
                <p class="text-xl text-gray-600 text-center mb-8">
                  Choose between type-in answers or multiple choice. Race against the clock and see your results at the end
                </p>
              </div>

              <div v-if="currentStep === 4" class="step-content">
                <div class="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
                  Earn XP & Badges
                </h2>
                <p class="text-xl text-gray-600 text-center mb-8">
                  Complete daily challenges, maintain streaks, and unlock achievements as you progress through your learning journey
                </p>
              </div>

              <div v-if="currentStep === 5" class="step-content">
                <div class="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
                  You're All Set!
                </h2>
                <p class="text-xl text-gray-600 text-center mb-8">
                  Start exploring pre-built decks or create your own. Happy learning!
                </p>
              </div>
            </div>
          </Transition>

          <div class="mt-12">
            <div class="flex justify-center gap-3 mb-8">
              <div 
                v-for="i in totalSteps" 
                :key="i"
                class="w-3 h-3 rounded-full transition-all duration-300"
                :class="i === currentStep ? 'bg-primary-500 w-8' : i < currentStep ? 'bg-primary-300' : 'bg-gray-300'"
              />
            </div>

            <div class="flex justify-center gap-4">
              <AppButton 
                v-if="currentStep > 1"
                variant="outline" 
                size="lg"
                @click="prevStep"
              >
                <span class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </span>
              </AppButton>
              
              <AppButton 
                v-if="currentStep < totalSteps"
                variant="primary" 
                size="lg"
                @click="nextStep"
              >
                <span class="flex items-center gap-2">
                  Next
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </AppButton>

              <AppButton 
                v-if="currentStep === totalSteps"
                variant="primary" 
                size="lg"
                @click="finishOnboarding"
              >
                <span class="flex items-center gap-2">
                  Get Started
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </AppButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDeckStore } from '~/stores/deck'

const router = useRouter()
const deckStore = useDeckStore()

const currentStep = ref(1)
const totalSteps = 5

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const skipOnboarding = () => {
  deckStore.skipOnboarding()
  router.push('/')
}

const finishOnboarding = () => {
  deckStore.skipOnboarding()
  router.push('/')
}

useHead({
  title: 'Welcome - Learn by Game'
})
</script>

<style scoped>
.onboarding-page {
  @apply min-h-screen;
}

.step-content {
  @apply text-center;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
