import { z } from 'zod';

// Account validation
export const AccountSchema = z.object({
  balance: z
    .number()
    .finite('Balance must be a valid number')
    .multipleOf(0.01, 'Balance must have at most 2 decimal places'),
});

// Virtual Savings validation
export const SavingsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  amount: z
    .number()
    .finite('Amount must be a valid number')
    .multipleOf(0.01, 'Amount must have at most 2 decimal places'),
  // Note: Negative amounts are allowed to represent withdrawals from virtual savings
});

export const UpdateSavingsSchema = SavingsSchema.partial();

// Recurring Expense validation
export const ExpenseSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(200, 'Description must be at most 200 characters'),
  amount: z
    .number()
    .nonnegative('Amount must be positive or zero')
    .finite('Amount must be a valid number')
    .multipleOf(0.01, 'Amount must have at most 2 decimal places'),
});

export const UpdateExpenseSchema = ExpenseSchema.partial();

// Pending Payment validation
export const PaymentSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(200, 'Description must be at most 200 characters'),
  amount: z
    .number()
    .nonnegative('Amount must be positive or zero')
    .finite('Amount must be a valid number')
    .multipleOf(0.01, 'Amount must have at most 2 decimal places'),
});

export const UpdatePaymentSchema = PaymentSchema.partial().extend({
  isPaid: z.boolean().optional(),
});

// Helper function to format Zod errors for API responses
export function formatZodError(error: z.ZodError): string {
  return error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
}
