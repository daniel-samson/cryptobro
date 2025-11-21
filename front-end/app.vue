<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
    <Header />
    <main class="flex-1">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'

useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon/favicon-96x96.png',
      sizes: '96x96',
    },
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon/favicon.svg',
    },
    {
      rel: 'shortcut icon',
      href: '/favicon/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/favicon/apple-touch-icon.png',
    },
    {
      rel: 'manifest',
      href: '/favicon/site.webmanifest',
    },
  ],
})
</script>
