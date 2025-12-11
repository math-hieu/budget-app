import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// DELETE /api/reimbursements/:id - Delete a reimbursement
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.pendingReimbursement.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reimbursement:', error);
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to delete reimbursement',
        },
      },
      { status: 500 }
    );
  }
}
