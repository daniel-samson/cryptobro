import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ModeToggleComponent } from './mode-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModeToggleComponent],
  template: `
    <header class="border-b border-border bg-card sticky top-0 z-50">
      <div class="mx-auto max-w-7xl px-2 py-3 sm:px-4 sm:py-4 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        <!-- Logo -->
        <a routerLink="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img
            src="/images/cryptobro-logo-v1.svg"
            alt="Cryptobro Logo"
            width="328"
            height="88"
            class="h-8 sm:h-10 md:h-12 w-auto"
            style="max-width: 150px;"
          />
        </a>

        <!-- Search and Theme Toggle -->
        <div class="flex items-center gap-2 sm:gap-4">
          <!-- Search Form -->
          <form (ngSubmit)="handleSearch()" class="relative">
            <input
              [(ngModel)]="searchQuery"
              name="search"
              type="text"
              placeholder="Search..."
              class="w-32 sm:w-48 md:w-64 px-3 sm:px-4 py-2 pr-10 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm sm:text-base"
            />
            <button
              type="submit"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>

          <!-- Theme Toggle -->
          <app-mode-toggle />
        </div>
      </div>
    </header>
  `,
  styles: []
})
export class HeaderComponent {
  searchQuery = '';

  constructor(private router: Router) {}

  handleSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchQuery.trim() }
      });
    }
  }
}
