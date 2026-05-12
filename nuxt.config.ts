import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  ssr: false,

  // Workaround for Nuxt 4.4.4 vite-node IPC bug with ssr:false
  // See: https://github.com/nuxt/nuxt/issues/34957
  experimental: {
    viteEnvironmentApi: true,
  },

  app: {
    baseURL: '/tr-sphinx-guess/',
    head: {
      title: 'Number Guesser - Binary Search Helper',
      meta: [
        { name: 'description', content: 'A binary search helper that calculates the safe range of numbers to guess' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },

  css: ['~/assets/css/tailwind.css'],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        'class-variance-authority',
        'clsx',
        'lucide-vue-next',
        'reka-ui',
        'tailwind-merge',
      ],
    },
  },

  modules: ['@nuxtjs/i18n', 'shadcn-nuxt', '@vueuse/nuxt', '@nuxtjs/color-mode'],

  i18n: {
    defaultLocale: 'th',
    strategy: 'no_prefix',
    locales: [
      { code: 'th', name: 'ไทย', file: 'th.json' },
      { code: 'en', name: 'English', file: 'en.json' },
    ],
    detectBrowserLanguage: false,
  },

  colorMode: {
    classSuffix: '',
  },

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },
})
