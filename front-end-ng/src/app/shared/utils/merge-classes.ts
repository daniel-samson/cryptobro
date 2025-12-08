/**
 * Merge Tailwind CSS classes intelligently
 * Handles conflicting class names by preferring later values
 */
export function mergeClasses(...classes: (string | undefined | null | false)[]): string {
  return classes
    .filter((c) => typeof c === 'string')
    .join(' ')
    .split(/\s+/)
    .filter((c) => c.length > 0)
    .reverse()
    .reduce((acc, c) => {
      if (!acc.includes(c)) {
        acc.push(c);
      }
      return acc;
    }, [] as string[])
    .reverse()
    .join(' ');
}

/**
 * Transform function for CVA variants
 */
export function transform(obj: Record<string, any>): string {
  return Object.entries(obj)
    .filter(([, value]) => value)
    .map(([key]) => key)
    .join(' ');
}
