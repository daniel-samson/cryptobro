import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CoinGeckoService } from './coin-gecko.service';
import { ApiResponse, Coin } from '../models/coin.model';

describe('CoinGeckoService', () => {
  let service: CoinGeckoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoinGeckoService]
    });

    service = TestBed.inject(CoinGeckoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getCoins', () => {
    it('should fetch top coins and map current_price to price', () => {
      const mockResponse: ApiResponse<Coin[]> = {
        status: 200,
        data: [
          {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'BTC',
            current_price: 45000,
            price: 45000,
            market_cap_rank: 1
          },
          {
            id: 'ethereum',
            name: 'Ethereum',
            symbol: 'ETH',
            current_price: 2500,
            price: 2500,
            market_cap_rank: 2
          }
        ]
      };

      service.getCoins().subscribe(coins => {
        expect(coins).toHaveLength(2);
        expect(coins[0].name).toBe('Bitcoin');
        expect(coins[0].price).toBe(45000);
        expect(coins[1].name).toBe('Ethereum');
        expect(coins[1].price).toBe(2500);
      });

      const req = httpMock.expectOne(req => req.url.includes('/v1/coins/markets'));
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle errors gracefully', () => {
      service.getCoins().subscribe(
        () => {
          throw new Error('Should not succeed');
        },
        error => {
          expect(error.message).toContain('Failed to fetch cryptocurrency data');
        }
      );

      const req = httpMock.expectOne(req => req.url.includes('/v1/coins/markets'));
      req.error(new ErrorEvent('Network error'), { status: 500 });
    });
  });

  describe('getCoinBySymbol', () => {
    it('should fetch coin details by symbol', () => {
      const mockResponse: ApiResponse<any> = {
        status: 200,
        data: {
          id: 'bitcoin',
          name: 'Bitcoin',
          symbol: 'BTC',
          price: 45000,
          market_data: {
            current_price: { usd: 45000 },
            high_24h: { usd: 46000 },
            low_24h: { usd: 44000 },
            market_cap: { usd: 900000000000 }
          }
        }
      };

      service.getCoinBySymbol('BTC').subscribe(coin => {
        expect(coin).not.toBeNull();
        expect(coin?.name).toBe('Bitcoin');
        expect(coin?.price).toBe(45000);
      });

      const req = httpMock.expectOne(req => req.url.includes('/v1/coins/BTC'));
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('searchCoins', () => {
    it('should search coins by query', () => {
      const mockResponse: ApiResponse<Coin[]> = {
        status: 200,
        data: [
          {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'BTC',
            price: 45000,
            current_price: 45000
          }
        ]
      };

      service.searchCoins('bitcoin').subscribe(coins => {
        expect(coins).toHaveLength(1);
        expect(coins[0].name).toBe('Bitcoin');
      });

      const req = httpMock.expectOne(req =>
        req.url.includes('/v1/coins/search?q=bitcoin')
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return empty array for empty query', () => {
      service.searchCoins('').subscribe(coins => {
        expect(coins).toEqual([]);
      });
    });
  });
});
