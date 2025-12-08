import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CoinGeckoService } from '../services/coin-gecko.service';
import { CoinDetails } from '../models/coin.model';

@Component({
  selector: 'app-coin-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <a routerLink="/" class="text-blue-500 hover:text-blue-700 mb-4 inline-block">← Back to Home</a>

      <div *ngIf="isLoading" class="text-center py-8">
        <p>Loading coin details...</p>
      </div>

      <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <div *ngIf="!isLoading && !error && coin" class="max-w-2xl">
        <div class="flex items-start justify-between mb-6">
          <div>
            <h1 class="text-4xl font-bold">{{ coin.name }}</h1>
            <p class="text-gray-600 text-xl">{{ coin.symbol | uppercase }}</p>
          </div>
          <img *ngIf="coin.image" [src]="coin.image" [alt]="coin.name" class="w-24 h-24">
        </div>

        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <p class="text-gray-600 mb-2">Current Price</p>
          <p class="text-4xl font-bold text-green-600">${{ coin.price.toFixed?.(2) || '0.00' }}</p>
        </div>

        <div *ngIf="coin.market_data" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-white rounded-lg shadow p-4">
            <p class="text-gray-600">24h High</p>
            <p class="text-2xl font-bold">${{ coin.market_data.high_24h?.usd?.toFixed?.(2) || 'N/A' }}</p>
          </div>
          <div class="bg-white rounded-lg shadow p-4">
            <p class="text-gray-600">24h Low</p>
            <p class="text-2xl font-bold">${{ coin.market_data.low_24h?.usd?.toFixed?.(2) || 'N/A' }}</p>
          </div>
          <div class="bg-white rounded-lg shadow p-4">
            <p class="text-gray-600">Market Cap</p>
            <p class="text-2xl font-bold">${{ formatLargeNumber(coin.market_data.market_cap?.usd) }}</p>
          </div>
          <div class="bg-white rounded-lg shadow p-4">
            <p class="text-gray-600">24h Volume</p>
            <p class="text-2xl font-bold">${{ formatLargeNumber(coin.market_data.total_volume?.usd) }}</p>
          </div>
        </div>

        <div *ngIf="coin.description?.en" class="bg-white rounded-lg shadow p-6">
          <h2 class="text-2xl font-bold mb-4">About</h2>
          <p class="text-gray-700">{{ coin.description.en }}</p>
        </div>

        <div *ngIf="!isLoading && !error && !coin" class="text-center py-8">
          <p>Coin not found.</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CoinDetailComponent implements OnInit {
  coin: CoinDetails | null = null;
  isLoading = true;
  error: string | null = null;
  symbol: string = '';

  constructor(
    private coinGeckoService: CoinGeckoService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.symbol = params['symbol'];
      if (this.symbol) {
        this.loadCoinDetails();
      }
    });
  }

  private loadCoinDetails(): void {
    this.isLoading = true;
    this.error = null;
    this.coinGeckoService.getCoinBySymbol(this.symbol).subscribe({
      next: (coin) => {
        this.coin = coin;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load coin details';
        this.isLoading = false;
      }
    });
  }

  formatLargeNumber(value?: number): string {
    if (!value) return 'N/A';
    if (value >= 1e12) return (value / 1e12).toFixed(2) + 'T';
    if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
    if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
    return value.toFixed(2);
  }
}
