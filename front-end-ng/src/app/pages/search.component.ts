import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { CoinGeckoService } from '../services/coin-gecko.service';
import { Coin } from '../models/coin.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ZardTableComponent, ZardTableHeaderComponent, ZardTableHeadComponent, ZardTableBodyComponent, ZardTableRowComponent, ZardTableCellComponent } from '@shared/components/table/table.component';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, RouterModule, UpperCasePipe, ZardTableComponent, ZardTableHeaderComponent, ZardTableHeadComponent, ZardTableBodyComponent, ZardTableRowComponent, ZardTableCellComponent, ZardButtonComponent, LoadingSpinnerComponent],
  template: `
    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Search Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground mb-2">Search Results</h1>
        @if (searchQuery) {
          <p class="text-muted-foreground">Showing results for "{{ searchQuery }}"</p>
        }
      </div>

      <!-- Loading State -->
      @if (isLoading) {
        <app-loading-spinner message="Searching..." />
      }

      <!-- Error State -->
      @if (error && !isLoading) {
        <div class="rounded-lg border border-destructive bg-destructive/10 dark:bg-destructive/20 p-6">
          <h3 class="mb-2 font-semibold text-destructive">Error searching</h3>
          <p class="text-sm text-destructive">{{ error }}</p>
        </div>
      }

      <!-- Results Table -->
      @if (!isLoading && !error && results.length > 0) {
        <div class="w-full">
          <div class="overflow-hidden rounded-md border">
            <table z-table>
              <!-- Table Header -->
              <thead z-table-header>
                <tr z-table-row>
                  <th z-table-head>Name</th>
                  <th z-table-head>Symbol</th>
                  <th z-table-head>Price</th>
                  <th z-table-head>Market Cap</th>
                  <th z-table-head class="w-24">Action</th>
                </tr>
              </thead>
              <!-- Table Body -->
              <tbody z-table-body>
                @for (coin of results; track coin.symbol) {
                  <tr
                    z-table-row
                    (click)="navigateToCoin(coin.symbol)"
                  >
                    <td z-table-cell>
                      <div class="flex items-center gap-3">
                        @if (coin.image) {
                          <img
                            [src]="coin.image"
                            [alt]="coin.name"
                            class="h-8 w-8 rounded-full"
                          />
                        }
                        <span class="font-medium">{{ coin.name }}</span>
                      </div>
                    </td>
                    <td z-table-cell>
                      <span class="text-muted-foreground">{{ coin.symbol | uppercase }}</span>
                    </td>
                    <td z-table-cell>
                      {{ formatPrice(coin.price) }}
                    </td>
                    <td z-table-cell>
                      <span class="text-muted-foreground">
                        {{ coin.market_cap ? formatPrice(coin.market_cap) : 'N/A' }}
                      </span>
                    </td>
                    <td z-table-cell>
                      <button z-button zType="secondary" zSize="sm">
                        View Details
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- No Results -->
      @if (!isLoading && !error && searchQuery && results.length === 0) {
        <div class="rounded-lg border border-border bg-muted py-12 text-center">
          <p class="text-lg text-muted-foreground">No cryptocurrencies found for "{{ searchQuery }}"</p>
          <p class="text-sm text-muted-foreground/70 mt-2">Try searching with a different keyword</p>
        </div>
      }

      <!-- No Search Query -->
      @if (!searchQuery && results.length === 0) {
        <div class="rounded-lg border border-border bg-muted py-12 text-center">
          <p class="text-lg text-muted-foreground">Enter a search query to find cryptocurrencies</p>
        </div>
      }
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
