/**
 * Image object returned by detail endpoint
 */
export interface ImageObject {
  thumb?: string;
  small?: string;
  large?: string;
}

/**
 * Coin model representing cryptocurrency data
 */
export interface Coin {
  id: string;
  name: string;
  symbol: string;
  price: number;
  current_price?: number;
  image?: string | ImageObject;
  market_cap?: number;
  market_cap_rank?: number;
}

/**
 * Extended coin details with market data
 */
export interface CoinDetails extends Coin {
  description?: {
    en?: string;
  };
  market_data?: {
    current_price?: { usd?: number };
    market_cap?: { usd?: number };
    total_volume?: { usd?: number };
    high_24h?: { usd?: number };
    low_24h?: { usd?: number };
    price_change_24h?: number;
    price_change_percentage_24h?: number;
  };
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
}
