import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    user: null as { name: string; email: string } | null
  }),

  actions: {
    login(email: string, _password: string) {
      this.isLoggedIn = true
      this.user = {
        name: email.split('@')[0],
        email: email
      }
      this.saveToStorage()
    },

    register(name: string, email: string, _password: string) {
      this.isLoggedIn = true
      this.user = {
        name: name,
        email: email
      }
      this.saveToStorage()
    },

    logout() {
      this.isLoggedIn = false
      this.user = null
      this.saveToStorage()
    },

    saveToStorage() {
      if (typeof window !== 'undefined') {
        const data = {
          isLoggedIn: this.isLoggedIn,
          user: this.user
        }
        localStorage.setItem('auth-store', JSON.stringify(data))
      }
    },

    loadFromStorage() {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('auth-store')
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            this.isLoggedIn = parsed.isLoggedIn || false
            this.user = parsed.user || null
          } catch (e) {
            console.error('Failed to load auth store:', e)
          }
        }
      }
    }
  }
})
