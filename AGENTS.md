# AGENTS.md

This document provides guidance for AI agents working in this repository.

## Project Overview

- **Type**: Full-stack Vue.js web application (Nuxt 3)
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom component classes
- **State Management**: Pinia
- **Database**: PostgreSQL (local Docker or Neon) with Drizzle ORM
- **i18n**: @nuxtjs/i18n for multi-language support (en, vi, zh)

## Build Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Production
npm run build        # Build for production
npm run preview      # Preview production build
npm run generate     # Generate static site

# Database
npm run db:migrate   # Push schema to database (drizzle-kit push)
npm run db:seed      # Seed database from JSON files (tsx)

# Docker (local PostgreSQL)
docker compose up -d          # Start local PostgreSQL
docker compose down           # Stop PostgreSQL
```

## Testing

**Not configured.** No test framework set up. If adding tests, use Vitest with native Vite integration for Nuxt 3.

## Environment Setup

### Local Development (.env)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/flashcard
AUTH_SECRET=your-secret-here
NUXT_AUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NUXT_PUBLIC_APP_URL=http://localhost:3000
```

### Google OAuth Setup
1. Go to https://console.cloud.google.com/
2. Enable "Google+ API" in APIs & Services
3. Create OAuth Client ID (Web application)
4. Add redirect URI: `http://localhost:3000/api/auth/google/callback`
5. Copy credentials to `.env`

## Code Style Guidelines

### Vue Components

- Use `<script setup lang="ts">` for all components
- Structure: `<template>` → `<script setup>` → `<style scoped>`
- Component names: **PascalCase** (e.g., `CardModal.vue`, `AppButton.vue`)
- Props: Use TypeScript interface with `withDefaults`

```vue
<script setup lang="ts">
interface Props {
  modelValue: boolean
  title: string
  showCloseButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showCloseButton: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()
</script>
```

### Import Order

1. Third-party libraries (Vue, Pinia, etc.)
2. Nuxt auto-imports (`~/composables/*`, `~/stores/*`, `~/types/*`)
3. Type imports (`import type { Card } from '...'`)

### Naming Conventions

| Element          | Convention        | Example                              |
|------------------|-------------------|--------------------------------------|
| Components       | PascalCase        | `CardModal.vue`                      |
| Composables      | `use` + PascalCase| `useLocalStorage.ts`, `useStudySession.ts` |
| Pinia Stores     | `use` + PascalCase| `useDeckStore` (in `stores/deck.ts`) |
| TypeScript Types | PascalCase        | `Card`, `Deck`, `Props`              |
| Props/Events     | camelCase         | `modelValue`, `isFlipped`            |
| File names       | kebab-case        | `pet-display.vue`                    |

### TypeScript Rules

- Define types for all props, emits, and store state
- Use interfaces (not type aliases) for object shapes
- Avoid `any` - use strict typing
- Use optional properties (`?`) for non-required fields

```typescript
interface Card {
  id: string
  front: string
  back: string
  frontLang?: 'en' | 'vi' | 'zh'
  backLang?: 'en' | 'vi' | 'zh'
  createdAt: Date
}
```

### Error Handling

- Wrap localStorage/async operations in try/catch
- Check `window` availability before browser APIs
- Log errors with `console.error` and descriptive messages

```typescript
loadFromStorage() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('flashcard-decks')
    if (saved) {
      try {
        this.decks = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to load decks:', e)
      }
    }
  }
}
```

### Accessibility

- Add `role`, `tabindex`, `aria-label` to interactive elements
- Use `aria-modal="true"` on modals
- Support keyboard: Enter/Space for buttons, Escape for modals

### CSS & Tailwind

- Global styles in `assets/css/main.css` using `@layer components`
- Use Tailwind utilities; custom classes sparingly
- Component overrides: `<style scoped>`
- Base font size: `18px` (senior-friendly design)

## Directory Structure

