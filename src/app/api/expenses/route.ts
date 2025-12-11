import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ExpenseSchema } from '@/lib/validation';
import { ZodError } from 'zod';

export const dynamic = 'force-dynamic';

// GET /api/expenses - Fetch all recurring expenses with current month payment status
export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
    const currentYear = now.getFullYear();

    const expenses = await prisma.recurringExpense.findMany({
      include: {
        payments: {
          where: {
            month: currentMonth,
            year: currentYear
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Transform to include current month payment info and convert Decimal to number
    const expensesWithPaymentStatus = expenses.map(expense => ({
      id: expense.id,
      description: expense.description,
      amount: Number(expense.amount),
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
      currentMonthPayment: expense.payments[0] ? {
        id: expense.payments[0].id,
        recurringExpenseId: expense.payments[0].recurringExpenseId,
        month: expense.payments[0].month,
        year: expense.payments[0].year,
        isPaid: expense.payments[0].isPaid,
        paidAt: expense.payments[0].paidAt
      } : null
    }));

    return NextResponse.json(expensesWithPaymentStatus, { status: 200 });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { error: { message: 'Failed to fetch expenses' } },
      { status: 500 }
    );
  }
}

// POST /api/expenses - Create new recurring expense
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = ExpenseSchema.parse(body);

    // Create expense in database
    const expense = await prisma.recurringExpense.create({
      data: {
        description: validatedData.description.trim(),
        amount: validatedData.amount
      }
    });

    // Convert Decimal to number
    const expenseResponse = {
      id: expense.id,
      description: expense.description,
      amount: Number(expense.amount),
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
      currentMonthPayment: null
    };

    return NextResponse.json(expenseResponse, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: error.issues
          }
        },
        { status: 400 }
      );
    }

    console.error('Error creating expense:', error);
    return NextResponse.json(
      { error: { message: 'Failed to create expense' } },
      { status: 500 }
    );
  }
}
