<p align="center">
  ✿ ✿ ✿
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

| Layer | Technology |
|---|---|
| Framework | Nuxt 4 (SPA mode, `ssr: false`) |
| UI Components | shadcn-vue + reka-ui |
| Styling | Tailwind CSS v4 |
| Internationalization | `@nuxtjs/i18n` (Thai, English) |
| Dark Mode | `@nuxtjs/color-mode` (class-based) |
| Icons | lucide-vue-next |
| Package Manager | pnpm |
| Deployment | GitHub Pages via GitHub Actions |

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
