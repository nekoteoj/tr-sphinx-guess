# OpenCode Instructions for `tr-sphinx-guess`

## Tech Stack & Commands
- **Framework**: Nuxt 4 in SPA mode (`ssr: false`).
- **Package Manager**: Use `pnpm` v11. Do not use `npm` or `yarn`.
- **Development**: `pnpm dev`
- **Build**: `pnpm build`
- **Preview**: `pnpm preview`
- **Lint**: `pnpm lint` (fix), `pnpm lint:check` (dry-run) — uses Biome.
- **No test framework** is configured. Rely on `pnpm build` for type-checking.

## Project Structure & Architecture
- **Source Code**: Located in `app/` (not `src/`). Single-page app with one route: `app/pages/index.vue`.
- **UI Components**: Built with `shadcn-vue`, `reka-ui`, and Tailwind CSS v4. Primitives in `app/components/ui/`.
- **State Management**: No Pinia. Global state is a singleton via Vue 3 Composition API in `app/composables/useGuesser.ts` (module-level reactive variables).
- **Internationalization**: `@nuxtjs/i18n` with `no_prefix` strategy. Locales in `i18n/locales/` (`th.json`, `en.json`). Default: Thai (`th`).
- **Dark Mode**: `@nuxtjs/color-mode`, class-based with empty `classSuffix`.

## Biome Conventions (`biome.json`)
- 2-space indent, 120 line width
- Double quotes, semicolons `asNeeded`, trailing commas `all`
- Import auto-organization on save
- `noVueDuplicateKeys` and `useAriaPropsForRole` rules disabled

## Git Commit Convention
- **Prefixes**: `feat:`, `fix:`, `chore:`, `docs:`, `style:`, `refactor:`, `ui:`
- **Subject**: Short, imperative mood (e.g., `refactor: extract distribution icons`)
- **Body**: Bullet points with `-` prefix, explaining what changed and why
- Example:
  ```
  refactor: extract distribution icons, simplify conditionals

  - Create DistributionIcon.vue to eliminate duplicated histogram SVGs
  - DistributionDialog.vue: replace 4 inline SVGs with component (134 -> 77 lines)
  - GuesserForm.vue: consolidate scattered v-if checks into single conditional block
  ```

## Quirks & Important Context
- **Nuxt/Vite Bug Workaround**: `nuxt.config.ts` has `experimental: { viteEnvironmentApi: true }`. Required for Nuxt 4.x `vite-node` IPC bug with `ssr: false`. Do not remove.
- **GitHub Pages Deployment**: Deploys via `.github/workflows/deploy.yml` on push to `main`. Build command: `pnpm nuxt build --preset github_pages` with `NUXT_APP_BASE_URL=/tr-sphinx-guess/`. The base URL `/tr-sphinx-guess/` is hardcoded in `nuxt.config.ts` — do not change it.
- **TypeScript**: Uses Nuxt-generated tsconfig references (`.nuxt/tsconfig.*.json`). Do not edit `tsconfig.json` manually.
