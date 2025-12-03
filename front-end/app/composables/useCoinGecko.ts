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

interface CoinDetails {
  id: string
  name: string
  symbol: string
  price?: number
  current_price?: number
  market_cap?: number
  market_cap_rank?: number
  image?: {
    thumb?: string
    small?: string
    large?: string
  }
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
        `${config.public.apiBaseUrl}/v1/coins/markets`
      )
      const coins = response.data || []
      // Map current_price to price for frontend compatibility
      return coins.map(coin => ({
        ...coin,
        price: coin.current_price || coin.price || 0
      }))
    } catch (error: any) {
      console.error('Failed to fetch coins:', error)
      // Extract error message from API response
      const errorMessage = error?.data?.message || error?.message || 'Failed to fetch cryptocurrency data'
      throw new Error(errorMessage)
    }
  }

  /**
   * Fetch a specific cryptocurrency by symbol
   */
  const getCoinBySymbol = async (symbol: string): Promise<CoinDetails | null> => {
    try {
      console.log('Making API call to:', `${config.public.apiBaseUrl}/v1/coins/${symbol}`)
      // @ts-ignore - Nuxt auto-import $fetch
      const response = await $fetch<ApiResponse<CoinDetails>>(
        `${config.public.apiBaseUrl}/v1/coins/${symbol}`
      )
      console.log('Raw API response:', response)
      const coin = response.data
      if (coin) {
        // Ensure price field is set from market_data if available
        return {
          ...coin,
          price: coin.market_data?.current_price?.usd || coin.current_price || coin.price || 0
        }
      }
      return null
    } catch (error: any) {
      console.error(`Failed to fetch coin ${symbol}:`, error)
      console.error('Error details:', {
        message: error?.message,
        response: error?.response,
        data: error?.data
      })
      // Extract error message from API response
      const errorMessage = error?.data?.message || error?.message || 'Failed to fetch cryptocurrency details'
      throw new Error(errorMessage)
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
    } catch (error: any) {
      console.error(`Failed to fetch coin ${id}:`, error)
      // Extract error message from API response
      const errorMessage = error?.data?.message || error?.message || 'Failed to fetch cryptocurrency'
      throw new Error(errorMessage)
    }
  }

  /**
   * Search for cryptocurrencies by name or symbol
   */
  const searchCoins = async (query: string): Promise<Coin[]> => {
    try {
      if (!query || query.trim().length === 0) {
        return []
      }
      // @ts-ignore - Nuxt auto-import $fetch
      const response = await $fetch<ApiResponse<Coin[]>>(
        `${config.public.apiBaseUrl}/v1/coins/search?q=${encodeURIComponent(query)}`
      )
      const coins = response.data || []
      // Map current_price to price for frontend compatibility
      return coins.map(coin => ({
        ...coin,
        price: coin.current_price || coin.price || 0
      }))
    } catch (error: any) {
      console.error('Failed to search coins:', error)
      // Extract error message from API response
      const errorMessage = error?.data?.message || error?.message || 'Failed to search cryptocurrencies'
      throw new Error(errorMessage)
    }
  }

  return {
    getCoins,
    getCoinById,
    getCoinBySymbol,
    searchCoins
  }
}
