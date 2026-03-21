# FlashLearn - Flashcard Web App

A polished, production-ready flashcard application built with Nuxt 3, designed with a strong focus on accessibility and usability for senior users.

## Features

- **Dashboard** - View and manage all your flashcard decks
- **Deck Management** - Create, edit, and delete decks
- **Card Management** - Add, edit, and delete flashcards with hints
- **Study Mode** - Interactive study sessions with spaced repetition feedback
- **Responsive Design** - Works great on desktop and mobile devices
- **Accessibility** - Keyboard navigation, WCAG-compliant colors, large touch targets

## Tech Stack

- Nuxt 3 (Vue 3 + Composition API)
- Pinia (State Management)
- TailwindCSS (Custom Design System)
- No external UI libraries (built custom UI)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
flash-card-app/
├── assets/
│   └── css/
│       └── main.css           # Global styles and Tailwind imports
├── components/
│   ├── AppButton.vue          # Reusable button component
│   ├── CardModal.vue          # Create/edit card modal
│   ├── CardPreview.vue        # Card preview in deck view
│   ├── DeckCard.vue           # Deck card component
│   ├── DeckModal.vue          # Create/edit deck modal
│   ├── Flashcard.vue          # Flashcard with flip animation
│   ├── Modal.vue              # Base modal component
│   └── ProgressBar.vue        # Progress indicator
├── composables/
│   ├── useLocalStorage.ts     # LocalStorage utility
│   └── useStudySession.ts     # Study session management
├── layouts/
│   └── default.vue            # Main layout with header
├── pages/
│   ├── index.vue              # Dashboard
│   ├── deck/
│   │   └── [id].vue           # Deck detail page
│   └── study/
│       └── [id].vue           # Study mode page
├── stores/
│   └── deck.ts                # Pinia store for decks and cards
├── nuxt.config.ts             # Nuxt configuration
└── tailwind.config.js         # Tailwind CSS configuration
```

## Design Principles

### Senior-Friendly UX

- **Large Typography** - Minimum 18px base font, 24px+ for important content
- **High Contrast** - WCAG AA compliant color combinations
- **Large Touch Targets** - Minimum 48px height for all interactive elements
- **Clear Spacing** - Generous padding and margins to reduce visual clutter
- **Simple Navigation** - Clear back buttons and breadcrumbs
- **Immediate Feedback** - Visual feedback on all interactions

### Color Palette

- Primary: Blue (#3B82F6)
- Success: Green (#22C55E)
- Warning: Amber (#F59E0B)
- Danger: Red (#EF4444)
- Background: Gray (#F9FAFB)

## Key Components

### Study Mode

The most important feature with:
- Large, centered card display
- Smooth 3D flip animation
- Four answer buttons: Again, Hard, Good, Easy
- Progress tracking
- Session completion statistics

### Card Flip Animation

Uses CSS 3D transforms for a smooth, performant flip effect:
```css
.card-flip {
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.flashcard.is-flipped {
  transform: rotateY(180deg);
}
```

## Data Storage

All data is stored in browser localStorage:
- Deck information
- Cards (front, back, hints)
- Study progress

No backend required - everything runs locally in the browser.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT
