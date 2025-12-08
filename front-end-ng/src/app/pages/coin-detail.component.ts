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
    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <a
        routerLink="/"
        class="mb-6 inline-flex items-center text-primary hover:text-primary/80 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Home
      </a>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="flex items-center justify-center py-12">
        <div class="flex flex-col items-center gap-4">
          <div class="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
          <p class="text-lg text-muted-foreground">Loading coin details...</p>
        </div>
      </div>

      <!-- Error State -->
      <div
        *ngIf="error && !isLoading"
        class="rounded-lg border border-destructive bg-destructive/10 dark:bg-destructive/20 p-6"
      >
        <h3 class="mb-2 font-semibold text-destructive">Error loading data</h3>
        <p class="text-sm text-destructive">{{ error }}</p>
      </div>

      <!-- Coin Details -->
      <div *ngIf="!isLoading && !error && coin" class="max-w-4xl">
        <!-- Header Section -->
        <div class="mb-8 flex items-start justify-between">
          <div>
            <h1 class="text-4xl font-bold text-foreground">{{ coin.name }}</h1>
            <p class="text-xl text-muted-foreground">{{ coin.symbol | uppercase }}</p>
          </div>
          <img *ngIf="coin.image" [src]="coin.image" [alt]="coin.name" class="h-24 w-24 rounded-lg" />
        </div>

        <!-- Price Card -->
        <div class="mb-8 rounded-lg border border-border bg-card p-6">
          <p class="text-sm text-muted-foreground mb-2">Current Price</p>
          <p class="text-4xl font-bold text-primary">{{ formatPrice(coin.price) }}</p>
        </div>

        <!-- Market Data Grid -->
        <div *ngIf="coin.market_data" class="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="rounded-lg border border-border bg-card p-6">
            <p class="text-sm text-muted-foreground mb-2">24h High</p>
            <p class="text-2xl font-bold text-foreground">
              {{ formatLargeNumber(coin.market_data.high_24h?.usd) }}
            </p>
          </div>
          <div class="rounded-lg border border-border bg-card p-6">
            <p class="text-sm text-muted-foreground mb-2">24h Low</p>
            <p class="text-2xl font-bold text-foreground">
              {{ formatLargeNumber(coin.market_data.low_24h?.usd) }}
            </p>
          </div>
          <div class="rounded-lg border border-border bg-card p-6">
            <p class="text-sm text-muted-foreground mb-2">Market Cap</p>
            <p class="text-2xl font-bold text-foreground">{{ formatLargeNumber(coin.market_data.market_cap?.usd) }}</p>
          </div>
          <div class="rounded-lg border border-border bg-card p-6">
            <p class="text-sm text-muted-foreground mb-2">24h Volume</p>
            <p class="text-2xl font-bold text-foreground">{{ formatLargeNumber(coin.market_data.total_volume?.usd) }}</p>
          </div>
          <div *ngIf="coin.market_data.price_change_percentage_24h !== undefined && coin.market_data.price_change_percentage_24h !== null" class="rounded-lg border border-border bg-card p-6">
            <p class="text-sm text-muted-foreground mb-2">24h Change</p>
            <p [class.text-green-600]="coin.market_data.price_change_percentage_24h >= 0" [class.text-red-600]="coin.market_data.price_change_percentage_24h < 0" class="text-2xl font-bold">
              {{ coin.market_data.price_change_percentage_24h.toFixed(2) }}%
            </p>
          </div>
        </div>

        <!-- Description -->
        <div *ngIf="coin.description?.en" class="rounded-lg border border-border bg-card p-6">
          <h2 class="text-2xl font-bold text-foreground mb-4">About</h2>
          <p class="text-foreground leading-relaxed">{{ coin.description?.en }}</p>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && !error && !coin" class="text-center py-12">
          <p class="text-lg text-muted-foreground">Coin not found.</p>
        </div>
      </div>
    </main>
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

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  formatLargeNumber(value?: number): string {
    if (!value) return 'N/A';
    if (value >= 1e12) return (value / 1e12).toFixed(2) + 'T';
    if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
    if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
    if (value >= 1e3) return (value / 1e3).toFixed(2) + 'K';
    return value.toFixed(2);
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
}
