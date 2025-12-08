import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { ClassValue } from 'clsx';
import { mergeClasses } from '@shared/utils/merge-classes';
import {
  tableVariants,
  tableHeaderVariants,
  tableHeadVariants,
  tableBodyVariants,
  tableRowVariants,
  tableCellVariants,
  type ZardTableVariants,
} from './table.variants';

/**
 * Table wrapper component
 */
@Component({
  selector: 'z-table, table[z-table]',
  exportAs: 'zTable',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTableComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(tableVariants(), this.class()));
}

/**
 * Table header component
 */
@Component({
  selector: 'z-table-header, thead[z-table-header]',
  exportAs: 'zTableHeader',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTableHeaderComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(tableHeaderVariants(), this.class()));
}

/**
 * Table head cell component
 */
@Component({
  selector: 'z-table-head, th[z-table-head]',
  exportAs: 'zTableHead',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTableHeadComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(tableHeadVariants(), this.class()));
}

/**
 * Table body component
 */
@Component({
  selector: 'z-table-body, tbody[z-table-body]',
  exportAs: 'zTableBody',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTableBodyComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(tableBodyVariants(), this.class()));
}

/**
 * Table row component
 */
@Component({
  selector: 'z-table-row, tr[z-table-row]',
  exportAs: 'zTableRow',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTableRowComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(tableRowVariants(), this.class()));
}

/**
 * Table cell component
 */
@Component({
  selector: 'z-table-cell, td[z-table-cell]',
  exportAs: 'zTableCell',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTableCellComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(tableCellVariants(), this.class()));
}
