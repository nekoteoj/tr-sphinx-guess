# Number Guesser (Binary Search Helper) - Development Plan

## Project Overview

A Nuxt 3 SPA that helps users find the "safe range" of numbers to guess in a binary-search-style guessing game. Given a range `[lo, hi]` and `G` guesses remaining, it calculates which numbers are safe to pick (i.e., regardless of the oracle's response, you can still finish within the remaining guesses).

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Nuxt 3 (SPA mode, `ssr: false`) |
| UI Components | shadcn-vue (with Tailwind CSS v4) |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` |
| Dark Mode | `@vueuse/core` `useColorMode` + class-based toggle |
| Deployment | GitHub Pages via GitHub Actions (`github_pages` preset) |
| Package Manager | pnpm |

---

## Core Algorithm

The "safe range" logic:

```
Given range [lo, hi] (size N = hi - lo + 1) and G guesses remaining:

- Maximum numbers coverable with G guesses = 2^G - 1 (binary search worst case)
- A guess at position x splits [lo, hi] into:
  - Left part: [lo, x-1] of size (x - lo)
  - Right part: [x+1, hi] of size (hi - x)
- x is "safe" if BOTH:
  - (x - lo) <= 2^(G-1) - 1  (left part solvable in G-1 guesses)
  - (hi - x) <= 2^(G-1) - 1  (right part solvable in G-1 guesses)

Safe range: [lo + max(0, N - 2^(G-1)), hi - max(0, N - 2^(G-1))]

If N > 2^G - 1, it's impossible to guarantee finding the number.
If N <= 1, the game is already won (no guess needed).
```

### Derivation

- For a guess at position `x` to be safe, both sides must be solvable in `G-1` guesses
- Left side size: `x - lo` (must be <= `2^(G-1) - 1`)
- Right side size: `hi - x` (must be <= `2^(G-1) - 1`)
- Therefore: `x >= lo + (N - 2^(G-1))` and `x <= hi - (N - 2^(G-1))`
- Safe low = `lo + max(0, N - 2^(G-1))`
- Safe high = `hi - max(0, N - 2^(G-1))`
- If safe low > safe high, no safe guess exists (impossible)

---

## Project Structure

```
tr-sphinx-guess/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions for Pages deployment
├── app/
│   ├── assets/
│   │   └── css/
│   │       └── tailwind.css    # Tailwind imports
│   ├── components/
│   │   ├── ui/                 # shadcn-vue components (auto-generated)
│   │   ├── GuesserForm.vue     # Input form (range + guesses)
│   │   ├── SafeRange.vue       # Display safe range result
│   │   ├── GuessHistory.vue    # History of iterations
│   │   └── ThemeToggle.vue     # Dark/light mode toggle
│   ├── composables/
│   │   └── useGuesser.ts       # Core game logic & state
│   ├── layouts/
│   │   └── default.vue         # Main layout with header
│   ├── pages/
│   │   └── index.vue           # Main page
│   └── app.vue                 # Root app component
├── public/
│   └── .nojekyll               # Required for GitHub Pages
├── nuxt.config.ts
├── package.json
├── tsconfig.json
└── components.json             # shadcn-vue config
```

---

## Implementation Steps

### Phase 1: Project Setup

- [ ] 1. Initialize Nuxt 3 project with `pnpm create nuxt@latest`
- [ ] 2. Install Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`)
- [ ] 3. Install and configure `shadcn-nuxt` module
- [ ] 4. Run `shadcn-vue init` and add needed components (Button, Input, Card, Badge, Alert, Separator, Label)
- [ ] 5. Configure `nuxt.config.ts` for SPA mode (`ssr: false`)
- [ ] 6. Add `.nojekyll` to `public/`
- [ ] 7. Verify dev server starts correctly

### Phase 2: Core Logic (`composables/useGuesser.ts`)

