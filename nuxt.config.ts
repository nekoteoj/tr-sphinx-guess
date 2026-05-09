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
      htmlAttrs: {
        lang: 'en',
      },
    },
  },

  css: ['~/assets/css/tailwind.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ['shadcn-nuxt', '@vueuse/nuxt', '@nuxtjs/color-mode'],

  colorMode: {
    classSuffix: '',
  },

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },
})
