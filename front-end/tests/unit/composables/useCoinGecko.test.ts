import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useCoinGecko } from '~/app/composables/useCoinGecko'

// Mock $fetch
const mockFetch = vi.fn()
global.$fetch = mockFetch as any

describe('useCoinGecko', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(useCoinGecko).toBeDefined()
  })

  it('should return composable methods', () => {
    const composable = useCoinGecko()
    expect(composable).toHaveProperty('getCoins')
    expect(composable).toHaveProperty('getCoinById')
  })

  describe('getCoins', () => {
    it('should fetch all coins successfully', async () => {
      const mockCoins = [
        { id: '1', name: 'Bitcoin', symbol: 'btc', price: 43000 },
        { id: '2', name: 'Ethereum', symbol: 'eth', price: 2300 },
      ]

      mockFetch.mockResolvedValueOnce({ data: mockCoins })

      const { getCoins } = useCoinGecko()
      const result = await getCoins()

      expect(result).toEqual(mockCoins)
      expect(mockFetch).toHaveBeenCalledOnce()
    })

    it('should return empty array when no coins are available', async () => {
      mockFetch.mockResolvedValueOnce({ data: [] })

      const { getCoins } = useCoinGecko()
      const result = await getCoins()

      expect(result).toEqual([])
    })

    it('should handle fetch errors', async () => {
      const error = new Error('API Error')
      mockFetch.mockRejectedValueOnce(error)

      const { getCoins } = useCoinGecko()

      await expect(getCoins()).rejects.toThrow('API Error')
    })
  })

  describe('getCoinById', () => {
    it('should fetch a coin by id successfully', async () => {
      const mockCoin = { id: '1', name: 'Bitcoin', symbol: 'btc', price: 43000 }

      mockFetch.mockResolvedValueOnce({ data: mockCoin })

      const { getCoinById } = useCoinGecko()
      const result = await getCoinById('1')

      expect(result).toEqual(mockCoin)
      expect(mockFetch).toHaveBeenCalledOnce()
    })

    it('should return null when coin is not found', async () => {
      mockFetch.mockResolvedValueOnce({ data: null })

      const { getCoinById } = useCoinGecko()
      const result = await getCoinById('invalid-id')

      expect(result).toBeNull()
    })

    it('should handle fetch errors', async () => {
      const error = new Error('API Error')
      mockFetch.mockRejectedValueOnce(error)

      const { getCoinById } = useCoinGecko()

      await expect(getCoinById('1')).rejects.toThrow('API Error')
    })
  })
})
