// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/devtools',
  ],

  // Component auto-import configuration
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
    {
      path: '~/components/ui',
      pathPrefix: false,
    },
  ],

  // API configuration for backend
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'
    }
  },

  // CSS and styling with Tailwind
  css: ['~/assets/css/globals.css'],

  // Vue configuration
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('ion-')
    }
  },

  // PostCSS configuration for Tailwind
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

})
