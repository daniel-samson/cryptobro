import { vi } from 'vitest'

// Mock useRuntimeConfig
global.useRuntimeConfig = vi.fn(() => ({
  public: {
    apiBaseUrl: 'http://localhost:8000/api',
  },
}))

// Mock $fetch
global.$fetch = vi.fn()
