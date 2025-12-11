import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { UpdateSavingsSchema, formatZodError } from '@/lib/validation';
import { Decimal } from '@prisma/client/runtime/library';

// PUT /api/savings/:id - Update virtual saving
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = UpdateSavingsSchema.safeParse(body);
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

    // Check if saving exists
    const existing = await prisma.virtualSaving.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Saving not found',
          },
        },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (validation.data.name !== undefined) {
      updateData.name = validation.data.name;
    }
    if (validation.data.amount !== undefined) {
      updateData.amount = new Decimal(validation.data.amount);
    }

    const saving = await prisma.virtualSaving.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      id: saving.id,
      name: saving.name,
      amount: saving.amount.toNumber(),
      createdAt: saving.createdAt.toISOString(),
      updatedAt: saving.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Error updating saving:', error);
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to update saving',
        },
      },
      { status: 500 }
    );
  }
}

// DELETE /api/savings/:id - Delete virtual saving
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if saving exists
    const existing = await prisma.virtualSaving.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Saving not found',
          },
        },
        { status: 404 }
      );
    }

    await prisma.virtualSaving.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting saving:', error);
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to delete saving',
        },
      },
      { status: 500 }
    );
  }
}
