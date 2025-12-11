import { calculateRemainingBudget } from '@/lib/calculations';
import { BudgetData } from '@/types';

describe('calculateRemainingBudget', () => {
  it('should calculate remaining budget correctly with all positive values', () => {
    const data: BudgetData = {
      accountBalance: 5000,
      virtualSavings: [{ amount: 1000 }, { amount: 500 }],
      recurringExpenses: [{ amount: 800 }, { amount: 200 }],
      pendingPayments: [
        { amount: 300, isPaid: false },
        { amount: 150, isPaid: false },
      ],
    };

    const result = calculateRemainingBudget(data);
    // 5000 - (1000 + 500) - (800 + 200) - (300 + 150) = 5000 - 2950 = 2050
    expect(result).toBe(2050);
  });

  it('should handle negative budget (overdraft)', () => {
    const data: BudgetData = {
      accountBalance: 1000,
      virtualSavings: [{ amount: 500 }],
      recurringExpenses: [{ amount: 800 }],
      pendingPayments: [{ amount: 200, isPaid: false }],
    };

    const result = calculateRemainingBudget(data);
    // 1000 - 500 - 800 - 200 = -500
    expect(result).toBe(-500);
  });

  it('should return balance when no savings, expenses, or payments exist', () => {
    const data: BudgetData = {
      accountBalance: 3000,
      virtualSavings: [],
      recurringExpenses: [],
      pendingPayments: [],
    };

    const result = calculateRemainingBudget(data);
    expect(result).toBe(3000);
  });

  it('should handle zero balance', () => {
    const data: BudgetData = {
      accountBalance: 0,
      virtualSavings: [{ amount: 100 }],
      recurringExpenses: [{ amount: 50 }],
      pendingPayments: [{ amount: 25, isPaid: false }],
    };

    const result = calculateRemainingBudget(data);
    // 0 - 100 - 50 - 25 = -175
    expect(result).toBe(-175);
  });

  it('should ignore paid payments', () => {
    const data: BudgetData = {
      accountBalance: 1000,
      virtualSavings: [],
      recurringExpenses: [],
      pendingPayments: [
        { amount: 200, isPaid: false },
        { amount: 300, isPaid: true }, // This should be ignored
        { amount: 100, isPaid: false },
      ],
    };

    const result = calculateRemainingBudget(data);
    // 1000 - 0 - 0 - (200 + 100) = 700
    expect(result).toBe(700);
  });

  it('should handle decimal amounts correctly', () => {
    const data: BudgetData = {
      accountBalance: 1500.75,
      virtualSavings: [{ amount: 250.5 }],
      recurringExpenses: [{ amount: 100.25 }],
      pendingPayments: [{ amount: 50.5, isPaid: false }],
    };

    const result = calculateRemainingBudget(data);
    // 1500.75 - 250.5 - 100.25 - 50.5 = 1099.5
    expect(result).toBe(1099.5);
  });

  it('should round to 2 decimal places to handle floating point precision', () => {
    const data: BudgetData = {
      accountBalance: 100.1,
      virtualSavings: [{ amount: 33.33 }],
      recurringExpenses: [{ amount: 33.33 }],
      pendingPayments: [{ amount: 33.33, isPaid: false }],
    };

    const result = calculateRemainingBudget(data);
    // Result should be rounded to 2 decimal places
    expect(result).toBe(0.11);
  });

  it('should handle large numbers', () => {
    const data: BudgetData = {
      accountBalance: 999999.99,
      virtualSavings: [{ amount: 100000.5 }, { amount: 50000.25 }],
      recurringExpenses: [{ amount: 75000.15 }],
      pendingPayments: [{ amount: 25000.09, isPaid: false }],
    };

    const result = calculateRemainingBudget(data);
    // 999999.99 - 150000.75 - 75000.15 - 25000.09 = 749999
    expect(result).toBe(749999);
  });
});
