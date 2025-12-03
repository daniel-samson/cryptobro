<template>
  <div>
    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Search Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground mb-2">Search Results</h1>
        <p v-if="searchQuery" class="text-muted-foreground">Showing results for "{{ searchQuery }}"</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="flex flex-col items-center gap-4">
          <div class="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
          <p class="text-lg text-muted-foreground">Searching...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="rounded-lg border border-destructive bg-destructive/10 p-6">
        <h3 class="mb-2 font-semibold text-destructive dark:text-destructive-foreground">Error searching</h3>
        <p class="text-sm text-destructive dark:text-destructive-foreground">{{ error }}</p>
      </div>

      <!-- Results Table -->
      <div v-else-if="results.length > 0" class="rounded-lg border border-border bg-card">
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
                  <span class="font-medium text-foreground">{{ coin.name }}</span>
                </div>
              </TableCell>
              <TableCell>
                <span class="text-muted-foreground">{{ coin.symbol.toUpperCase() }}</span>
              </TableCell>
              <TableCell class="text-right">
                <span class="text-foreground">{{ formatPrice(coin.price) }}</span>
              </TableCell>
              <TableCell class="text-right">
                <span class="text-muted-foreground">{{ coin.market_cap ? formatPrice(coin.market_cap) : 'N/A' }}</span>
              </TableCell>
              <TableCell class="text-right">
                <Button variant="ghost" size="sm" class="text-primary hover:text-primary/80">
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- No Results -->
      <div v-else-if="searchQuery && !loading" class="rounded-lg border border-border bg-muted py-12 text-center">
        <p class="text-lg text-muted-foreground">No cryptocurrencies found for "{{ searchQuery }}"</p>
        <p class="text-sm text-muted-foreground/70 mt-2">Try searching with a different keyword</p>
      </div>

      <!-- No Search Query -->
      <div v-else class="rounded-lg border border-border bg-muted py-12 text-center">
        <p class="text-lg text-muted-foreground">Enter a search query to find cryptocurrencies</p>
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
  } catch (err: any) {
    error.value = err?.message || 'Failed to search cryptocurrencies. Please try again.'
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
  const query = route.query.q as string
  router.push(`/coins/${symbol.toLowerCase()}?from=search&q=${encodeURIComponent(query)}`)
}

// Watch for changes in the search query
watch(() => route.query.q, () => {
  performSearch()
})

onMounted(() => {
  performSearch()
})
</script>
