import { cva, type VariantProps } from 'class-variance-authority';

export const tableVariants = cva('w-full border-collapse', {
  variants: {},
});

export const tableHeaderVariants = cva('border-b border-border bg-muted', {
  variants: {},
});

export const tableHeadVariants = cva('px-6 py-3 text-left text-sm font-semibold text-foreground', {
  variants: {
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    align: 'left',
  },
});

export const tableBodyVariants = cva('', {
  variants: {},
});

export const tableRowVariants = cva('border-b border-border transition-colors hover:bg-accent/50 cursor-pointer', {
  variants: {},
});

export const tableCellVariants = cva('px-6 py-4 text-foreground', {
  variants: {
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    align: 'left',
  },
});
