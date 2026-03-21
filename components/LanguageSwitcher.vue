<template>
  <div class="language-switcher">
    <select
      v-model="currentLocale"
      class="lang-select"
      @change="changeLocale"
    >
      <option
        v-for="locale in availableLocales"
        :key="locale.code"
        :value="locale.code"
      >
        {{ locale.name }}
      </option>
    </select>
    <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const currentLocale = ref(locale.value)

const availableLocales = computed(() => {
  return locales.value.filter((l): l is { code: string; name: string } => 
    typeof l === 'object' && 'code' in l && 'name' in l
  )
})

const changeLocale = async () => {
  await setLocale(currentLocale.value)
}
</script>

<style scoped>
.language-switcher {
  @apply relative inline-flex items-center;
}

.lang-select {
  @apply appearance-none bg-transparent border-2 border-gray-200 rounded-xl px-4 py-2 pr-10 text-base font-medium text-gray-700 cursor-pointer transition-all hover:border-primary-300 focus:outline-none focus:border-primary-500;
}

.dropdown-icon {
  @apply absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none;
}
</style>
