<template>
  <header class="border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
    <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <img
          src="/images/cryptobro-logo-v1.svg"
          alt="Cryptobro Logo"
          width="328"
          height="88"
          class="h-12 w-auto"
          style="max-width: 200px;"
        />
      </NuxtLink>

      <nav class="flex items-center gap-6">
        <NuxtLink
          to="/"
          class="text-sm font-medium text-white hover:text-blue-400 transition-colors"
        >
          Home
        </NuxtLink>
        <a
          href="https://www.coingecko.com"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm font-medium text-white hover:text-blue-400 transition-colors"
        >
          CoinGecko
        </a>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
// Header component with logo and navigation
</script>