- [ ] 8. Implement the safe range calculation function
- [ ] 9. Implement state management:
  - `rangeLow`, `rangeHigh` (current range)
  - `totalGuesses` (initial guess count)
  - `guessesLeft` (remaining guesses)
  - `history` (array of past iterations)
  - Computed: `safeRange`, `isPossible`, `isWon`
- [ ] 10. Implement `submitOracleResponse(newLow, newHigh)` — updates range and decrements guesses
- [ ] 11. Implement `reset()` — restores defaults

### Phase 3: UI Components

- [ ] 12. **ThemeToggle.vue** — Dark/light mode toggle button
- [ ] 13. **GuesserForm.vue** — Inputs for range [lo, hi] and guesses remaining, with validation
- [ ] 14. **SafeRange.vue** — Displays the safe range (or "impossible" warning, or "won" state)
- [ ] 15. **GuessHistory.vue** — Shows past iterations in a timeline/list
- [ ] 16. **default.vue layout** — Header with title + theme toggle, responsive container

### Phase 4: Main Page (`pages/index.vue`)

- [ ] 17. Compose all components into the main page
- [ ] 18. Handle the "iteration" flow:
  - Show current range + guesses left + safe range
  - User inputs oracle response (new range)
  - State updates, history appends
- [ ] 19. Reset button functionality
- [ ] 20. Mobile-responsive layout (Tailwind responsive utilities)

### Phase 5: Deployment

- [ ] 21. Create GitHub Actions workflow (`.github/workflows/deploy.yml`)
- [ ] 22. Configure `NUXT_APP_BASE_URL` / `app.baseURL` for the repo slug
- [ ] 23. Initialize git repo, add `.gitignore`, and make initial commit

---

## UI/UX Design Notes

- **Mobile-first**: Single column layout on mobile, centered card on desktop
- **Modern aesthetic**: Clean cards with subtle shadows, rounded corners, smooth transitions
- **Color scheme**: Neutral base with accent color (blue/indigo) for safe range highlight
- **States clearly communicated**:
  - Green highlight = safe range available (comfortable margin)
  - Yellow/amber = range is tight (safe range is small)
  - Red alert = impossible to guarantee finishing
  - Celebration state when range narrows to 1 number (won!)
- **Dark mode**: Class-based toggling via `dark:` Tailwind variants
- **Typography**: Clean, modern sans-serif; monospace for numbers

---

## GitHub Pages Deployment

The GitHub Actions workflow will:
1. Checkout code
2. Setup Node 20 + pnpm
3. Install dependencies
4. Build with `npx nuxt build --preset github_pages` (with `NUXT_APP_BASE_URL` set)
5. Upload artifact and deploy to Pages

For SPA mode with client-side routing on GitHub Pages:
- The `github_pages` preset handles creating `404.html` fallback
- Must set `app.baseURL` to `'/tr-sphinx-guess/'` in `nuxt.config.ts`

---

## Key Considerations

1. **SPA + GitHub Pages routing**: The `github_pages` preset with `ssr: false` generates `404.html` fallback for client-side routing
2. **Base URL**: Must set `app.baseURL` to `'/tr-sphinx-guess/'` for assets to load correctly on `username.github.io/tr-sphinx-guess/`
3. **No server-side logic needed**: All computation is pure client-side math
4. **Input validation**: Prevent invalid ranges (lo > hi), non-positive guesses, new range must be subset of current range
5. **Edge cases**:
   - Range of size 1 = already found the number
   - 0 guesses left but range > 1 = failed
   - Very large ranges with few guesses = impossible from the start

---

## shadcn-vue Components Needed

- `Button` — Actions (submit, reset)
- `Card` — Main content containers
- `Input` — Number inputs
- `Label` — Form labels
- `Badge` — Status indicators
- `Alert` — Warning/error messages
- `Separator` — Visual dividers

---

## Nuxt Config Summary

```ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',
  app: {
    baseURL: '/tr-sphinx-guess/',
  },
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ['shadcn-nuxt', '@vueuse/nuxt'],
  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },
})
```
