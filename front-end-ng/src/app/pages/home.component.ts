import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoinGeckoService } from '../services/coin-gecko.service';
import { Coin } from '../models/coin.model';
import { ZardCardComponent } from '@shared/components/card/card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ZardCardComponent],
  template: `
    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <h2 class="mb-8 text-3xl font-bold text-foreground">Cryptocurrency Prices</h2>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="flex items-center justify-center py-12">
          <div class="flex flex-col items-center gap-4">
            <div class="h-12 w-12 animate-spin rounded-full border-4 border-muted loading-spinner"></div>
            <p class="text-lg text-muted-foreground">Loading cryptocurrency data...</p>
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

        <!-- Coins Grid -->
        <div *ngIf="!isLoading && !error && coins.length > 0" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <a
            *ngFor="let coin of coins"
            [routerLink]="['/coins', coin.symbol]"
            class="block transition-all hover:shadow-lg cursor-pointer rounded-lg coin-card"
          >
            <z-card class="flex h-full flex-col overflow-hidden bg-card p-3 rounded-lg">
              <!-- Card Header -->
              <div class="pb-2 flex items-center gap-3">
                <img
                  *ngIf="coin.image"
                  [src]="coin.image"
                  [alt]="coin.name"
                  class="h-8 w-8 rounded-full"
                />
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-semibold text-foreground truncate">{{ coin.name }}</h3>
                  <p class="text-sm text-muted-foreground">{{ coin.symbol | uppercase }}</p>
                </div>
              </div>

              <!-- Card Content -->
              <div class="flex-1">
                <p class="text-3xl font-bold text-primary text-right">{{ formatPrice(coin.price) }}</p>
              </div>
            </z-card>
          </a>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && !error && coins.length === 0" class="rounded-lg border border-border bg-muted py-12 text-center">
          <p class="text-lg text-muted-foreground">No cryptocurrency data available</p>
        </div>
      </section>
    </main>
  `,
  styles: []
})
export class HomeComponent implements OnInit {
  coins: Coin[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private coinGeckoService: CoinGeckoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('HomeComponent ngOnInit called');
    try {
      localStorage.setItem('homeComponentInitialized', new Date().toISOString());
    } catch (e) {
      console.error('Could not write to localStorage');
    }
    console.log('About to call loadCoins');
    this.loadCoins();
    console.log('loadCoins called, isLoading =', this.isLoading);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  private loadCoins(): void {
    this.isLoading = true;
    this.error = null;
    console.log('Starting to load coins...');
    console.log('API Base URL:', (this.coinGeckoService as any).apiBaseUrl || 'unknown');

    const subscription = this.coinGeckoService.getCoins().subscribe({
      next: (coins) => {
        console.log('Coins loaded successfully, count:', coins?.length);
        console.log('First coin:', coins?.[0]);
        this.coins = coins;
        this.isLoading = false;
        console.log('Updated isLoading to false');
        this.cdr.markForCheck();
        console.log('Called markForCheck');
      },
      error: (err) => {
        console.error('Error loading coins:', err);
        console.error('Error message:', err?.message);
        console.error('Error status:', err?.status);
        this.error = err?.message || 'Failed to fetch cryptocurrency data. Make sure the backend is running.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });

    console.log('Subscription created');
  }
}
