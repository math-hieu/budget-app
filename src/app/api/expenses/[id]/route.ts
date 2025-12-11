import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ExpenseSchema } from '@/lib/validation';
import { ZodError } from 'zod';

// GET /api/expenses/:id - Fetch single expense
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const expense = await prisma.recurringExpense.findUnique({
      where: { id: params.id },
      include: {
        payments: {
          where: {
            month: currentMonth,
            year: currentYear
          }
        }
      }
    });

    if (!expense) {
      return NextResponse.json(
        { error: { message: 'Expense not found' } },
        { status: 404 }
      );
    }

    const expenseResponse = {
      id: expense.id,
      description: expense.description,
      amount: Number(expense.amount),
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
      currentMonthPayment: expense.payments[0] || null
    };

    return NextResponse.json(expenseResponse, { status: 200 });
  } catch (error) {
    console.error('Error fetching expense:', error);
    return NextResponse.json(
      { error: { message: 'Failed to fetch expense' } },
      { status: 500 }
    );
  }
}

// PUT /api/expenses/:id - Update expense
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = ExpenseSchema.parse(body);

    // Check if expense exists
    const existingExpense = await prisma.recurringExpense.findUnique({
      where: { id: params.id }
    });

    if (!existingExpense) {
      return NextResponse.json(
        { error: { message: 'Expense not found' } },
        { status: 404 }
      );
    }

    // Update expense
    const expense = await prisma.recurringExpense.update({
      where: { id: params.id },
      data: {
        description: validatedData.description.trim(),
        amount: validatedData.amount
      },
      include: {
        payments: {
          where: {
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear()
          }
        }
      }
    });

    const expenseResponse = {
      id: expense.id,
      description: expense.description,
      amount: Number(expense.amount),
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
      currentMonthPayment: expense.payments[0] || null
    };

    return NextResponse.json(expenseResponse, { status: 200 });
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

    console.error('Error updating expense:', error);
    return NextResponse.json(
      { error: { message: 'Failed to update expense' } },
      { status: 500 }
    );
  }
}

// DELETE /api/expenses/:id - Delete expense
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if expense exists
    const existingExpense = await prisma.recurringExpense.findUnique({
      where: { id: params.id }
    });

    if (!existingExpense) {
      return NextResponse.json(
        { error: { message: 'Expense not found' } },
        { status: 404 }
      );
    }

    // Delete expense
    await prisma.recurringExpense.delete({
      where: { id: params.id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json(
      { error: { message: 'Failed to delete expense' } },
      { status: 500 }
    );
  }
}
