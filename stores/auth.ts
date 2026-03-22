import { defineStore } from 'pinia'
import { useDeckStore } from '~/stores/deck'
import { usePetStore } from '~/stores/pet'

interface User {
  id: string
  email: string
  name: string
  createdAt?: string
}

interface AuthResponse {
  user: User
  token: string
}

interface UserDataResponse {
  userId: string
  stats: any
  food: any
  pet: any
  decks: any[]
  examResults: any[]
  battleHistory: any[]
  dailyChallenges: any[]
  unlockedBadges: any[]
  leaderboard: any
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw { statusCode: response.status, data: errorData }
  }
  
  return response.json()
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    user: null as User | null,
    token: null as string | null,
    isLoading: false,
  }),

  actions: {
    async loadUserData() {
      if (!this.isLoggedIn) return
      
      this.isLoading = true
      try {
        const data = await apiFetch<UserDataResponse>('/api/user/data')
        
        const deckStore = useDeckStore()
        const petStore = usePetStore()
        
        deckStore.loadFromServer(data)
        petStore.loadFromServer(data)
        
      } catch (error) {
        console.error('Failed to load user data:', error)
      } finally {
        this.isLoading = false
      }
    },

    async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
      try {
        const response = await apiFetch<AuthResponse>('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        })

        this.isLoggedIn = true
        this.user = response.user
        this.token = response.token
        this.saveToStorage()
        
        await this.loadUserData()
        
        return { success: true }
      } catch (error: any) {
        console.error('Login error:', error)
        return {
          success: false,
          error: error.data?.message || 'Login failed'
        }
      }
    },

    async register(name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
      try {
        const response = await apiFetch<AuthResponse>('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ name, email, password }),
        })

        this.isLoggedIn = true
        this.user = response.user
        this.token = response.token
        this.saveToStorage()
        
        await this.loadUserData()
        
        return { success: true }
      } catch (error: any) {
        console.error('Register error:', error)
        return {
          success: false,
          error: error.data?.message || 'Registration failed'
        }
      }
    },

    async logout(): Promise<void> {
      try {
        await apiFetch('/api/auth/logout', { method: 'POST' })
      } catch (error) {
        console.error('Logout error:', error)
      }

      this.isLoggedIn = false
      this.user = null
      this.token = null
      
      localStorage.removeItem('flashcard-decks')
      localStorage.removeItem('pet-store')
      localStorage.removeItem('auth-store')
    },

    async checkAuth(): Promise<boolean> {
      if (typeof window === 'undefined') return false

      const saved = localStorage.getItem('auth-store')
      if (!saved) return false

      try {
        const parsed = JSON.parse(saved)
        if (!parsed.isLoggedIn || !parsed.token) return false

        this.token = parsed.token
        this.isLoggedIn = true

        const response = await apiFetch<{ user: User }>('/api/auth/me')
        this.user = response.user
        
        await this.loadUserData()
        
        return true
      } catch (error) {
        console.error('Auth check failed:', error)
        this.isLoggedIn = false
        this.user = null
        this.token = null
        this.saveToStorage()
        return false
      }
    },

    saveToStorage() {
      if (typeof window !== 'undefined') {
        const data = {
          isLoggedIn: this.isLoggedIn,
          user: this.user,
          token: this.token
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
            this.token = parsed.token || null
          } catch (e) {
            console.error('Failed to load auth store:', e)
          }
        }
      }
    }
  }
})
