<template>
  <div class="pet-showcase">
    <div class="pets-display">
      <div class="pet-stage">
        <div class="pet-avatar">
          <span class="pet-emoji">🐱</span>
        </div>
        <div class="pet-glow baby"></div>
        <span class="stage-label">{{ $t('landing.petShowcase.baby') }}</span>
      </div>
      
      <div class="stage-arrow">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
      
      <div class="pet-stage">
        <div class="pet-avatar teen">
          <span class="pet-emoji">🐱</span>
          <span class="star-badge">⭐</span>
        </div>
        <div class="pet-glow teen"></div>
        <span class="stage-label">{{ $t('landing.petShowcase.teen') }}</span>
      </div>
      
      <div class="stage-arrow">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
      
      <div class="pet-stage">
        <div class="pet-avatar adult">
          <span class="pet-emoji">🐱</span>
          <div class="wings">
            <span class="wing wing-left">🪽</span>
            <span class="wing wing-right">🪽</span>
          </div>
        </div>
        <div class="pet-glow adult"></div>
        <span class="stage-label">{{ $t('landing.petShowcase.adult') }}</span>
      </div>
    </div>
    
    <div class="stats-preview">
      <div class="stat-item">
        <span class="stat-icon">⚔️</span>
        <span class="stat-value">10</span>
        <span class="stat-label">{{ $t('landing.petShowcase.attack') }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon">🛡️</span>
        <span class="stat-value">10</span>
        <span class="stat-label">{{ $t('landing.petShowcase.defense') }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon">❤️</span>
        <span class="stat-value">100</span>
        <span class="stat-label">{{ $t('landing.petShowcase.health') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.pet-showcase {
  @apply space-y-8;
}

.pets-display {
  @apply flex items-center justify-center gap-4 md:gap-8 flex-wrap;
}

.pet-stage {
  @apply flex flex-col items-center gap-3;
}

.pet-avatar {
  @apply relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-5xl md:text-6xl shadow-lg;
}

.pet-avatar.teen {
  @apply from-orange-100 to-orange-200;
  animation: bounce-soft 2s ease-in-out infinite;
}

.pet-avatar.adult {
  @apply from-orange-200 to-amber-300;
  animation: bounce 1.5s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes bounce-soft {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.star-badge {
  @apply absolute -top-2 -right-2 text-2xl;
  animation: sparkle 1s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(15deg); }
}

.wings {
  @apply absolute inset-0 pointer-events-none;
}

.wing {
  @apply absolute text-2xl;
  animation: flutter 0.5s ease-in-out infinite;
}

.wing-left {
  @apply -left-6 top-1/2 -translate-y-1/2;
}

.wing-right {
  @apply -right-6 top-1/2 -translate-y-1/2;
  transform: scaleX(-1);
}

@keyframes flutter {
  0%, 100% { transform: translateY(-50%) rotate(-5deg); }
  50% { transform: translateY(-50%) rotate(5deg); }
}

.wing-right {
  animation: flutter-right 0.5s ease-in-out infinite;
}

@keyframes flutter-right {
  0%, 100% { transform: translateY(-50%) scaleX(-1) rotate(-5deg); }
  50% { transform: translateY(-50%) scaleX(-1) rotate(5deg); }
}

.pet-glow {
  @apply absolute inset-0 rounded-full opacity-30 blur-xl -z-10;
}

.pet-glow.baby {
  @apply bg-amber-300;
}

.pet-glow.teen {
  @apply bg-orange-400;
}

.pet-glow.adult {
  @apply bg-amber-500;
}

.stage-label {
  @apply text-sm md:text-base font-semibold text-gray-700;
}

.stage-arrow {
  @apply text-gray-400 w-8 h-8;
}

.stats-preview {
  @apply flex justify-center gap-8 md:gap-16;
}

.stat-item {
  @apply flex flex-col items-center gap-1;
}

.stat-icon {
  @apply text-2xl;
}

.stat-value {
  @apply text-2xl md:text-3xl font-bold text-gray-900;
}

.stat-label {
  @apply text-xs md:text-sm text-gray-600;
}
</style>
