<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
    <!-- Header -->
    <header class="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold text-white">Cryptobro</h1>
            <p class="mt-2 text-slate-400">Real-time cryptocurrency price tracker</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-slate-500">Powered by CoinGecko API</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section>
        <h2 class="mb-8 text-3xl font-bold text-white">Cryptocurrency Prices</h2>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="flex flex-col items-center gap-4">
            <div class="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500"></div>
            <p class="text-lg text-slate-400">Loading cryptocurrency data...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="rounded-lg border border-red-900 bg-red-950/20 p-6">
          <h3 class="mb-2 font-semibold text-red-200">Error loading data</h3>
          <p class="text-sm text-red-300">{{ error }}</p>
        </div>

        <!-- Coins Grid -->
        <div v-else-if="coins.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card v-for="coin in coins" :key="coin.id" class="flex flex-col overflow-hidden transition-all hover:shadow-lg hover:shadow-blue-500/20">
            <CardHeader class="pb-3">
              <CardTitle class="text-lg text-white">{{ coin.name }}</CardTitle>
              <CardDescription>{{ coin.symbol.toUpperCase() }}</CardDescription>
            </CardHeader>
            <CardContent class="flex-1">
              <p class="text-3xl font-bold text-blue-400">{{ formatPrice(coin.price) }}</p>
            </CardContent>
          </Card>
        </div>

        <!-- Empty State -->
        <div v-else class="rounded-lg border border-slate-800 bg-slate-900/50 py-12 text-center">
          <p class="text-lg text-slate-400">No cryptocurrency data available</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const config = useRuntimeConfig()

interface Coin {
  id: string
  name: string
  symbol: string
  price: number
}

const coins = ref<Coin[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fetchCoins = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await $fetch(`${config.public.apiBaseUrl}/v1/coins`)
    coins.value = response.data || []
  } catch (err) {
    error.value = 'Failed to fetch cryptocurrency data. Make sure the backend is running.'
    console.error('Error fetching coins:', err)
  } finally {
    loading.value = false
  }
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

onMounted(() => {
  fetchCoins()
})
</script>

