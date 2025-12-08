import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CoinGeckoService } from '../services/coin-gecko.service';
import { CoinDetails } from '../models/coin.model';
import { ZardCardComponent } from '@shared/components/card/card.component';

@Component({
  selector: 'app-coin-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ZardCardComponent],
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
      <div *ngIf="!isLoading && !error && coin" class="space-y-8">
        <!-- Header Section -->
        <div class="flex items-center gap-6">
          <img *ngIf="coin.image" [src]="coin.image" [alt]="coin.name" class="h-16 w-16 rounded-full" />
          <div>
            <h1 class="text-4xl font-bold text-foreground">{{ coin.name }}</h1>
            <p class="text-xl text-muted-foreground">{{ coin.symbol | uppercase }}</p>
          </div>
        </div>

        <!-- Price Info Card -->
        <z-card>
          <h2 class="text-lg font-semibold text-foreground mb-2">Current Price</h2>
          <div *ngIf="coin.market_data" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p class="text-sm text-muted-foreground">Current Price</p>
              <p class="text-2xl font-bold text-primary">{{ formatPrice(coin.price) }}</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Market Cap</p>
              <p class="text-2xl font-bold text-green-500 dark:text-green-400">
                {{ coin.market_data.market_cap?.usd ? formatLargeNumber(coin.market_data.market_cap!.usd!) : 'N/A' }}
              </p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">24h Volume</p>
              <p class="text-2xl font-bold text-green-500 dark:text-green-400">
                {{ coin.market_data.total_volume?.usd ? formatLargeNumber(coin.market_data.total_volume!.usd!) : 'N/A' }}
              </p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">24h Change</p>
              <p [class]="getPriceChangeClass(coin.market_data.price_change_percentage_24h)" class="text-2xl font-bold">
                {{ coin.market_data.price_change_percentage_24h !== undefined && coin.market_data.price_change_percentage_24h !== null ? formatPercentage(coin.market_data.price_change_percentage_24h) : 'N/A' }}
              </p>
            </div>
          </div>
        </z-card>

        <!-- Price Range Card -->
        <z-card *ngIf="coin.market_data">
          <h2 class="text-lg font-semibold text-foreground mb-2">24h Price Range</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <p class="text-sm text-muted-foreground">24h Low</p>
              <p class="text-2xl font-bold text-red-500 dark:text-red-400">
                {{ coin.market_data.low_24h?.usd ? formatPrice(coin.market_data.low_24h!.usd!) : 'N/A' }}
              </p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">24h High</p>
              <p class="text-2xl font-bold text-green-500 dark:text-green-400">
                {{ coin.market_data.high_24h?.usd ? formatPrice(coin.market_data.high_24h!.usd!) : 'N/A' }}
              </p>
            </div>
          </div>
        </z-card>

        <!-- Description Card -->
        <z-card *ngIf="coin.description?.en">
          <h2 class="text-lg font-semibold text-foreground mb-2">About {{ coin.name }}</h2>
          <p class="text-foreground leading-relaxed">{{ coin.description?.en }}</p>
        </z-card>

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
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
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

  formatPercentage(percentage: number): string {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  }

  getPriceChangeClass(change?: number): string {
    if (!change) return 'text-muted-foreground';
    return change >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400';
  }

  private loadCoinDetails(): void {
    this.isLoading = true;
    this.error = null;
    this.coinGeckoService.getCoinBySymbol(this.symbol).subscribe({
      next: (coin) => {
        this.coin = coin;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = err.message || 'Failed to load coin details';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
