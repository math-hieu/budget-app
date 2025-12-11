import { BudgetData } from '@/types';

/**
 * Calculate remaining budget
 * Formula: balance - sum(savings) - sum(unpaid expenses) - sum(unpaid payments) + sum(pending reimbursements)
 * @param data - Budget data containing balance and all financial commitments
 * @returns Remaining budget rounded to 2 decimal places
 */
export function calculateRemainingBudget(data: BudgetData): number {
  const totalSavings = data.virtualSavings.reduce((sum, s) => sum + s.amount, 0);
  const totalExpenses = data.recurringExpenses
    .filter((e) => !e.isPaid)
    .reduce((sum, e) => sum + e.amount, 0);
  const totalPending = data.pendingPayments
    .filter((p) => !p.isPaid)
    .reduce((sum, p) => sum + p.amount, 0);
  const totalReimbursements = data.pendingReimbursements.reduce((sum, r) => sum + r.amount, 0);

  const remaining = data.accountBalance - (totalSavings + totalExpenses + totalPending) + totalReimbursements;

  // Round to 2 decimal places to handle floating point precision
  return Math.round(remaining * 100) / 100;
}
