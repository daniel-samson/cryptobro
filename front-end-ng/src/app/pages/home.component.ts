import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoinGeckoService } from '../services/coin-gecko.service';
import { Coin } from '../models/coin.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-8">Cryptocurrency Prices</h1>

      <div *ngIf="isLoading" class="text-center py-8">
        <p>Loading cryptocurrencies...</p>
      </div>

      <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <div *ngIf="!isLoading && !error && coins.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let coin of coins" class="border rounded-lg p-4 hover:shadow-lg transition-shadow">
          <h2 class="text-xl font-semibold">{{ coin.name }}</h2>
          <p class="text-gray-600">{{ coin.symbol | uppercase }}</p>
          <p class="text-2xl font-bold mt-2">${{ coin.price.toFixed?.(2) || '0.00' }}</p>
          <a [routerLink]="['/coins', coin.symbol]" class="text-blue-500 hover:text-blue-700 mt-4 inline-block">
            View Details →
          </a>
        </div>
      </div>

      <div *ngIf="!isLoading && !error && coins.length === 0" class="text-center py-8">
        <p>No cryptocurrencies found.</p>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit {
  coins: Coin[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private coinGeckoService: CoinGeckoService) {}

  ngOnInit(): void {
    this.loadCoins();
  }

  private loadCoins(): void {
    this.isLoading = true;
    this.error = null;
    this.coinGeckoService.getCoins().subscribe({
      next: (coins) => {
        this.coins = coins;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load cryptocurrencies';
        this.isLoading = false;
      }
    });
  }
}
