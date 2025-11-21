<template>
  <div>
    <!-- Header Section -->
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="mb-6 inline-flex items-center gap-2 text-blue-400 hover:text-blue-300">
        <span>←</span>
        <span>Back to Cryptocurrencies</span>
      </NuxtLink>
    </div>

    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="flex flex-col items-center gap-4">
          <div class="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500"></div>
          <p class="text-lg text-slate-400">Loading cryptocurrency details...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="rounded-lg border border-red-700 bg-red-900 p-6">
        <h3 class="mb-2 font-semibold text-red-200">Error loading data</h3>
        <p class="text-sm text-red-100">{{ error }}</p>
      </div>

      <!-- Coin Details -->
      <div v-else-if="coin" class="space-y-8">
        <!-- Header -->
        <div class="flex items-center gap-6">
          <img v-if="coin.image" :src="coin.image" :alt="coin.name" class="h-16 w-16 rounded-full" />
          <div>
            <h1 class="text-4xl font-bold">{{ coin.name }}</h1>
            <p class="text-xl text-slate-400">{{ coin.symbol?.toUpperCase() }}</p>
          </div>
        </div>

        <!-- Price Info -->
        <Card>
          <CardHeader>
            <CardTitle>Current Price</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p class="text-sm text-slate-400">Current Price</p>
                <p class="text-2xl font-bold text-blue-400">{{ formatPrice(coin.price) }}</p>
              </div>
              <div>
                <p class="text-sm text-slate-400">Market Cap</p>
                <p class="text-2xl font-bold" :class="coin.market_data?.market_cap?.usd ? 'text-green-400' : 'text-slate-500'">
                  {{ coin.market_data?.market_cap?.usd ? formatPrice(coin.market_data.market_cap.usd) : 'N/A' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-slate-400">24h Volume</p>
                <p class="text-2xl font-bold" :class="coin.market_data?.total_volume?.usd ? 'text-green-400' : 'text-slate-500'">
                  {{ coin.market_data?.total_volume?.usd ? formatPrice(coin.market_data.total_volume.usd) : 'N/A' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-slate-400">24h Change</p>
                <p class="text-2xl font-bold" :class="getPriceChangeColor(coin.market_data?.price_change_percentage_24h)">
                  {{ coin.market_data?.price_change_percentage_24h ? formatPercentage(coin.market_data.price_change_percentage_24h) : 'N/A' }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Price Range -->
        <Card>
          <CardHeader>
            <CardTitle>24h Price Range</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <p class="text-sm text-slate-400">24h Low</p>
                <p class="text-2xl font-bold text-red-400">{{ coin.market_data?.low_24h?.usd ? formatPrice(coin.market_data.low_24h.usd) : 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm text-slate-400">24h High</p>
                <p class="text-2xl font-bold text-green-400">{{ coin.market_data?.high_24h?.usd ? formatPrice(coin.market_data.high_24h.usd) : 'N/A' }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Description -->
        <Card v-if="coin.description?.en">
          <CardHeader>
            <CardTitle>About {{ coin.name }}</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-slate-300" v-html="coin.description.en"></p>
          </CardContent>
        </Card>
      </div>

      <!-- Empty State -->
      <div v-else class="rounded-lg border border-slate-800 bg-slate-800 py-12 text-center">
        <p class="text-lg text-slate-400">Cryptocurrency not found</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCoinGecko } from '@/app/composables/useCoinGecko'

interface CoinDetails {
  id: string
  name: string
  symbol: string
  image?: string
  price?: number
  description?: {
    en?: string
  }
  market_data?: {
    current_price?: { usd?: number }
    market_cap?: { usd?: number }
    total_volume?: { usd?: number }
    high_24h?: { usd?: number }
    low_24h?: { usd?: number }
    price_change_24h?: number
    price_change_percentage_24h?: number
  }
}

const route = useRoute()
const { getCoinBySymbol } = useCoinGecko()
const coin = ref<CoinDetails | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const fetchCoinDetails = async () => {
  try {
    loading.value = true
    error.value = null
    const symbol = route.params.symbol as string
    console.log('Fetching coin details for symbol:', symbol)
    coin.value = await getCoinBySymbol(symbol)
    console.log('Coin data received:', coin.value)
    if (!coin.value) {
      error.value = `Cryptocurrency with symbol '${symbol}' not found`
    }
  } catch (err) {
    error.value = 'Failed to fetch cryptocurrency details. Make sure the backend is running.'
    console.error('Error fetching coin:', err)
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

const formatPercentage = (percentage: number): string => {
  const sign = percentage >= 0 ? '+' : ''
  return `${sign}${percentage.toFixed(2)}%`
}

const getPriceChangeColor = (change?: number): string => {
  if (!change) return 'text-slate-500'
  return change >= 0 ? 'text-green-400' : 'text-red-400'
}

onMounted(() => {
  fetchCoinDetails()
})
</script>
