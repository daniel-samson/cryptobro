import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="border-t border-border bg-card mt-auto">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p class="text-sm text-muted-foreground">
            &copy; {{ currentYear }} Cryptobro. All rights reserved.
          </p>
          <div class="flex items-center gap-4">
            <a
              href="https://github.com/daniel-samson/cryptobro"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <span class="text-muted-foreground">•</span>
            <p class="text-sm text-muted-foreground">
              Powered by CoinGecko API
            </p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
