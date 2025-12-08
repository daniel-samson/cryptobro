import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Breadcrumb item for navigation
 */
export interface BreadcrumbItem {
  label: string;
  path?: string;
  queryParams?: Record<string, any>;
  isActive?: boolean;
}

/**
 * Breadcrumb navigation component
 * Displays a hierarchical path to the current page
 */
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="mb-6" aria-label="breadcrumb">
      <ol class="flex items-center space-x-2 text-sm">
        <li *ngFor="let item of items; let isLast = last" class="flex items-center">
          <a
            *ngIf="!isLast && item.path"
            [routerLink]="item.path"
            [queryParams]="item.queryParams"
            class="text-primary hover:text-primary/80 transition-colors"
          >
            {{ item.label }}
          </a>
          <span *ngIf="isLast" class="text-foreground font-medium">{{ item.label }}</span>

          <span *ngIf="!isLast" class="mx-2 text-muted-foreground">/</span>
        </li>
      </ol>
    </nav>
  `,
  styles: []
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
}
