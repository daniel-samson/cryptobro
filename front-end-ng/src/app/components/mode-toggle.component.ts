import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

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
        [attr.aria-label]="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <!-- Moon Icon (Light Mode) -->
        <lucide-angular
          *ngIf="!isDark"
          name="moon"
          class="h-5 w-5 transition-all"
        ></lucide-angular>

        <!-- Sun Icon (Dark Mode) -->
        <lucide-angular
          *ngIf="isDark"
          name="sun"
          class="h-5 w-5 transition-all"
        ></lucide-angular>
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
          <lucide-angular name="sun" class="h-4 w-4 flex-shrink-0"></lucide-angular>
          Light
        </button>
        <button
          (click)="setMode('dark')"
          class="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 transition-colors"
          [class.bg-accent]="currentMode === 'dark'"
          [class.text-accent-foreground]="currentMode === 'dark'"
        >
          <lucide-angular name="moon" class="h-4 w-4 flex-shrink-0"></lucide-angular>
          Dark
        </button>
        <button
          (click)="setMode('system')"
          class="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground last:rounded-b-lg flex items-center gap-2 transition-colors"
          [class.bg-accent]="currentMode === 'system'"
          [class.text-accent-foreground]="currentMode === 'system'"
        >
          <lucide-angular name="monitor" class="h-4 w-4 flex-shrink-0"></lucide-angular>
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
