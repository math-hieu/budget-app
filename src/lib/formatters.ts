/**
 * Format a number as currency with 2 decimal places
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "1 234,56 €" or "-1 234,56 €")
 */
export function formatCurrency(amount: number): string {
  // Handle -0 edge case
  const normalizedAmount = Object.is(amount, -0) ? 0 : amount;

  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(normalizedAmount);
}

/**
 * Parse a currency string to a number
 * @param value - The string to parse
 * @returns Parsed number or null if invalid
 */
export function parseCurrency(value: string): number | null {
  // Remove currency symbols, commas, and whitespace
  const cleaned = value.replace(/[$,\s]/g, '');

  // Parse as float
  const parsed = parseFloat(cleaned);

  // Return null if NaN, otherwise round to 2 decimal places
  if (isNaN(parsed)) {
    return null;
  }

  return Math.round(parsed * 100) / 100;
}
