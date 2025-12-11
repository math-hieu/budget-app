import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const PaymentSchema = z.object({
  description: z.string().min(1).max(200),
  amount: z.number().positive(),
});

// GET /api/payments - Fetch all pending payments
export async function GET() {
  try {
    const payments = await prisma.pendingPayment.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(
      payments.map((p) => ({
        id: p.id,
        description: p.description,
        amount: p.amount.toNumber(),
        isPaid: p.isPaid,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      }))
    );
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch payments',
        },
      },
      { status: 500 }
    );
  }
}

// POST /api/payments - Create new pending payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = PaymentSchema.parse(body);

    const payment = await prisma.pendingPayment.create({
      data: {
        description: validatedData.description.trim(),
        amount: validatedData.amount,
        isPaid: false,
      },
    });

    return NextResponse.json(
      {
        id: payment.id,
        description: payment.description,
        amount: payment.amount.toNumber(),
        isPaid: payment.isPaid,
        createdAt: payment.createdAt.toISOString(),
        updatedAt: payment.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: error.issues,
          },
        },
        { status: 400 }
      );
    }

    console.error('Error creating payment:', error);
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to create payment',
        },
      },
      { status: 500 }
    );
  }
}
