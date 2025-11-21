<template>
  <div>
    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Search Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Search Results</h1>
        <p v-if="searchQuery" class="text-slate-400">Showing results for "{{ searchQuery }}"</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="flex flex-col items-center gap-4">
          <div class="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500"></div>
          <p class="text-lg text-slate-400">Searching...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="rounded-lg border border-red-700 bg-red-900 p-6">
        <h3 class="mb-2 font-semibold text-red-200">Error searching</h3>
        <p class="text-sm text-red-100">{{ error }}</p>
      </div>

      <!-- Results Table -->
      <div v-else-if="results.length > 0" class="rounded-lg border border-slate-800 bg-slate-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead class="text-right">Price</TableHead>
              <TableHead class="text-right">Market Cap</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="coin in results" :key="coin.id" class="cursor-pointer" @click="navigateToCoin(coin.symbol)">
              <TableCell>
                <div class="flex items-center gap-3">
                  <img v-if="coin.image" :src="coin.image" :alt="coin.name" class="h-8 w-8 rounded-full" />
                  <span class="font-medium text-white">{{ coin.name }}</span>
                </div>
              </TableCell>
              <TableCell>
                <span class="text-slate-400">{{ coin.symbol.toUpperCase() }}</span>
              </TableCell>
              <TableCell class="text-right">
                <span class="text-white">{{ formatPrice(coin.price) }}</span>
              </TableCell>
              <TableCell class="text-right">
                <span class="text-slate-400">{{ coin.market_cap ? formatPrice(coin.market_cap) : 'N/A' }}</span>
              </TableCell>
              <TableCell class="text-right">
                <Button variant="ghost" size="sm" class="text-blue-400 hover:text-blue-300">
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- No Results -->
      <div v-else-if="searchQuery && !loading" class="rounded-lg border border-slate-800 bg-slate-900 py-12 text-center">
        <p class="text-lg text-slate-400">No cryptocurrencies found for "{{ searchQuery }}"</p>
        <p class="text-sm text-slate-500 mt-2">Try searching with a different keyword</p>
      </div>

      <!-- No Search Query -->
      <div v-else class="rounded-lg border border-slate-800 bg-slate-900 py-12 text-center">
        <p class="text-lg text-slate-400">Enter a search query to find cryptocurrencies</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useCoinGecko } from '@/app/composables/useCoinGecko'

interface Coin {
  id: string
  name: string
  symbol: string
  price: number
  image?: string
  market_cap?: number
}

// @ts-ignore - useRoute and useRouter are auto-imported by Nuxt
const route = useRoute()
// @ts-ignore
const router = useRouter()
const { searchCoins } = useCoinGecko()

const searchQuery = ref('')
const results = ref<Coin[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const performSearch = async () => {
  const query = route.query.q as string
  searchQuery.value = query || ''

  if (!query || query.trim().length === 0) {
    results.value = []
    return
  }

  try {
    loading.value = true
    error.value = null
    results.value = await searchCoins(query)
  } catch (err) {
    error.value = 'Failed to search cryptocurrencies. Please try again.'
    console.error('Error searching coins:', err)
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

const navigateToCoin = (symbol: string) => {
  router.push(`/coins/${symbol.toLowerCase()}`)
}

// Watch for changes in the search query
watch(() => route.query.q, () => {
  performSearch()
})

onMounted(() => {
  performSearch()
})
</script>
