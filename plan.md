# Cute Brutalism Redesign Plan

## Context and Goals

Transform the current soft pastel UI into a "cute brutalism" aesthetic — thick borders, hard offset shadows, flat colors, with a mixed pastel palette on warm cream surfaces. Dark mode becomes deep charcoal with neon pastel glow accents.

## Branch

`feat/cute-brutalism`

## Design Tokens and Foundations

### Light Mode Surface

| Token         | Hex       | Usage                          |
|---------------|-----------|--------------------------------|
| background    | `#FBFBF9` | Warm cream page background     |
| foreground    | `#1C293C` | Near-black text                |
| card          | `#FFFFFF` | Pure white cards               |
| muted         | `#F5F3EF` | Slightly warm gray stat boxes  |
| border        | `#1C293C` | All borders (light mode)       |

### Pastel Accent Palette

| Token         | Hex       | Pastel Vibe | Usage                          |
|---------------|-----------|-------------|--------------------------------|
| primary       | `#A7D8F0` | Baby blue   | Main buttons, active states    |
| secondary     | `#F8C8DC` | Soft pink   | Secondary actions, tags        |
| accent        | `#C5E99E` | Mint green  | Highlights, success            |
| destructive   | `#FF8B94` | Salmon red  | Errors, game over              |
| warning       | `#FFE082` | Custard     | Warnings, impossible           |
| info          | `#D4BBFF` | Lavender    | Info cards, hints              |

### Dark Mode Surface

| Token         | Hex       | Usage                          |
|---------------|-----------|--------------------------------|
| background    | `#1A1A2E` | Deep charcoal-navy             |
| foreground    | `#FFF5F7` | Warm white text                |
| card          | `#16213E` | Slightly lighter navy card     |
| border        | `#FFFFFF` | White borders (dark mode)      |

### Dark Mode Neon Accents

| Token         | Hex       | Effect                         |
|---------------|-----------|--------------------------------|
| primary       | `#7ECBF0` | Glowing baby blue              |
| secondary     | `#FF9EBE` | Neon pink                      |
| accent        | `#B8E986` | Neon mint                      |
| destructive   | `#FF6B75` | Bright salmon                  |
| warning       | `#FFD54F` | Neon custard                   |
| info          | `#BB86FC` | Neon lavender                  |

### Shadows (Brutalist)

- All cards: `4px 4px 0 0 #1C293C` (light) / `4px 4px 0 0 #000` (dark)
- Buttons: `3px 3px 0 0 #1C293C` (light) / `3px 3px 0 0 #000` (dark)
- Inputs: `2px 2px 0 0 #1C293C` (light) / `2px 2px 0 0 #000` (dark)
- No blur, no gradients — pure hard offset.

### Border Radius

- Changed from `0.75rem` (12px) to `0.375rem` (6px) — "cute brutalism" sticker corners.

## Component Migration Tracker

| Component                  | Status      | Notes                                        |
|----------------------------|-------------|----------------------------------------------|
| `tailwind.css`             | done        | Full token rewrite                           |
| `Button` (primitive)       | done        | Thick border, hard shadow, translate hover     |
| `Card` (primitive)         | done        | Thick border, hard shadow                      |
| `Input` (primitive)        | done        | Thick border, hard shadow                      |
| `Badge` (primitive)        | done        | Thick border, hard shadow, rounded-md          |
| `Alert` (primitive)        | done        | Thick border, hard shadow                      |
| `Dialog` (primitive)       | done        | Thick border, hard shadow                      |
| `default.vue` (layout)    | done        | Remove blur, brutalist header bar              |
| `SafeRange.vue`            | done        | Hard-edged animation, neon glow dark mode      |
| `GuesserForm.vue`          | done        | Flat pastels, thick borders on all elements    |
| `GuessHistory.vue`         | done        | Sticker-style entries, flat colors             |
| `AlgorithmDialog.vue`      | done        | Dialog styling, SVG recoloring                 |
| `DistributionDialog.vue`   | done        | Dialog styling                                 |
| `ThemeToggle.vue`          | done        | Brutalist icon button                          |
| `LanguageToggle.vue`       | done        | Brutalist icon button                          |
| `GithubButton.vue`         | done        | Brutalist icon button                          |

## Commit Log

| #   | Commit Message                              | Status      |
|-----|---------------------------------------------|-------------|
| 1   | Update design tokens (tailwind.css)         | done (990f2c6) |
| 2   | Update core UI primitives (Button, Card, etc) | done (bb3c825) |
| 3   | Update layout and global components           | done (dc598ea) |
| 4   | Update SafeRange.vue + custom animations      | done (7b7d5bd) |
| 5   | Update GuesserForm.vue + GuessHistory.vue     | done (6a1da78) |
| 6   | Update Dialogs + remaining components         | done (e4822d0) |
| 7   | Final polish, QA, and plan.md completion    | done (684f755) |
| 8   | Fix UI polish issues from review            | done (6261a4a) |

## QA Checklist

### Visual
- [x] Every card has `border-2` + black offset shadow.
- [x] Every button has `border-2` + black offset shadow + hover/active translate.
- [x] Every input has `border-2` + black offset shadow.
- [x] No soft `shadow-sm` or `shadow-md` remains.
- [x] No transparent pastel backgrounds (`bg-*-100/50`) remain.
- [x] No `backdrop-blur` remains in the layout.
- [x] Border radius consistently ~6px.
- [x] Dark mode uses deep navy + neon pastels + black shadows.
- [x] Light mode uses warm cream + soft pastels + near-black shadows.
- [x] The auto-pick glow card has a brutalist interpretation (hard-edged color cycle).

### Functional
- [x] All buttons work (hover, active, disabled).
- [x] Dialogs open/close correctly.
- [x] Theme toggle works.
- [x] Language toggle works.
- [x] Form validation displays correctly.
- [x] `pnpm build` passes.
- [x] `pnpm lint:check` passes.

### Accessibility
- [x] Focus rings visible on all interactive elements.
- [x] Color contrast passes WCAG 2.2 AA.
- [x] Reduced motion preference respected.
