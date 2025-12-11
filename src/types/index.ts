import { Prisma } from '@prisma/client';

// Database model types
export type Account = {
  id: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
};

export type VirtualSaving = {
  id: string;
  name: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type RecurringExpense = {
  id: string;
  description: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type RecurringExpensePayment = {
  id: string;
  recurringExpenseId: string;
  month: number;
  year: number;
  isPaid: boolean;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type RecurringExpenseWithPayment = RecurringExpense & {
  currentMonthPayment?: RecurringExpensePayment;
};

export type PendingPayment = {
  id: string;
  description: string;
  amount: number;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type PendingReimbursement = {
  id: string;
  description: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
};

// Budget calculation data
export interface BudgetData {
  accountBalance: number;
  virtualSavings: { amount: number }[];
  recurringExpenses: { amount: number; isPaid?: boolean }[];
  pendingPayments: { amount: number; isPaid: boolean }[];
  pendingReimbursements: { amount: number }[];
}

// API request/response types
export type CreateSavingsRequest = {
  name: string;
  amount: number;
};

export type UpdateSavingsRequest = Partial<CreateSavingsRequest>;

export type CreateExpenseRequest = {
  description: string;
  amount: number;
};

export type UpdateExpenseRequest = Partial<CreateExpenseRequest>;

export type CreatePaymentRequest = {
  description: string;
  amount: number;
};

export type UpdatePaymentRequest = Partial<CreatePaymentRequest> & {
  isPaid?: boolean;
};

export type CreateReimbursementRequest = {
  description: string;
  amount: number;
};

export type UpdateAccountRequest = {
  balance: number;
};

// API error response
export type ApiError = {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};
