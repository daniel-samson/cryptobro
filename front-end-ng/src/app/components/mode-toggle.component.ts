import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Moon, Sun, Monitor } from 'lucide-angular';

type ColorMode = 'light' | 'dark' | 'system';

@Component({
  selector: 'app-mode-toggle',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="relative">
      <button
        (click)="toggleMenu()"
        class="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
      >
        <!-- Moon Icon (Light Mode) -->
        <svg
          *ngIf="!isDark"
          [innerHtml]="moonIcon"
          class="h-5 w-5 transition-all"
          role="img"
          aria-label="Moon icon"
        ></svg>

        <!-- Sun Icon (Dark Mode) -->
        <svg
          *ngIf="isDark"
          [innerHtml]="sunIcon"
          class="h-5 w-5 transition-all"
          role="img"
          aria-label="Sun icon"
        ></svg>
        <span class="sr-only">Toggle theme</span>
      </button>

      <!-- Dropdown Menu -->
      <div
        *ngIf="showMenu"
        class="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-popover shadow-lg z-50"
      >
        <button
          (click)="setMode('light')"
          class="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground first:rounded-t-lg flex items-center gap-2 transition-colors"
          [class.bg-accent]="currentMode === 'light'"
          [class.text-accent-foreground]="currentMode === 'light'"
        >
          <svg [innerHtml]="sunIcon" class="h-4 w-4 flex-shrink-0"></svg>
          Light
        </button>
        <button
          (click)="setMode('dark')"
          class="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 transition-colors"
          [class.bg-accent]="currentMode === 'dark'"
          [class.text-accent-foreground]="currentMode === 'dark'"
        >
          <svg [innerHtml]="moonIcon" class="h-4 w-4 flex-shrink-0"></svg>
          Dark
        </button>
        <button
          (click)="setMode('system')"
          class="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground last:rounded-b-lg flex items-center gap-2 transition-colors"
          [class.bg-accent]="currentMode === 'system'"
          [class.text-accent-foreground]="currentMode === 'system'"
        >
          <svg [innerHtml]="monitorIcon" class="h-4 w-4 flex-shrink-0"></svg>
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

  // Lucide icon SVGs as strings
  sunIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  moonIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  monitorIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-monitor"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>';

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
