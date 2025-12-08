import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

type ColorMode = 'light' | 'dark' | 'system';

@Component({
  selector: 'app-mode-toggle',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="relative z-40">
      <button
        (click)="toggleMenu()"
        class="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
        [attr.aria-label]="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <!-- Moon Icon (Light Mode) -->
        <lucide-icon
          *ngIf="!isDark"
          name="moon"
          [size]="20"
          color="currentColor"
          [strokeWidth]="2"
        ></lucide-icon>

        <!-- Sun Icon (Dark Mode) -->
        <lucide-icon
          *ngIf="isDark"
          name="sun"
          [size]="20"
          color="currentColor"
          [strokeWidth]="2"
        ></lucide-icon>
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
          <lucide-icon name="sun" [size]="16" color="currentColor" [strokeWidth]="2"></lucide-icon>
          Light
        </button>
        <button
          (click)="setMode('dark')"
          class="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 transition-colors"
          [class.bg-accent]="currentMode === 'dark'"
          [class.text-accent-foreground]="currentMode === 'dark'"
        >
          <lucide-icon name="moon" [size]="16" color="currentColor" [strokeWidth]="2"></lucide-icon>
          Dark
        </button>
        <button
          (click)="setMode('system')"
          class="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground last:rounded-b-lg flex items-center gap-2 transition-colors"
          [class.bg-accent]="currentMode === 'system'"
          [class.text-accent-foreground]="currentMode === 'system'"
        >
          <lucide-icon name="monitor" [size]="16" color="currentColor" [strokeWidth]="2"></lucide-icon>
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
