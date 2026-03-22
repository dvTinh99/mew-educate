<template>
  <div class="landing-layout relative">
    <slot />
    
    <FloatingInquiryButton @click="showInquiryModal = true" />
    <InquiryModal v-model="showInquiryModal" />
  </div>
</template>

<script setup lang="ts">
import FloatingInquiryButton from '~/components/FloatingInquiryButton.vue'
import InquiryModal from '~/components/InquiryModal.vue'

const showInquiryModal = ref(false)
</script>

<style scoped>
.landing-layout {
  @apply min-h-screen;
}
</style>
