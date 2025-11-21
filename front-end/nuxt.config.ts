// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/devtools',
  ],

  // API configuration for backend
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'
    }
  },

  // CSS and styling
  css: [],

  // Vue configuration
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('ion-')
    }
  },

  // Nitro configuration for server-side rendering
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  }
})
