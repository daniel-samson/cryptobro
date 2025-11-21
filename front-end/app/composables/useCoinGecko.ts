/// <reference types="nuxt" />

/**
 * Composable for CoinGecko API integration
 * Provides methods to fetch cryptocurrency data from the backend
 */

interface Coin {
  id: string
  name: string
  symbol: string
  price: number
  current_price?: number
  image?: string
  market_cap?: number
  market_cap_rank?: number
}

interface ApiResponse<T> {
  data: T
  status: number
}

export const useCoinGecko = () => {
  // @ts-ignore - Nuxt auto-import in runtime
  const config = useRuntimeConfig()

  /**
   * Fetch top 10 cryptocurrencies by market cap
   */
  const getCoins = async (): Promise<Coin[]> => {
    try {
      // @ts-ignore - Nuxt auto-import $fetch
      const response = await $fetch<ApiResponse<Coin[]>>(
        `${config.public.apiBaseUrl}/v1/coins/top`
      )
      const coins = response.data || []
      // Map current_price to price for frontend compatibility
      return coins.map(coin => ({
        ...coin,
        price: coin.current_price || coin.price || 0
      }))
    } catch (error) {
      console.error('Failed to fetch coins:', error)
      throw error
    }
  }

  /**
   * Fetch a specific cryptocurrency by ID
   */
  const getCoinById = async (id: string): Promise<Coin | null> => {
    try {
      // @ts-ignore - Nuxt auto-import $fetch
      const response = await $fetch<ApiResponse<Coin>>(
        `${config.public.apiBaseUrl}/v1/coins/${id}`
      )
      return response.data || null
    } catch (error) {
      console.error(`Failed to fetch coin ${id}:`, error)
      throw error
    }
  }

  return {
    getCoins,
    getCoinById
  }
}
