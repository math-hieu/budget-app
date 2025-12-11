import { GET, POST } from '@/app/api/savings/route';
import { PUT, DELETE } from '@/app/api/savings/[id]/route';
import { prisma } from '@/lib/db';
import { NextRequest } from 'next/server';

// Mock Prisma client
jest.mock('@/lib/db', () => ({
  prisma: {
    virtualSaving: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('GET /api/savings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 with array of savings', async () => {
    const mockSavings = [
      {
        id: '1',
        name: 'Emergency Fund',
        amount: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Vacation',
        amount: 500,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (prisma.virtualSaving.findMany as jest.Mock).mockResolvedValue(
      mockSavings.map((s) => ({
        ...s,
        amount: { toNumber: () => s.amount },
      }))
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(2);
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('name');
    expect(data[0]).toHaveProperty('amount');
  });

  it('should return empty array when no savings exist', async () => {
    (prisma.virtualSaving.findMany as jest.Mock).mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(0);
  });

  it('should return 500 on database error', async () => {
    (prisma.virtualSaving.findMany as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
  });
});

describe('POST /api/savings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 201 and create savings with valid input', async () => {
    const mockCreated = {
      id: '1',
      name: 'Emergency Fund',
      amount: { toNumber: () => 1000 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.virtualSaving.create as jest.Mock).mockResolvedValue(mockCreated);

    const request = new NextRequest('http://localhost:3000/api/savings', {
      method: 'POST',
      body: JSON.stringify({ name: 'Emergency Fund', amount: 1000 }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toHaveProperty('id');
    expect(data.name).toBe('Emergency Fund');
    expect(data.amount).toBe(1000);
  });

  it('should accept negative amounts (withdrawals from savings)', async () => {
    const mockCreated = {
      id: '2',
      name: 'Withdrawal',
      amount: { toNumber: () => -100 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.virtualSaving.create as jest.Mock).mockResolvedValue(mockCreated);

    const request = new NextRequest('http://localhost:3000/api/savings', {
      method: 'POST',
      body: JSON.stringify({ name: 'Withdrawal', amount: -100 }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.amount).toBe(-100);
  });

  it('should return 400 when name is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/savings', {
      method: 'POST',
      body: JSON.stringify({ amount: 1000 }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
  });

  it('should return 400 when amount is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/savings', {
      method: 'POST',
      body: JSON.stringify({ name: 'Emergency Fund' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
  });
});

describe('PUT /api/savings/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and update savings with valid input', async () => {
    const mockUpdated = {
      id: '1',
      name: 'Updated Fund',
      amount: { toNumber: () => 1500 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.virtualSaving.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'Old Fund',
      amount: { toNumber: () => 1000 },
    });
    (prisma.virtualSaving.update as jest.Mock).mockResolvedValue(mockUpdated);

    const request = new NextRequest('http://localhost:3000/api/savings/1', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Updated Fund', amount: 1500 }),
    });

    const response = await PUT(request, { params: { id: '1' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe('Updated Fund');
    expect(data.amount).toBe(1500);
  });

  it('should return 404 when savings not found', async () => {
    (prisma.virtualSaving.findUnique as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/savings/999', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Test', amount: 1000 }),
    });

    const response = await PUT(request, { params: { id: '999' } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty('error');
  });

  it('should accept negative amounts when updating', async () => {
    const mockUpdated = {
      id: '1',
      name: 'Withdrawal',
      amount: { toNumber: () => -500 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.virtualSaving.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'Test',
      amount: { toNumber: () => 1000 },
    });
    (prisma.virtualSaving.update as jest.Mock).mockResolvedValue(mockUpdated);

    const request = new NextRequest('http://localhost:3000/api/savings/1', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Withdrawal', amount: -500 }),
    });

    const response = await PUT(request, { params: { id: '1' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.amount).toBe(-500);
  });
});

describe('DELETE /api/savings/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 204 when delete is successful', async () => {
    (prisma.virtualSaving.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'Test',
      amount: { toNumber: () => 1000 },
    });
    (prisma.virtualSaving.delete as jest.Mock).mockResolvedValue({});

    const request = new NextRequest('http://localhost:3000/api/savings/1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: { id: '1' } });

    expect(response.status).toBe(204);
  });

  it('should return 404 when savings not found', async () => {
    (prisma.virtualSaving.findUnique as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/savings/999', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: { id: '999' } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty('error');
  });
});
