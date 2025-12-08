import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CoinGeckoService } from '../services/coin-gecko.service';
import { Coin } from '../models/coin.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ZardCardComponent } from '@shared/components/card/card.component';
import { TableComponent, TableHeaderComponent, TableHeadComponent, TableBodyComponent, TableRowComponent, TableCellComponent } from '@shared/components/table/table.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TableComponent, TableHeaderComponent, TableHeadComponent, TableBodyComponent, TableRowComponent, TableCellComponent],
  template: `
    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Search Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground mb-2">Search Results</h1>
        <p *ngIf="searchQuery" class="text-muted-foreground">Showing results for "{{ searchQuery }}"</p>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="flex items-center justify-center py-12">
        <div class="flex flex-col items-center gap-4">
          <div class="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
          <p class="text-lg text-muted-foreground">Searching...</p>
        </div>
      </div>

      <!-- Error State -->
      <div
        *ngIf="error && !isLoading"
        class="rounded-lg border border-destructive bg-destructive/10 dark:bg-destructive/20 p-6"
      >
        <h3 class="mb-2 font-semibold text-destructive">Error searching</h3>
        <p class="text-sm text-destructive">{{ error }}</p>
      </div>

      <!-- Results Table -->
      <div *ngIf="!isLoading && !error && results.length > 0" class="border border-border rounded-lg overflow-hidden bg-card">
        <div class="overflow-x-auto">
          <z-table>
            <!-- Table Header -->
            <z-table-header>
              <tr>
                <z-table-head align="left">Name</z-table-head>
                <z-table-head align="left">Symbol</z-table-head>
                <z-table-head align="right">Price</z-table-head>
                <z-table-head align="right">Market Cap</z-table-head>
                <z-table-head align="right"></z-table-head>
              </tr>
            </z-table-header>
            <!-- Table Body -->
            <z-table-body>
              <z-table-row
                *ngFor="let coin of results"
                (click)="navigateToCoin(coin.symbol)"
              >
                <z-table-cell align="left">
                  <div class="flex items-center gap-3">
                    <img
                      *ngIf="coin.image"
                      [src]="coin.image"
                      [alt]="coin.name"
                      class="h-8 w-8 rounded-full"
                    />
                    <span class="font-medium">{{ coin.name }}</span>
                  </div>
                </z-table-cell>
                <z-table-cell align="left">
                  <span class="text-muted-foreground">{{ coin.symbol | uppercase }}</span>
                </z-table-cell>
                <z-table-cell align="right">
                  {{ formatPrice(coin.price) }}
                </z-table-cell>
                <z-table-cell align="right">
                  <span class="text-muted-foreground">
                    {{ coin.market_cap ? formatPrice(coin.market_cap) : 'N/A' }}
                  </span>
                </z-table-cell>
                <z-table-cell align="right">
                  <button
                    class="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                  >
                    View Details
                  </button>
                </z-table-cell>
              </z-table-row>
            </z-table-body>
          </z-table>
        </div>
      </div>

      <!-- No Results -->
      <div *ngIf="!isLoading && !error && searchQuery && results.length === 0" class="rounded-lg border border-border bg-muted py-12 text-center">
        <p class="text-lg text-muted-foreground">No cryptocurrencies found for "{{ searchQuery }}"</p>
        <p class="text-sm text-muted-foreground/70 mt-2">Try searching with a different keyword</p>
      </div>

      <!-- No Search Query -->
      <div *ngIf="!searchQuery && results.length === 0" class="rounded-lg border border-border bg-muted py-12 text-center">
        <p class="text-lg text-muted-foreground">Enter a search query to find cryptocurrencies</p>
      </div>
    </main>
  `,
  styles: []
})
export class SearchComponent implements OnInit {
  searchQuery = '';
  results: Coin[] = [];
  isLoading = false;
  error: string | null = null;

  private searchSubject = new Subject<string>();

  constructor(
    private coinGeckoService: CoinGeckoService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(query => {
        this.performSearch(query);
      });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const query = params['q'] || '';
      this.searchQuery = query;
      if (query) {
        this.performSearch(query);
      }
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  navigateToCoin(symbol: string): void {
    this.router.navigate(['/coins', symbol.toLowerCase()], {
      queryParams: { from: 'search', q: this.searchQuery }
    });
  }

  private performSearch(query: string): void {
    if (!query || query.trim().length === 0) {
      this.results = [];
      this.error = null;
      this.cdr.markForCheck();
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.coinGeckoService.searchCoins(query).subscribe({
      next: (coins) => {
        this.results = coins;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = err.message || 'Failed to search cryptocurrencies. Please try again.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
