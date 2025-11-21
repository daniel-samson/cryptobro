<template>
  <header class="border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
    <div class="mx-auto max-w-7xl px-2 py-3 sm:px-4 sm:py-4 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
      <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <img
          src="/images/cryptobro-logo-v1.svg"
          alt="Cryptobro Logo"
          width="328"
          height="88"
          class="h-8 sm:h-10 md:h-12 w-auto"
          style="max-width: 150px;"
        />
      </NuxtLink>

      <div class="flex items-center gap-4">
        <form @submit.prevent="handleSearch" class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="w-32 sm:w-48 md:w-64 px-3 sm:px-4 py-2 pr-10 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
          <button
            type="submit"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// @ts-ignore - useRouter is auto-imported by Nuxt
const router = useRouter()
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`)
  }
}
</script>
