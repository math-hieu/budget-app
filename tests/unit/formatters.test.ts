import { formatCurrency, parseCurrency } from '@/lib/formatters';

describe('formatCurrency', () => {
  it('should format positive amounts correctly', () => {
    expect(formatCurrency(1234.56)).toBe('1\u202F234,56\u00A0€');
    expect(formatCurrency(100)).toBe('100,00\u00A0€');
    expect(formatCurrency(0.99)).toBe('0,99\u00A0€');
  });

  it('should format negative amounts correctly', () => {
    expect(formatCurrency(-1234.56)).toBe('-1\u202F234,56\u00A0€');
    expect(formatCurrency(-100)).toBe('-100,00\u00A0€');
    expect(formatCurrency(-0.99)).toBe('-0,99\u00A0€');
  });

  it('should format zero correctly', () => {
    expect(formatCurrency(0)).toBe('0,00\u00A0€');
    expect(formatCurrency(-0)).toBe('0,00\u00A0€');
  });

  it('should format large numbers correctly', () => {
    expect(formatCurrency(1000000)).toBe('1\u202F000\u202F000,00\u00A0€');
    expect(formatCurrency(999999.99)).toBe('999\u202F999,99\u00A0€');
  });

  it('should always show 2 decimal places', () => {
    expect(formatCurrency(10)).toBe('10,00\u00A0€');
    expect(formatCurrency(10.1)).toBe('10,10\u00A0€');
    expect(formatCurrency(10.99)).toBe('10,99\u00A0€');
  });

  it('should round to 2 decimal places', () => {
    expect(formatCurrency(10.999)).toBe('11,00\u00A0€');
    expect(formatCurrency(10.995)).toBe('11,00\u00A0€');
    expect(formatCurrency(10.994)).toBe('10,99\u00A0€');
  });
});

describe('parseCurrency', () => {
  it('should parse formatted currency strings', () => {
    expect(parseCurrency('$1,234.56')).toBe(1234.56);
    expect(parseCurrency('$100.00')).toBe(100);
    expect(parseCurrency('$0.99')).toBe(0.99);
  });

  it('should parse numbers without currency symbols', () => {
    expect(parseCurrency('1234.56')).toBe(1234.56);
    expect(parseCurrency('100')).toBe(100);
  });

  it('should parse negative amounts', () => {
    expect(parseCurrency('-$1,234.56')).toBe(-1234.56);
    expect(parseCurrency('-100')).toBe(-100);
  });

  it('should handle zero', () => {
    expect(parseCurrency('$0.00')).toBe(0);
    expect(parseCurrency('0')).toBe(0);
  });

  it('should return null for invalid inputs', () => {
    expect(parseCurrency('abc')).toBeNull();
    expect(parseCurrency('')).toBeNull();
    expect(parseCurrency('$$$')).toBeNull();
  });

  it('should handle whitespace', () => {
    expect(parseCurrency(' $ 1,234.56 ')).toBe(1234.56);
    expect(parseCurrency('  100  ')).toBe(100);
  });

  it('should round to 2 decimal places', () => {
    expect(parseCurrency('10.999')).toBe(11);
    expect(parseCurrency('10.994')).toBe(10.99);
  });
});
