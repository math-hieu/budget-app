import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// DELETE /api/payments/:id - Delete a pending payment (when paid)
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const { id } = params;

    // Check if payment exists
    const existingPayment = await prisma.pendingPayment.findUnique({
      where: { id },
    });

    if (!existingPayment) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Payment not found',
          },
        },
        { status: 404 }
      );
    }

    // Delete payment
    await prisma.pendingPayment.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting payment:', error);
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to delete payment',
        },
      },
      { status: 500 }
    );
  }
}