```
assets/css/main.css       # Global styles, Tailwind imports
components/              # Vue components (PascalCase)
  AbilityPointAllocator.vue   # Pet ability points UI
  FloatingInquiryButton.vue   # Floating inquiry button
  FoodInventory.vue           # Pet food inventory
  InquiryModal.vue            # Send inquiry form
  LanguageSwitcher.vue        # Language selector with flags
  PetDisplay.vue              # Pet visualization
  PetStats.vue                # Pet stats display
  PetLeaderboardMini.vue      # Mini leaderboard widget
  PetLeaderboardFull.vue      # Full leaderboard page
  EvolutionModal.vue          # Pet evolution modal
  CustomizePetModal.vue       # Pet customization
  CardModal.vue               # Card create/edit modal
  BattleArena.vue             # Battle game component
  Flashcard.vue               # Flashcard flip component
  ExamCard.vue               # Exam card component
  ExamResults.vue             # Exam results display
  Modal.vue                  # Base modal component
  AppButton.vue              # Reusable button
composables/              # Reusable composition functions
i18n/locales/             # Translation files (en.json, vi.json, zh.json)
layouts/                  # Page layouts (default.vue, landing.vue)
pages/                    # Route pages
  index.vue                # Landing page
  profile.vue              # User profile
  pet.vue                  # Pet management
  battle.vue               # Battle arena
  exam/[id].vue            # Exam page
  deck/[id].vue            # Deck study page
  leaderboard.vue          # Leaderboard
  settings.vue            # Settings
server/api/               # Nuxt server routes
  auth/
    register.post.ts      # User registration
    login.post.ts         # User login
    logout.post.ts        # User logout
    me.get.ts             # Get current user
    google.get.ts         # Google OAuth init
    google/callback.get.ts # Google OAuth callback
  user/
    data.get.ts           # Load user data from DB
    data.put.ts           # Save user data to DB
  inquiries/
    index.post.ts         # Submit inquiry
  decks/                   # Deck CRUD APIs
  pets/                    # Pet APIs
  leaderboard/              # Leaderboard API
server/db/
  schema.ts               # Drizzle ORM schema
  index.ts                # Database connection (auto-detects Neon vs local)
docker-compose.yml        # Local PostgreSQL setup
```

## Key Patterns

### Pinia Stores

- Use Options API style (`state`, `getters`, `actions`)
- Handle localStorage persistence in store actions
- Export types for external use

### Composables

- Return reactive state and functions
- No side effects at module level (except config)

### User Data Isolation

- User data is stored server-side in PostgreSQL
- `stores/auth.ts` loads user data via `loadUserData()` on login
- Data saved via PUT `/api/user/data` endpoint
- Each user sees only their own data by `userId`

### Database Schema Notes

- `users.id`: UUID type with `defaultRandom()`
- Foreign keys: `uuid` type for `user_id`
- Cards: Support `frontLang` and `backLang` (en, vi, zh)
- Pets: Support `abilityPoints` and `spentAbilityPoints`
- Inquiries: Store bug reports, feature requests, questions

### API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login with email/password |
| `/api/auth/logout` | POST | Logout user |
| `/api/auth/me` | GET | Get current user info |
| `/api/auth/google` | GET | Initiate Google OAuth |
| `/api/auth/google/callback` | GET | Google OAuth callback |
| `/api/user/data` | GET | Load all user data |
| `/api/user/data` | PUT | Save all user data |
| `/api/inquiries` | POST | Submit inquiry |
| `/api/decks` | GET/POST | List/create decks |
| `/api/decks/:id` | GET/PUT/DELETE | Deck operations |
| `/api/pets` | GET | Get user pet |
| `/api/pets/feed` | PUT | Feed pet |
| `/api/pets/create` | POST | Create pet |

### Pet Ability Points System

- Pets earn 2 ability points per level up
- Points can be allocated to: Attack, Defense, Health
- Health: 1 point = 2 HP
- Reset allowed at levels 10, 20, 30, ... (when all points spent)

### Card Language Selection

- Each card has `frontLang` and `backLang` (en, vi, zh)
- Default: English for both
- Allows mixed language cards (e.g., Chinese front, Vietnamese back)
