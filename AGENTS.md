# OpenCode Instructions for `tr-sphinx-guess`

## Tech Stack & Commands
- **Framework**: Nuxt 4 in SPA mode (`ssr: false`).
- **Package Manager**: Use `pnpm` v9. Do not use `npm` or `yarn`.
- **Development**: `pnpm dev`
- **Build**: `pnpm build`
- **Preview**: `pnpm preview`

## Project Structure & Architecture
- **Source Code**: The main source code is located in the `app/` directory (not `src/`).
- **UI Components**: Built with `shadcn-vue`, `reka-ui`, and Tailwind CSS v4. Component primitives are located in `app/components/ui/`.
- **State Management**: Does not use Pinia. Global state is managed via a singleton pattern using Vue 3 Composition API in `app/composables/useGuesser.ts` (module-level reactive variables).
- **Internationalization**: Uses `@nuxtjs/i18n`. Translation files are located in `i18n/locales/` (`th.json`, `en.json`). Default language is Thai (`th`).

## Quirks & Important Context
- **Nuxt/Vite Bug Workaround**: `nuxt.config.ts` includes `experimental: { viteEnvironmentApi: true }`. This is a required workaround for a Nuxt 4.4.4 `vite-node` IPC bug when using `ssr: false`. Do not remove it.
- **GitHub Pages Deployment**: The app deploys to GitHub Pages via a GitHub Action. The base URL `/tr-sphinx-guess/` is hardcoded in `nuxt.config.ts` (`app.baseURL`). Do not change it, as client-side routing and static asset loading depend on it.
- **Tests & Linting**: There are currently no test or lint scripts configured in `package.json`. Rely on type-checking (`pnpm build`) for verification.