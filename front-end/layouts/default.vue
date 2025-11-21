<template>
  <div class="min-h-screen flex flex-col">
    <!-- Main content area -->
    <div class="flex-1">
      <slot />
    </div>

    <!-- Footer -->
    <footer class="border-t border-slate-800 bg-slate-900 mt-12">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center gap-4 text-center">
          <p class="text-slate-300">
            Real-time cryptocurrency price tracker
            <span class="font-semibold text-white"> Powered by CoinGecko</span>
          </p>
          <p class="text-sm text-slate-500">© {{ new Date().getFullYear() }} Cryptobro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Default layout for all pages
</script>