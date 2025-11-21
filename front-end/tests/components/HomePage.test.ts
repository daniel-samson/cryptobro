import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'

// Mock the home page component for testing
const HomePage = defineComponent({
  template: `
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
  `,
  setup() {
    const coins = ref([])
    const loading = ref(true)
    const error = ref(null)

    const formatPrice = (price: number): string => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price)
    }

    return {
      coins,
      loading,
      error,
      formatPrice,
    }
  },
})

describe('HomePage', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = mount(HomePage)
  })

  it('should render the page header', () => {
    expect(wrapper.find('h1').text()).toBe('Cryptobro')
    expect(wrapper.find('header p').text()).toBe('Cryptocurrency Price Tracker')
  })

  it('should display loading state initially', () => {
    expect(wrapper.find('.loading').exists()).toBe(true)
    expect(wrapper.find('.loading').text()).toBe('Loading cryptocurrency data...')
  })

  it('should display coins when data is loaded', async () => {
    const coins = [
      { id: '1', name: 'Bitcoin', symbol: 'btc', price: 43000 },
      { id: '2', name: 'Ethereum', symbol: 'eth', price: 2300 },
    ]

    await wrapper.vm.coins = coins
    await wrapper.vm.loading = false

    expect(wrapper.find('.coins-grid').exists()).toBe(true)
    expect(wrapper.findAll('.coin-card')).toHaveLength(2)
  })

  it('should display error message when fetch fails', async () => {
    const errorMsg = 'Failed to fetch cryptocurrency data'

    await wrapper.vm.error = errorMsg
    await wrapper.vm.loading = false

    expect(wrapper.find('.error').exists()).toBe(true)
    expect(wrapper.find('.error').text()).toBe(errorMsg)
  })

  it('should display empty state when no coins are available', async () => {
    await wrapper.vm.coins = []
    await wrapper.vm.loading = false
    await wrapper.vm.error = null

    expect(wrapper.find('.empty').exists()).toBe(true)
    expect(wrapper.find('.empty').text()).toBe('No cryptocurrency data available')
  })

  it('should format price correctly', () => {
    const formattedPrice = wrapper.vm.formatPrice(43000)
    expect(formattedPrice).toBe('$43,000.00')
  })

  it('should display coin symbol in uppercase', async () => {
    const coins = [{ id: '1', name: 'Bitcoin', symbol: 'btc', price: 43000 }]

    await wrapper.vm.coins = coins
    await wrapper.vm.loading = false

    expect(wrapper.find('.symbol').text()).toBe('BTC')
  })
})
