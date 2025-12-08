import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

type ColorMode = 'light' | 'dark' | 'system';

@Component({
  selector: 'app-mode-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <button
        (click)="toggleMenu()"
        class="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <!-- Moon Icon -->
        <svg
          *ngIf="!isDark"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 transition-all"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M21.64 15.95c-.18-.8-.46-1.58-.84-2.3.46-1.39.73-2.89.73-4.4 0-6.3-5.05-11.44-11.44-11.44S1.1 2.25 1.1 8.55c0 1.51.27 3.01.73 4.4-.38.72-.66 1.5-.84 2.3-.72 2.96-.44 6.01.92 8.88 1.36 2.87 3.55 5.12 6.05 6.56 1.25.66 2.59.99 3.93.99s2.68-.33 3.93-.99c2.5-1.44 4.69-3.69 6.05-6.56 1.36-2.87 1.64-5.92.92-8.88z"
          />
        </svg>

        <!-- Sun Icon -->
        <svg
          *ngIf="isDark"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 transition-all"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M12 17.5c-3.04 0-5.5-2.46-5.5-5.5s2.46-5.5 5.5-5.5 5.5 2.46 5.5 5.5-2.46 5.5-5.5 5.5zm0-9c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zm0-3.5c.83 0 1.5-.67 1.5-1.5V2c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v1.5c0 .83.67 1.5 1.5 1.5zm8.02.82c.59-.59 1.59-.59 2.18 0l1.06 1.06c.59.59.59 1.59 0 2.18-.59.59-1.59.59-2.18 0l-1.06-1.06c-.59-.59-.59-1.59 0-2.18zM12 20.5c-.83 0-1.5.67-1.5 1.5v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-1.5c0-.83-.67-1.5-1.5-1.5zm7.02-2.32c.59.59 1.59.59 2.18 0 .59-.59.59-1.59 0-2.18l-1.06-1.06c-.59-.59-1.59-.59-2.18 0-.59.59-.59 1.59 0 2.18l1.06 1.06zM5.46 7.46c.59-.59 1.59-.59 2.18 0l1.06 1.06c.59.59.59 1.59 0 2.18-.59.59-1.59.59-2.18 0l-1.06-1.06c-.59-.59-.59-1.59 0-2.18zm14.08 10.08c.59.59.59 1.59 0 2.18-.59.59-1.59.59-2.18 0l-1.06-1.06c-.59-.59-.59-1.59 0-2.18.59-.59 1.59-.59 2.18 0l1.06 1.06zM2 12c0 .83.67 1.5 1.5 1.5h1.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5H3.5C2.67 10.5 2 11.17 2 12zm4.54-4.54c.59.59.59 1.59 0 2.18-.59.59-1.59.59-2.18 0L3.3 8.6c-.59-.59-.59-1.59 0-2.18.59-.59 1.59-.59 2.18 0l1.06 1.06z"
          />
        </svg>
        <span class="sr-only">Toggle theme</span>
      </button>

      <!-- Dropdown Menu -->
      <div
        *ngIf="showMenu"
        class="absolute right-0 mt-2 w-40 rounded-lg border border-border bg-popover shadow-md"
      >
        <button
          (click)="setMode('light')"
          class="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground first:rounded-t-lg"
        >
          Light
        </button>
        <button
          (click)="setMode('dark')"
          class="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          Dark
        </button>
        <button
          (click)="setMode('system')"
          class="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground last:rounded-b-lg"
        >
          System
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class ModeToggleComponent implements OnInit {
  showMenu = false;
  isDark = false;
  currentMode: ColorMode = 'system';

  ngOnInit(): void {
    this.loadTheme();
    this.updateTheme();
  }

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  setMode(mode: ColorMode): void {
    this.currentMode = mode;
    this.saveTheme(mode);
    this.updateTheme();
    this.showMenu = false;
  }

  private loadTheme(): void {
    const saved = localStorage.getItem('color-mode') as ColorMode | null;
    if (saved) {
      this.currentMode = saved;
    } else {
      this.currentMode = 'system';
    }
  }

  private saveTheme(mode: ColorMode): void {
    localStorage.setItem('color-mode', mode);
  }

  private updateTheme(): void {
    const root = document.documentElement;

    if (this.currentMode === 'system') {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDark = isDarkMode;
      if (isDarkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else if (this.currentMode === 'dark') {
      this.isDark = true;
      root.classList.add('dark');
    } else {
      this.isDark = false;
      root.classList.remove('dark');
    }
  }
}
