import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { AccountSchema, formatZodError } from '@/lib/validation';
import { Decimal } from '@prisma/client/runtime/library';

export const dynamic = 'force-dynamic';

// GET /api/account - Fetch account balance
export async function GET() {
  try {
    let account = await prisma.account.findFirst();

    // If no account exists, create one with zero balance
    if (!account) {
      account = await prisma.account.create({
        data: {
          balance: new Decimal(0),
        },
      });
    }

    return NextResponse.json({
      id: account.id,
      balance: account.balance.toNumber(),
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Error fetching account:', error);
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch account',
        },
      },
      { status: 500 }
    );
  }
}

// PUT /api/account - Update account balance
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = AccountSchema.safeParse(body);
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

    const { balance } = validation.data;

    // Find existing account or create one
    let account = await prisma.account.findFirst();

    if (account) {
      // Update existing account
      account = await prisma.account.update({
        where: { id: account.id },
        data: {
          balance: new Decimal(balance),
        },
      });
    } else {
      // Create new account
      account = await prisma.account.create({
        data: {
          balance: new Decimal(balance),
        },
      });
    }

    return NextResponse.json({
      id: account.id,
      balance: account.balance.toNumber(),
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Error updating account:', error);
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to update account',
        },
      },
      { status: 500 }
    );
  }
}
