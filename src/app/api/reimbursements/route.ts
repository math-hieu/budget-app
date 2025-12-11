import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const ReimbursementSchema = z.object({
  description: z.string().min(1).max(200),
  amount: z.number().positive(),
});

// GET /api/reimbursements - Fetch all pending reimbursements
export async function GET() {
  try {
    const reimbursements = await prisma.pendingReimbursement.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(
      reimbursements.map((r) => ({
        id: r.id,
        description: r.description,
        amount: r.amount.toNumber(),
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      }))
    );
  } catch (error) {
    console.error('Error fetching reimbursements:', error);
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch reimbursements',
        },
      },
      { status: 500 }
    );
  }
}

// POST /api/reimbursements - Create new pending reimbursement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ReimbursementSchema.parse(body);

    const reimbursement = await prisma.pendingReimbursement.create({
      data: {
        description: validatedData.description.trim(),
        amount: validatedData.amount,
      },
    });

    return NextResponse.json(
      {
        id: reimbursement.id,
        description: reimbursement.description,
        amount: reimbursement.amount.toNumber(),
        createdAt: reimbursement.createdAt.toISOString(),
        updatedAt: reimbursement.updatedAt.toISOString(),
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

    console.error('Error creating reimbursement:', error);
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to create reimbursement',
        },
      },
      { status: 500 }
    );
  }
}
