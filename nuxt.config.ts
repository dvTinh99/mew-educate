export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/i18n'
  ],

  css: ['~/assets/css/main.css'],

  i18n: {
    locales: [
      { code: 'en', name: 'English', flag: '🇺🇸', file: 'en.json' },
      { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', file: 'vi.json' },
      { code: 'zh', name: '简体中文', flag: '🇨🇳', file: 'zh.json' }
    ],
    defaultLocale: 'en',
    lazy: true,
    langDir: 'locales',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'en'
    }
  },

  app: {
    head: {
      title: 'Learn by Game',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {       name: 'description',
      content: 'FlashLearn - Master any subject through gamified flashcards, exams, and pet battles' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})
