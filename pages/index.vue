<template>
  <div class="landing-page">
    <!-- Navigation -->
    <nav class="landing-nav">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <span class="text-2xl">🎮</span>
          </div>
          <span class="text-2xl font-bold text-gray-900">{{ $t('app.name') }}</span>
        </div>
        
        <div class="flex items-center gap-6">
          <LanguageSwitcher />
          <button 
            class="px-6 py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors"
            @click="scrollToSection('features')"
          >
            {{ $t('nav.features') }}
          </button>
          <button 
            class="px-6 py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors"
            @click="scrollToSection('how-it-works')"
          >
            {{ $t('nav.howItWorks') }}
          </button>
          <button 
            class="px-6 py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors"
            @click="scrollToSection('pets')"
          >
            {{ $t('nav.petSystem') }}
          </button>
          <div class="flex items-center gap-3">
            <template v-if="authStore.isLoggedIn">
              <button 
                class="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl"
                @click="router.push('/profile')"
              >
                {{ $t('nav.profile') || 'Profile' }}
              </button>
            </template>
            <template v-else>
              <button 
                class="px-6 py-3 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                @click="showLoginModal = true"
              >
                {{ $t('nav.login') }}
              </button>
              <button 
                class="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl"
                @click="showRegisterModal = true"
              >
                {{ $t('nav.register') }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-bg"></div>
      <div class="container mx-auto px-4 py-20 md:py-32">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-5xl md:text-7xl font-bold mb-6 gradient-text">
            {{ $t('landing.hero.title') }}
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
            {{ $t('landing.hero.subtitle') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              class="px-10 py-5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-xl rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
              @click="authStore.isLoggedIn ? router.push('/profile') : showRegisterModal = true"
            >
              {{ authStore.isLoggedIn ? ($t('nav.goToProfile') || 'Go to Profile') : $t('landing.hero.cta') }}
            </button>
            <button 
              class="px-10 py-5 bg-white border-2 border-gray-200 text-gray-700 font-bold text-xl rounded-2xl hover:border-primary-300 hover:bg-primary-50 transition-all"
              @click="scrollToSection('features')"
            >
              {{ $t('landing.hero.ctaSecondary') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features-section py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          {{ $t('landing.features.title') }}
        </h2>
        <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <FeatureCard
            icon="📚"
            :title="$t('landing.features.flashcards.title')"
            :description="$t('landing.features.flashcards.description')"
          />
          <FeatureCard
            icon="⏱️"
            :title="$t('landing.features.exams.title')"
            :description="$t('landing.features.exams.description')"
          />
          <FeatureCard
            icon="⭐"
            :title="$t('landing.features.xp.title')"
            :description="$t('landing.features.xp.description')"
          />
          <FeatureCard
            icon="🏆"
            :title="$t('landing.features.challenges.title')"
            :description="$t('landing.features.challenges.description')"
          />
          <FeatureCard
            icon="🐱"
            :title="$t('landing.features.pets.title')"
            :description="$t('landing.features.pets.description')"
          />
          <FeatureCard
            icon="⚔️"
            :title="$t('landing.features.battles.title')"
            :description="$t('landing.features.battles.description')"
          />
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="how-it-works py-20">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          {{ $t('landing.howItWorks.title') }}
        </h2>
        <div class="max-w-4xl mx-auto mt-12">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="step-number">1</div>
              <div class="step-icon mb-4">📖</div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                {{ $t('landing.howItWorks.step1.title') }}
              </h3>
              <p class="text-gray-600">
                {{ $t('landing.howItWorks.step1.description') }}
              </p>
            </div>
            <div class="text-center">
              <div class="step-number">2</div>
              <div class="step-icon mb-4">📝</div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                {{ $t('landing.howItWorks.step2.title') }}
              </h3>
              <p class="text-gray-600">
                {{ $t('landing.howItWorks.step2.description') }}
              </p>
            </div>
            <div class="text-center">
              <div class="step-number">3</div>
              <div class="step-icon mb-4">🎮</div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                {{ $t('landing.howItWorks.step3.title') }}
              </h3>
              <p class="text-gray-600">
                {{ $t('landing.howItWorks.step3.description') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pet Showcase Section -->
    <section id="pets" class="pets-section py-20 bg-gradient-to-b from-amber-50 to-orange-50">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {{ $t('landing.petShowcase.title') }}
          </h2>
          <p class="text-xl text-gray-600 mb-12">
            {{ $t('landing.petShowcase.subtitle') }}
          </p>
          <PetShowcase />
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {{ $t('landing.cta.title') }}
          </h2>
          <p class="text-xl text-gray-600 mb-8">
            {{ $t('landing.cta.subtitle') }}
          </p>
          <button 
            class="px-12 py-5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-xl rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            @click="authStore.isLoggedIn ? router.push('/profile') : showRegisterModal = true"
          >
            {{ authStore.isLoggedIn ? ($t('nav.goToProfile') || 'Go to Profile') : $t('landing.cta.button') }}
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer py-8 bg-gray-100">
      <div class="container mx-auto px-4 text-center">
        <p class="text-gray-600">
          {{ $t('footer.builtWith') }} 
          <span class="font-semibold">{{ $t('footer.techStack') }}</span>
        </p>
      </div>
    </footer>

    <!-- Auth Modals -->
    <LoginModal
      v-model="showLoginModal"
      @success="handleAuthSuccess"
      @switch-to-register="switchToRegister"
    />
    
    <RegisterModal
      v-model="showRegisterModal"
      @success="handleAuthSuccess"
      @switch-to-login="switchToLogin"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import FeatureCard from '~/components/FeatureCard.vue'
import PetShowcase from '~/components/PetShowcase.vue'
import LanguageSwitcher from '~/components/LanguageSwitcher.vue'
import LoginModal from '~/components/LoginModal.vue'
import RegisterModal from '~/components/RegisterModal.vue'

definePageMeta({
  layout: 'landing'
})

const router = useRouter()
const authStore = useAuthStore()

const showLoginModal = ref(false)
const showRegisterModal = ref(false)

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const switchToRegister = () => {
  showLoginModal.value = false
  showRegisterModal.value = true
}

const switchToLogin = () => {
  showRegisterModal.value = false
  showLoginModal.value = true
}

const handleAuthSuccess = () => {
  router.push('/profile')
}

onMounted(() => {
  authStore.loadFromStorage()
})

useHead({
  title: 'FlashLearn - Gamified Flashcard Learning'
})
</script>

<style scoped>
.landing-page {
  @apply min-h-screen bg-white;
}

.landing-nav {
  @apply sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100;
}

.hero-section {
  @apply relative overflow-hidden;
}

.hero-bg {
  @apply absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-purple-50;
  background-image: radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
}

.gradient-text {
  background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.features-section {
  @apply relative;
}

.how-it-works {
  @apply relative;
}

.step-number {
  @apply inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-2xl font-bold mb-4 shadow-lg;
}

.step-icon {
  @apply text-6xl mx-auto;
}

.pets-section {
  @apply relative;
}

.cta-section {
  @apply relative;
}

.footer {
  @apply relative;
}
</style>
