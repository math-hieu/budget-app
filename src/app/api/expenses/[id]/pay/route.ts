import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// PATCH /api/expenses/[id]/pay - Toggle payment status for current month
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const { id } = params;
    const { isPaid } = await request.json();

    if (typeof isPaid !== 'boolean') {
      return NextResponse.json(
        { error: { message: 'isPaid must be a boolean' } },
        { status: 400 }
      );
    }

    // Verify expense exists
    const expense = await prisma.recurringExpense.findUnique({
      where: { id }
    });

    if (!expense) {
      return NextResponse.json(
        { error: { message: 'Expense not found' } },
        { status: 404 }
      );
    }

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Upsert payment record for current month
    const payment = await prisma.recurringExpensePayment.upsert({
      where: {
        recurringExpenseId_month_year: {
          recurringExpenseId: id,
          month: currentMonth,
          year: currentYear
        }
      },
      update: {
        isPaid,
        paidAt: isPaid ? new Date() : null
      },
      create: {
        recurringExpenseId: id,
        month: currentMonth,
        year: currentYear,
        isPaid,
        paidAt: isPaid ? new Date() : null
      }
    });

    return NextResponse.json(payment, { status: 200 });
  } catch (error) {
    console.error('Error updating payment status:', error);
    return NextResponse.json(
      { error: { message: 'Failed to update payment status' } },
      { status: 500 }
    );
  }
}
