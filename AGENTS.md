# AGENTS.md

This document provides guidance for AI agents working in this repository.

## Project Overview

- **Type**: Full-stack Vue.js web application (Nuxt 3)
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom component classes
- **State Management**: Pinia
- **Database**: Neon PostgreSQL with Drizzle ORM (server-side only)
- **i18n**: @nuxtjs/i18n for multi-language support

## Build Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Production
npm run build        # Build for production
npm run preview      # Preview production build
npm run generate     # Generate static site

# Database
npm run db:migrate   # Push schema to Neon (drizzle-kit push)

# Type Checking (Nuxt includes TS in build process)
# No explicit type-check script - run build to check
```

## Testing

**Not configured.** No test framework set up. If adding tests, use Vitest with native Vite integration for Nuxt 3.

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

```vue
<div
  role="button"
  tabindex="0"
  aria-label="Close modal"
  @click="close"
  @keydown.enter="close"
  @keydown.escape="close"
/>
```

### CSS & Tailwind

- Global styles in `assets/css/main.css` using `@layer components`
- Use Tailwind utilities; custom classes sparingly
- Component overrides: `<style scoped>`
- Base font size: `18px` (senior-friendly design)

## Directory Structure

```
assets/css/main.css    # Global styles, Tailwind imports
components/            # Vue components (PascalCase)
composables/           # Reusable composition functions
i18n/locales/          # Translation files (en.json, vi.json, zh.json)
layouts/               # Page layouts (default.vue, landing.vue)
pages/                 # Route pages
server/api/            # Nuxt server routes (auth, pets, decks, leaderboard)
server/db/             # Drizzle schema and connection
stores/                # Pinia stores (deck.ts, pet.ts, auth.ts)
types/                 # TypeScript types
public/data/           # Pre-built deck JSON files
```

## Key Patterns

### Pinia Stores

- Use Options API style (`state`, `getters`, `actions`)
- Handle localStorage persistence in store actions
- Export types for external use

### Composables

- Return reactive state and functions
- No side effects at module level (except config)

### Database Notes

- `users.id`: Integer type, manual ID generation
- Foreign keys: `text` type for `user_id`
- Primary keys: Use `uuidv4()` for UUIDs
- Neon results: Access via `.rows` array

### API Routes

- Use Nuxt server routes in `server/api/`
- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- Pets: `/api/pets`, `/api/pets/create`, `/api/pets/feed`
- Decks: `/api/decks`, `/api/decks/:id`
