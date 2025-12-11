import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { SavingsSchema, formatZodError } from '@/lib/validation';
import { Decimal } from '@prisma/client/runtime/library';

export const dynamic = 'force-dynamic';

// GET /api/savings - Fetch all virtual savings
export async function GET() {
  try {
    const savings = await prisma.virtualSaving.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(
      savings.map((s) => ({
        id: s.id,
        name: s.name,
        amount: s.amount.toNumber(),
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
      }))
    );
  } catch (error) {
    console.error('Error fetching savings:', error);
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch savings',
        },
      },
      { status: 500 }
    );
  }
}

// POST /api/savings - Create new virtual saving
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = SavingsSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: formatZodError(validation.error),
          },
        },
        { status: 400 }
      );
    }

    const { name, amount } = validation.data;

    const saving = await prisma.virtualSaving.create({
      data: {
        name,
        amount: new Decimal(amount),
      },
    });

    return NextResponse.json(
      {
        id: saving.id,
        name: saving.name,
        amount: saving.amount.toNumber(),
        createdAt: saving.createdAt.toISOString(),
        updatedAt: saving.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating saving:', error);
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to create saving',
        },
      },
      { status: 500 }
    );
  }
}
