<p align="center">
  <img src="https://img.shields.io/badge/💖-Made%20with%20Love-ffb6c1?style=for-the-badge" alt="Made with Love">
</p>

<h1 align="center">✿ tr-sphinx-guess ✿</h1>

<p align="center">
  🎀 A binary search helper for number-guessing games~ 🎀
</p>

<p align="center">
  Given a number range and a limited number of guesses, it calculates the <b>safe range</b> — the set of numbers you can guess while guaranteeing you can still find the answer within your remaining tries, no matter how the oracle responds ♡
</p>

<p align="center">
  🌸 Inspired by the TalesRunner 19th anniversary event~ 🌸
</p>

<p align="center">
  🌐 <b>Live demo:</b> <a href="https://nekoteoj.github.io/tr-sphinx-guess/">nekoteoj.github.io/tr-sphinx-guess</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/🌙-Dark%20Mode-ffb6c1?style=for-the-badge" alt="Dark Mode">
  <img src="https://img.shields.io/badge/🇹🇭🇬🇧-i18n-ffb6c1?style=for-the-badge" alt="i18n">
  <img src="https://img.shields.io/badge/📱-Mobile%20Ready-ffb6c1?style=for-the-badge" alt="Mobile Ready">
  <img src="https://img.shields.io/badge/✨-SPA%20Mode-ffb6c1?style=for-the-badge" alt="SPA Mode">
</p>

<p align="center">
  ✿ ✿ ✿
</p>

---

## 💭 How It Works 💭

Given a range `[lo, hi]` (size `N`) and `G` guesses remaining:

- 🔮 A guess at position `x` is **safe** if both sides of the split are solvable in `G-1` guesses
- ✨ Maximum numbers coverable with `G` guesses = `2^G - 1`
- 📐 Safe range formula:
  ```
  offset   = max(0, N - 2^(G-1))
  safeLow  = lo + offset
  safeHigh = hi - offset
  ```
- 🚫 If `N > 2^G - 1`, it is impossible to guarantee finding the number

🔄 The app guides you through each iteration: enter the narrowed range the oracle gives you after each guess, and it recalculates the safe range for the next step~

---

## 🌸 Features 🌸

- 🎯 Safe range calculation with comfort level indicators (comfortable / moderate / tight / impossible)
- 📝 Step-by-step iteration with a full guess history log
- 💡 "How it works" modal with algorithm explanation and SVG visualizations
- 🇹🇭🇬🇧 Thai / English language support
- 🌙☀️ Light / dark theme toggle
- 📱 Mobile-responsive layout

---

## 🛠️ Tech Stack 🛠️

<p align="center">
  <img src="https://img.shields.io/badge/Nuxt%204-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white&labelColor=ffb6c1" alt="Nuxt 4">
  <img src="https://img.shields.io/badge/Vue%203-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white&labelColor=ffb6c1" alt="Vue 3">
  <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white&labelColor=ffb6c1" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=ffb6c1" alt="TypeScript">
  <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white&labelColor=ffb6c1" alt="pnpm">
  <img src="https://img.shields.io/badge/shadcn--vue-000000?style=for-the-badge&labelColor=ffb6c1" alt="shadcn-vue">
  <img src="https://img.shields.io/badge/reka--ui-7C3AED?style=for-the-badge&logoColor=white&labelColor=ffb6c1" alt="reka-ui">
  <img src="https://img.shields.io/badge/lucide--vue-FF6B6B?style=for-the-badge&labelColor=ffb6c1" alt="lucide-vue">
  <img src="https://img.shields.io/badge/GitHub%20Pages-181717?style=for-the-badge&logo=github&logoColor=white&labelColor=ffb6c1" alt="GitHub Pages">
</p>

---

## 🚀 Getting Started 🚀

**Prerequisites:** Node.js 20+, pnpm 9+

```bash
# 📦 Install dependencies
pnpm install

# 💻 Start development server at http://localhost:3000
pnpm dev
```

### Other commands

```bash
# 🏗️ Type-check and build for production
pnpm build

# 👀 Preview the production build locally
pnpm preview

# 📤 Generate static output
pnpm generate
```

---

## 📦 Deployment 📦

The project deploys automatically to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`.

It uses the Nuxt `github_pages` preset, which generates a `404.html` fallback for client-side routing. The base URL is set to `/tr-sphinx-guess/` via the `NUXT_APP_BASE_URL` environment variable in CI.

---

## 📁 Project Structure 📁

```
tr-sphinx-guess/
├── app/
│   ├── components/
│   │   ├── AlgorithmDialog.vue   # 💡 "How it works" modal with math + SVG diagrams
│   │   ├── GuesserForm.vue       # 🎮 Setup form (range + guesses) and oracle response form
│   │   ├── GuessHistory.vue      # 📜 Scrollable log of past iterations
│   │   ├── LanguageToggle.vue    # 🌐 TH/EN language switcher
│   │   ├── SafeRange.vue         # 🎯 Safe range status card
│   │   ├── ThemeToggle.vue       # 🌙 Light/dark mode toggle
│   │   └── ui/                   # 🧩 shadcn-vue UI primitives
│   ├── composables/
│   │   └── useGuesser.ts         # ⚙️ Core algorithm, game state, and actions
│   ├── layouts/
│   │   └── default.vue           # 🖼️ App shell (header, footer)
│   └── pages/
│       └── index.vue             # 🏠 Main page
├── i18n/
│   └── locales/
│       ├── en.json               # 🇬🇧 English translations
│       └── th.json               # 🇹🇭 Thai translations
├── public/
│   └── .nojekyll
└── nuxt.config.ts
```

<p align="center">
  💕 Made with love and lots of sparkles ✨💕
</p>
