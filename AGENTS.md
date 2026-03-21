# AGENTS.md

This document provides guidance for AI agents working in this repository.

## Project Overview

- **Type**: Full-stack Vue.js web application (Nuxt 3)
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom component classes
- **State Management**: Pinia
- **Module Type**: ESM

## Build Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Other
npm run generate     # Generate static site
npm run postinstall  # Run nuxt prepare (auto-runs after install)
```

## Type Checking

Nuxt 3 includes TypeScript support. Type checking is integrated into the build process. No explicit type-check script is defined in package.json.

## Linting & Formatting

**Not configured.** There is no ESLint, Prettier, ruff, or other linting/formatting tools set up. When adding them, use:

- ESLint with Vue/TypeScript support
- Prettier with Vue and TypeScript plugins

## Testing

**Not configured.** No test framework (Jest, Vitest, etc.) is set up. When adding tests, use Vitest (native Vite integration with Nuxt 3).

### Scoring & Answer Tracking (Exam Mode)

The app uses a spaced-repetition-inspired scoring system with four difficulty levels. When testing study sessions, verify:

- **Scoring**: Each card answer records difficulty (`'again'`, `'hard'`, `'good'`, `'easy'`) via `nextCard(difficulty)`
- **Stats**: `getSessionStats()` returns `{ again, hard, good, easy, total }` counts
- **Score calculation**: `(easy * 4 + good * 3 + hard * 2 + again * 1) / (total * 4) * 100` gives a percentage
- **Key behaviors to test**:
  - `startSession(cards)` shuffles and resets state
  - `nextCard()` records answer, advances index, flips card back
  - `nextCard()` on last card sets `sessionComplete = true`
  - `restartSession()` re-shuffles same deck
  - `resetSession()` clears all state

## Code Style Guidelines

### Vue Components

- Use `<script setup lang="ts">` for all components
- Single-file component structure: `<template>` → `<script setup>` → `<style scoped>`
- Component names: **PascalCase** (e.g., `CardModal.vue`, `AppButton.vue`)
- Props definition: Use TypeScript interface with `withDefaults`

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
2. Nuxt auto-imports (`~/composables/*`, `~/stores/*`)
3. Type imports (`import type { Card } from '...'`)

### Naming Conventions

| Element          | Convention        | Example                              |
|------------------|-------------------|--------------------------------------|
| Components       | PascalCase        | `CardModal.vue`                      |
| Composables      | `use` + PascalCase| `useLocalStorage.ts`, `useStudySession.ts` |
| Pinia Stores     | `use` + PascalCase| `useDeckStore` (in `deck.ts`)        |
| TypeScript Types | PascalCase        | `Card`, `Deck`, `Props`              |
| Props            | camelCase         | `modelValue`, `isFlipped`, `showCloseButton` |
| Events           | camelCase         | `update:modelValue`, `click`, `save`  |

### TypeScript

- Always define types for component props, emits, and store state
- Use TypeScript interfaces (not type aliases) for object shapes
- Use strict typing; avoid `any`
- Use optional properties (`?`) for non-required fields

```typescript
interface Card {
  id: string
  front: string
  back: string
  createdAt: Date
}

interface Deck {
  id: string
  name: string
  description: string
  cards: Card[]
  createdAt: Date
}
```

### Error Handling

- Wrap localStorage/async operations in try/catch
- Check for `window` availability before browser APIs
- Log errors with `console.error` and descriptive messages

```typescript
loadFromStorage() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('flashcard-decks')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        this.decks = parsed.map((deck: any) => ({
          ...deck,
          createdAt: new Date(deck.createdAt),
        }))
      } catch (e) {
        console.error('Failed to load decks from storage:', e)
      }
    }
  }
}
```

### Accessibility

All interactive components must include:

- `role`, `tabindex`, `aria-label` attributes where appropriate
- `aria-modal="true"` on modals
- `aria-labelledby` pointing to the title element
- Keyboard support: Enter, Space for buttons; Escape for modals/overlays

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

- Global base styles and component classes in `assets/css/main.css`
- Use `@layer components` for reusable component classes (`.btn`, `.card`, `.input`)
- Use `@layer utilities` for custom utilities
- Use Tailwind utilities for component styling; add custom classes sparingly
- Component styles: use `<style scoped>` for component-specific overrides
- Font size: base is `18px` (senior-friendly design)

```css
@layer components {
  .btn {
    @apply px-6 py-4 rounded-xl font-semibold transition-all;
  }
  .card {
    @apply bg-white rounded-2xl shadow-lg p-8;
  }
}
```

## Directory Structure

```
assets/css/main.css    # Global styles, Tailwind imports, component classes
components/            # Vue components (AppButton, Flashcard, Modal, ExamCard, etc.)
composables/           # Reusable composition functions (useLocalStorage, useStudySession, useExamSession)
layouts/               # Page layouts (default.vue)
pages/                 # Route pages (index, stats, onboarding, deck/[id], study/[id], exam/[id])
stores/                # Pinia stores (deck.ts)
types/                 # TypeScript types (exam.ts, gamification.ts)
public/data/           # Pre-built deck JSON files (hskDecks.json, toeicDecks.json, generalDecks.json)
app.vue                # Root app component
nuxt.config.ts         # Nuxt configuration
tailwind.config.js     # Tailwind configuration
```

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Dashboard with stats bar, daily challenges, deck browsing |
| Stats | `/stats` | User profile with Chart.js progress charts, badges, exam history |
| Onboarding | `/onboarding` | 5-step tutorial with skip button for new users |
| Deck Detail | `/deck/[id]` | View deck, add/edit cards, start study or exam |
| Study | `/study/[id]` | Flashcard study mode with flip interaction |
| Exam | `/exam/[id]` | Timed exam with input or multiple-choice questions |

## Gamification System

### XP & Leveling

The app features an XP-based leveling system where users earn XP through:
- **Study sessions**: Completing study cards
- **Exams**: Base XP (50) + score bonus
- **Daily challenges**: Completing challenges for bonus XP
- **Badges**: Unlocking achievements for bonus XP

```typescript
// Level calculation (exponential growth)
calculateLevel(totalXP: number): number
calculateXPForLevel(level: number): number // level * 100 + level^2 * 10

// XP for next level
getXPForNextLevel(currentXP): { current, required, progress }

// Streak multiplier (max 2x at 10-day streak)
getStreakMultiplier(streak: number): number // min(1 + streak * 0.1, 2.0)
```

### Badges & Achievements

All badges defined in `types/gamification.ts`:

| Badge ID | Name | Category | XP Reward |
|----------|------|----------|-----------|
| first-steps | First Steps | milestone | 50 |
| streak-3 | Streak Starter | streak | 100 |
| streak-7 | Week Warrior | streak | 250 |
| streak-30 | Month Master | streak | 1000 |
| perfect-score | Perfect Score | exam | 200 |
| speed-demon | Speed Demon | exam | 100 |
| card-collector | Card Collector | study | 100 |
| deck-builder | Deck Builder | study | 200 |
| hsk-beginner | HSK Beginner | milestone | 300 |
| toeic-prep | TOEIC Prep | milestone | 300 |
| century | Century | study | 150 |
| marathon | Marathon | study | 500 |
| perfectionist | Perfectionist | exam | 500 |
| night-owl | Night Owl | social | 50 |
| early-bird | Early Bird | social | 50 |
| level-10 | Rising Star | milestone | 200 |
| level-25 | Dedicated Learner | milestone | 500 |
| level-50 | Expert | milestone | 1000 |

### Daily Challenges

Daily challenges are auto-generated each day from challenge templates. Progress is tracked and XP awarded upon completion.

```typescript
// Challenge templates
const CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  { id: 'daily-cards-10', type: 'cards', title: 'Quick Study', target: 10, xpReward: 30 },
  { id: 'daily-cards-30', type: 'cards', title: 'Card Champion', target: 30, xpReward: 75 },
  { id: 'daily-study-1', type: 'study', title: 'First Steps', target: 1, xpReward: 50 },
  { id: 'daily-exam-1', type: 'exam', title: 'Exam Ready', target: 1, xpReward: 100 },
  { id: 'weekly-cards-100', type: 'cards', title: 'Weekly Warrior', target: 100, xpReward: 200 },
]
```

### Pre-built Decks

Pre-built decks are loaded from JSON files in `public/data/`:

- `hskDecks.json` - HSK Chinese vocabulary (5 decks)
- `toeicDecks.json` - TOEIC English vocabulary (5 decks)
- `generalDecks.json` - General knowledge (3 decks)

Decks are **updatatable**: When JSON version changes, new cards are added to existing decks without duplicates.

```typescript
// Load pre-built decks
await deckStore.loadPrebuiltDecks()

// Check for updates
if (existingDeck.version !== data.version) {
  // Add new cards that don't exist in current deck
}
```

### Onboarding

New users see a 5-step onboarding tutorial:
1. Welcome to Learn by Game
2. Study with Flashcards
3. Take Timed Exams
4. Earn XP & Badges
5. You're All Set!

Users can skip via "Skip" button. Skip status stored in `userStats.onboardingCompleted`.

## Key Patterns

- **State management**: Pinia stores for global state; composables for reusable logic
- **Persistence**: localStorage via composables (`useLocalStorage`), stores handle their own persistence
- **Reactivity**: Vue 3 Composition API (`ref`, `reactive`, `computed`)
- **Study flow**: Create deck → Add cards → Study mode with flip interaction
- **Exam flow**: Create deck → Add cards → Exam mode with text input, timed answers, leaderboard tracking
- **Design**: Senior-friendly UX with large fonts (18px base), high contrast, clear navigation

### Exam Feature

The exam feature (`useExamSession`, `pages/exam/[id].vue`) provides:

- **Timed quizzes**: 30 seconds per card (configurable)
- **Two answer types**: User chooses before starting the exam:
  - **Type Answer**: Fill-in-the-blank with text input, compared case-insensitively
  - **Multiple Choice**: Pick from 4 options (A, B, C, D), options auto-generated from other cards' answers
- **Results-first flow**: Answer is recorded silently, user clicks "Submit & Next" to proceed
- **Answer tracking**: Visual dots show progress (green=correct, red=incorrect, gray=pending)
- **Results page**: Shown only after all questions answered, with full score breakdown
- **Auto-submit**: When timer runs out, empty answer submitted
- **Grading**: A (>=90%), B (>=80%), C (>=70%), D (>=60%), F (<60%)
- **Leaderboard**: Tracks best score, attempts, and history per deck

```typescript
// Answer comparison (case-insensitive, trimmed)
normalizeAnswer('  Hello World  ') === normalizeAnswer('hello world') // true

// Score calculation
score = (correct / total) * 100

// Grade thresholds
A >= 90%, B >= 80%, C >= 70%, D >= 60%, F < 60%

// ExamQuestionType
type ExamQuestionType = 'input' | 'multiple-choice'

// Generate MC options from deck answers
generateMultipleChoiceOptions(correctAnswer, allAnswers, currentCardId)
```
