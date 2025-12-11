import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// POST /api/expenses/reset-payments - Reset all payments for current month
export async function POST(request: NextRequest) {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Get all recurring expenses
    const expenses = await prisma.recurringExpense.findMany();

    // Update or create payment records for all expenses, marking them as unpaid
    const resetPromises = expenses.map(expense =>
      prisma.recurringExpensePayment.upsert({
        where: {
          recurringExpenseId_month_year: {
            recurringExpenseId: expense.id,
            month: currentMonth,
            year: currentYear
          }
        },
        update: {
          isPaid: false,
          paidAt: null
        },
        create: {
          recurringExpenseId: expense.id,
          month: currentMonth,
          year: currentYear,
          isPaid: false,
          paidAt: null
        }
      })
    );

    await Promise.all(resetPromises);

    return NextResponse.json(
      {
        message: 'All payments reset successfully',
        count: expenses.length,
        month: currentMonth,
        year: currentYear
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resetting payments:', error);
    return NextResponse.json(
      { error: { message: 'Failed to reset payments' } },
      { status: 500 }
    );
  }
}
