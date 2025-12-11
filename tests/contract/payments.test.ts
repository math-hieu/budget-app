import { NextRequest } from 'next/server';
import { GET } from '@/app/api/payments/route';

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    pendingPayment: {
      findMany: jest.fn(),
    },
  },
}));

const { prisma } = require('@/lib/db');

describe('GET /api/payments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 with array of payments including is_paid field', async () => {
    const mockPayments = [
      {
        id: '1',
        description: 'Test Payment',
        amount: { toNumber: () => 100.00 },
        isPaid: false,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      },
      {
        id: '2',
        description: 'Paid Payment',
        amount: { toNumber: () => 50.00 },
        isPaid: true,
        createdAt: new Date('2025-01-02'),
        updatedAt: new Date('2025-01-02'),
      },
    ];

    (prisma.pendingPayment.findMany as jest.Mock).mockResolvedValue(mockPayments);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(2);
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('description');
    expect(data[0]).toHaveProperty('amount');
    expect(data[0]).toHaveProperty('isPaid');
    expect(data[0].isPaid).toBe(false);
    expect(data[1].isPaid).toBe(true);
  });

  it('should return empty array when no payments exist', async () => {
    (prisma.pendingPayment.findMany as jest.Mock).mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(0);
  });

  it('should return 500 on database error', async () => {
    (prisma.pendingPayment.findMany as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBeDefined();
    expect(data.error.message).toBe('Failed to fetch payments');
  });
});
