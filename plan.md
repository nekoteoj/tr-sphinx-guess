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
| `tailwind.css`             | pending     | Full token rewrite                           |
| `Button` (primitive)       | pending     | Thick border, hard shadow, translate hover     |
| `Card` (primitive)         | pending     | Thick border, hard shadow                      |
| `Input` (primitive)        | pending     | Thick border, hard shadow                      |
| `Badge` (primitive)        | pending     | Thick border, hard shadow, rounded-md          |
| `Alert` (primitive)        | pending     | Thick border, hard shadow                      |
| `Dialog` (primitive)       | pending     | Thick border, hard shadow                      |
| `default.vue` (layout)    | pending     | Remove blur, brutalist header bar              |
| `SafeRange.vue`            | pending     | Hard-edged animation, neon glow dark mode      |
| `GuesserForm.vue`          | pending     | Flat pastels, thick borders on all elements    |
| `GuessHistory.vue`         | pending     | Sticker-style entries, flat colors             |
| `AlgorithmDialog.vue`      | pending     | Dialog styling, SVG recoloring                 |
| `DistributionDialog.vue`   | pending     | Dialog styling                                 |
| `ThemeToggle.vue`          | pending     | Brutalist icon button                          |
| `LanguageToggle.vue`       | pending     | Brutalist icon button                          |
| `GithubButton.vue`         | pending     | Brutalist icon button                          |

## Commit Log

| #   | Commit Message                              | Status      |
|-----|---------------------------------------------|-------------|
| 1   | Update design tokens (tailwind.css)         | pending     |
| 2   | Update core UI primitives (Button, Card, etc) | pending     |
| 3   | Update layout and global components           | pending     |
| 4   | Update SafeRange.vue + custom animations      | pending     |
| 5   | Update GuesserForm.vue + GuessHistory.vue     | pending     |
| 6   | Update Dialogs + remaining components         | pending     |
| 7   | Final polish, QA, and plan.md completion      | pending     |

## QA Checklist

### Visual
- [ ] Every card has `border-2` + black offset shadow.
- [ ] Every button has `border-2` + black offset shadow + hover/active translate.
- [ ] Every input has `border-2` + black offset shadow.
- [ ] No soft `shadow-sm` or `shadow-md` remains.
- [ ] No transparent pastel backgrounds (`bg-*-100/50`) remain.
- [ ] No `backdrop-blur` remains in the layout.
- [ ] Border radius consistently ~6px.
- [ ] Dark mode uses deep navy + neon pastels + black shadows.
- [ ] Light mode uses warm cream + soft pastels + near-black shadows.

### Functional
- [ ] All buttons work (hover, active, disabled).
- [ ] Dialogs open/close correctly.
- [ ] Theme toggle works.
- [ ] Language toggle works.
- [ ] Form validation displays correctly.
- [ ] `pnpm build` passes.
- [ ] `pnpm lint:check` passes.

### Accessibility
- [ ] Focus rings visible on all interactive elements.
- [ ] Color contrast passes WCAG 2.2 AA.
- [ ] Reduced motion preference respected.
