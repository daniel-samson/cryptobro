import { cva, type VariantProps } from 'class-variance-authority';

export const tableVariants = cva('w-full border-collapse table-layout-fixed', {
  variants: {},
});
export type ZardTableVariants = VariantProps<typeof tableVariants>;

export const tableHeaderVariants = cva('bg-muted', {
  variants: {},
});
export type ZardTableHeaderVariants = VariantProps<typeof tableHeaderVariants>;

export const tableHeadVariants = cva('px-6 py-4 text-left text-sm text-foreground', {
  variants: {},
});
export type ZardTableHeadVariants = VariantProps<typeof tableHeadVariants>;

export const tableBodyVariants = cva('', {
  variants: {},
});
export type ZardTableBodyVariants = VariantProps<typeof tableBodyVariants>;

export const tableRowVariants = cva('border-b border-border transition-colors', {
  variants: {},
});
export type ZardTableRowVariants = VariantProps<typeof tableRowVariants>;

export const tableCellVariants = cva('px-6 py-4 text-foreground font-medium', {
  variants: {},
});
export type ZardTableCellVariants = VariantProps<typeof tableCellVariants>;
