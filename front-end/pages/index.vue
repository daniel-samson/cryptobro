<template>
  <div>
    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <h2 class="mb-8 text-3xl font-bold text-foreground">Cryptocurrency Prices</h2>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="flex flex-col items-center gap-4">
            <div class="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
            <p class="text-lg text-muted-foreground">Loading cryptocurrency data...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="rounded-lg border border-destructive bg-destructive/10 p-6">
          <h3 class="mb-2 font-semibold text-destructive">Error loading data</h3>
          <p class="text-sm text-destructive">{{ error }}</p>
        </div>

        <!-- Coins Grid -->
        <div v-else-if="coins.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <NuxtLink v-for="coin in coins" :key="coin.id" :to="`/coins/${coin.symbol}`">
            <Card class="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg hover:ring-2 hover:ring-primary cursor-pointer bg-card text-card-foreground">
              <CardHeader class="pb-3">
                <div class="flex items-center gap-3">
                  <img v-if="coin.image" :src="coin.image" :alt="coin.name" class="h-8 w-8 rounded-full" />
                  <div class="flex-1 min-w-0">
                    <CardTitle class="text-lg">{{ coin.name }}</CardTitle>
                    <CardDescription>{{ coin.symbol.toUpperCase() }}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent class="flex-1">
                <p class="text-3xl font-bold text-primary text-right">{{ formatPrice(coin.price) }}</p>
              </CardContent>
            </Card>
          </NuxtLink>
        </div>

        <!-- Empty State -->
        <div v-else class="rounded-lg border border-border bg-muted py-12 text-center">
          <p class="text-lg text-muted-foreground">No cryptocurrency data available</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCoinGecko } from '@/app/composables/useCoinGecko'

interface Coin {
  id: string
  name: string
  symbol: string
  price: number
  image?: string
}

const { getCoins } = useCoinGecko()
const coins = ref<Coin[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fetchCoins = async () => {
  try {
    loading.value = true
    error.value = null
    coins.value = await getCoins()
  } catch (err: any) {
    error.value = err?.message || 'Failed to fetch cryptocurrency data. Make sure the backend is running.'
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

