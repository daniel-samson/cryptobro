import { cva, type VariantProps } from 'class-variance-authority';

export const tableVariants = cva('w-full border-collapse', {
  variants: {},
});
export type ZardTableVariants = VariantProps<typeof tableVariants>;

export const tableHeaderVariants = cva('border-b border-border bg-muted', {
  variants: {},
});
export type ZardTableHeaderVariants = VariantProps<typeof tableHeaderVariants>;

export const tableHeadVariants = cva('px-6 py-3 text-left text-sm font-semibold text-foreground h-12', {
  variants: {},
});
export type ZardTableHeadVariants = VariantProps<typeof tableHeadVariants>;

export const tableBodyVariants = cva('', {
  variants: {},
});
export type ZardTableBodyVariants = VariantProps<typeof tableBodyVariants>;

export const tableRowVariants = cva('border-b border-border transition-colors hover:bg-accent/50 cursor-pointer', {
  variants: {},
});
export type ZardTableRowVariants = VariantProps<typeof tableRowVariants>;

export const tableCellVariants = cva('px-6 py-4 text-foreground', {
  variants: {},
});
export type ZardTableCellVariants = VariantProps<typeof tableCellVariants>;
