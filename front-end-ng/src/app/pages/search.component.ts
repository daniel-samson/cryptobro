import { Component } from '@angular/core';
import { CommonModule, FormsModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoinGeckoService } from '../services/coin-gecko.service';
import { Coin } from '../models/coin.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <a routerLink="/" class="text-blue-500 hover:text-blue-700 mb-4 inline-block">← Back to Home</a>

      <h1 class="text-3xl font-bold mb-8">Search Cryptocurrencies</h1>

      <div class="mb-8">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (input)="onSearch()"
          placeholder="Search by name or symbol..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div *ngIf="isLoading" class="text-center py-8">
        <p>Searching...</p>
      </div>

      <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <div *ngIf="!isLoading && !error && results.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let coin of results" class="border rounded-lg p-4 hover:shadow-lg transition-shadow">
          <h2 class="text-xl font-semibold">{{ coin.name }}</h2>
          <p class="text-gray-600">{{ coin.symbol | uppercase }}</p>
          <p class="text-2xl font-bold mt-2">${{ coin.price.toFixed(2) }}</p>
          <a [routerLink]="['/coins', coin.symbol]" class="text-blue-500 hover:text-blue-700 mt-4 inline-block">
            View Details →
          </a>
        </div>
      </div>

      <div *ngIf="!isLoading && !error && searchQuery && results.length === 0" class="text-center py-8">
        <p>No results found for "{{ searchQuery }}"</p>
      </div>

      <div *ngIf="!searchQuery && results.length === 0" class="text-center py-8 text-gray-600">
        <p>Start typing to search for cryptocurrencies...</p>
      </div>
    </div>
  `,
  styles: []
})
export class SearchComponent {
  searchQuery = '';
  results: Coin[] = [];
  isLoading = false;
  error: string | null = null;

  private searchSubject = new Subject<string>();

  constructor(private coinGeckoService: CoinGeckoService) {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(query => {
        this.performSearch(query);
      });
  }

  onSearch(): void {
    this.searchSubject.next(this.searchQuery);
  }

  private performSearch(query: string): void {
    if (!query.trim()) {
      this.results = [];
      this.error = null;
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.coinGeckoService.searchCoins(query).subscribe({
      next: (coins) => {
        this.results = coins;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to search cryptocurrencies';
        this.isLoading = false;
      }
    });
  }
}
