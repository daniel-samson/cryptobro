import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tableVariants, tableHeaderVariants, tableHeadVariants, tableBodyVariants, tableRowVariants, tableCellVariants } from './table.variants';

/**
 * Table wrapper component
 */
@Component({
  selector: 'z-table',
  standalone: true,
  imports: [CommonModule],
  template: `<table [class]="tableVariants">
    <ng-content></ng-content>
  </table>`,
  styles: []
})
export class TableComponent {
  tableVariants = tableVariants();
}

/**
 * Table header component
 */
@Component({
  selector: 'z-table-header',
  standalone: true,
  imports: [CommonModule],
  template: `<thead [class]="tableHeaderVariants">
    <ng-content></ng-content>
  </thead>`,
  styles: []
})
export class TableHeaderComponent {
  tableHeaderVariants = tableHeaderVariants();
}

/**
 * Table head cell component
 */
@Component({
  selector: 'z-table-head',
  standalone: true,
  imports: [CommonModule],
  template: `<th [class]="headClasses">
    <ng-content></ng-content>
  </th>`,
  styles: []
})
export class TableHeadComponent {
  @Input() align: 'left' | 'center' | 'right' = 'left';

  get headClasses(): string {
    return tableHeadVariants({ align: this.align });
  }
}

/**
 * Table body component
 */
@Component({
  selector: 'z-table-body',
  standalone: true,
  imports: [CommonModule],
  template: `<tbody [class]="tableBodyVariants">
    <ng-content></ng-content>
  </tbody>`,
  styles: []
})
export class TableBodyComponent {
  tableBodyVariants = tableBodyVariants();
}

/**
 * Table row component
 */
@Component({
  selector: 'z-table-row',
  standalone: true,
  imports: [CommonModule],
  template: `<tr [class]="tableRowVariants">
    <ng-content></ng-content>
  </tr>`,
  styles: []
})
export class TableRowComponent {
  tableRowVariants = tableRowVariants();
}

/**
 * Table cell component
 */
@Component({
  selector: 'z-table-cell',
  standalone: true,
  imports: [CommonModule],
  template: `<td [class]="cellClasses">
    <ng-content></ng-content>
  </td>`,
  styles: []
})
export class TableCellComponent {
  @Input() align: 'left' | 'center' | 'right' = 'left';

  get cellClasses(): string {
    return tableCellVariants({ align: this.align });
  }
}
