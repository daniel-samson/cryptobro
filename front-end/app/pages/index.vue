<template>
  <div class="home">
    <header>
      <h1>Cryptobro</h1>
      <p>Cryptocurrency Price Tracker</p>
    </header>

    <main>
      <section class="coins-section">
        <h2>Cryptocurrency Prices</h2>
        <div class="loading" v-if="loading">Loading cryptocurrency data...</div>
        <div class="error" v-else-if="error">{{ error }}</div>
        <div class="coins-grid" v-else-if="coins.length">
          <div class="coin-card" v-for="coin in coins" :key="coin.id">
            <h3>{{ coin.name }}</h3>
            <p class="symbol">{{ coin.symbol.toUpperCase() }}</p>
            <p class="price">{{ formatPrice(coin.price) }}</p>
          </div>
        </div>
        <div class="empty" v-else>No cryptocurrency data available</div>
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

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

header {
  padding: 2rem;
  color: white;
  text-align: center;
}

header h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

header p {
  font-size: 1.25rem;
  opacity: 0.9;
}

main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.coins-section h2 {
  color: white;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.coins-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.coin-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.coin-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.coin-card h3 {
  margin: 0 0 0.5rem;
  color: #333;
  font-size: 1.5rem;
}

.symbol {
  color: #666;
  font-size: 0.875rem;
  text-transform: uppercase;
  font-weight: 600;
  margin: 0.5rem 0 1rem;
}

.price {
  font-size: 1.75rem;
  font-weight: 700;
  color: #667eea;
  margin: 0;
}

.loading,
.error,
.empty {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  color: #666;
  font-size: 1.1rem;
}

.error {
  color: #e74c3c;
  background: #fadbd8;
}
</style>
