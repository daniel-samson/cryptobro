import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Coin, CoinDetails, ApiResponse } from '../models/coin.model';

/**
 * Service for CoinGecko API integration
 * Provides methods to fetch cryptocurrency data from the backend
 */
@Injectable({
  providedIn: 'root'
})
export class CoinGeckoService {
  private apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  /**
   * Fetch top 10 cryptocurrencies by market cap
   */
  getCoins(): Observable<Coin[]> {
    return this.http
      .get<ApiResponse<Coin[]>>(`${this.apiBaseUrl}/v1/coins/markets`)
      .pipe(
        map(response => {
          const coins = response.data || [];
          // Map current_price to price for frontend compatibility
          return coins.map(coin => ({
            ...coin,
            price: coin.current_price || coin.price || 0
          }));
        }),
        catchError(error => {
          console.error('Failed to fetch coins:', error);
          const errorMessage =
            error?.error?.message || error?.message || 'Failed to fetch cryptocurrency data';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  /**
   * Fetch a specific cryptocurrency by symbol
   */
  getCoinBySymbol(symbol: string): Observable<CoinDetails | null> {
    return this.http
      .get<ApiResponse<CoinDetails>>(`${this.apiBaseUrl}/v1/coins/${symbol}`)
      .pipe(
        map(response => {
          const coin = response.data;
          if (coin) {
            // Ensure price field is set from market_data if available
            return {
              ...coin,
              price: coin.market_data?.current_price?.usd || coin.current_price || coin.price || 0
            };
          }
          return null;
        }),
        catchError(error => {
          console.error(`Failed to fetch coin ${symbol}:`, error);
          const errorMessage =
            error?.error?.message || error?.message || 'Failed to fetch cryptocurrency details';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  /**
   * Fetch a specific cryptocurrency by ID
   */
  getCoinById(id: string): Observable<Coin | null> {
    return this.http
      .get<ApiResponse<Coin>>(`${this.apiBaseUrl}/v1/coins/${id}`)
      .pipe(
        map(response => response.data || null),
        catchError(error => {
          console.error(`Failed to fetch coin ${id}:`, error);
          const errorMessage =
            error?.error?.message || error?.message || 'Failed to fetch cryptocurrency';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  /**
   * Search for cryptocurrencies by name or symbol
   */
  searchCoins(query: string): Observable<Coin[]> {
    if (!query || query.trim().length === 0) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    return this.http
      .get<ApiResponse<Coin[]>>(
        `${this.apiBaseUrl}/v1/coins/search?q=${encodeURIComponent(query)}`
      )
      .pipe(
        map(response => {
          const coins = response.data || [];
          // Map current_price to price for frontend compatibility
          return coins.map(coin => ({
            ...coin,
            price: coin.current_price || coin.price || 0
          }));
        }),
        catchError(error => {
          console.error('Failed to search coins:', error);
          const errorMessage =
            error?.error?.message || error?.message || 'Failed to search cryptocurrencies';
          return throwError(() => new Error(errorMessage));
        })
      );
  }
}
