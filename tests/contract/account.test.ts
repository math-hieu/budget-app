import { GET, PUT } from '@/app/api/account/route';
import { prisma } from '@/lib/db';
import { NextRequest } from 'next/server';

// Mock Prisma client
jest.mock('@/lib/db', () => ({
  prisma: {
    account: {
      findFirst: jest.fn(),
      upsert: jest.fn(),
    },
  },
}));

describe('GET /api/account', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 with account data when account exists', async () => {
    // Mock data
    const mockAccount = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      balance: 5000.5,
      created_at: new Date(),
      updated_at: new Date(),
    };

    (prisma.account.findFirst as jest.Mock).mockResolvedValue(mockAccount);

    // Call handler
    const response = await GET();
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('balance');
    expect(data.balance).toBe(5000.5);
    expect(prisma.account.findFirst).toHaveBeenCalledTimes(1);
  });

  it('should return 200 with default account when no account exists', async () => {
    (prisma.account.findFirst as jest.Mock).mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('balance');
    expect(data.balance).toBe(0);
  });

  it('should return 500 on database error', async () => {
    (prisma.account.findFirst as jest.Mock).mockRejectedValue(
      new Error('Database connection failed')
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
  });
});

describe('PUT /api/account', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and update account balance with valid input', async () => {
    const mockUpdatedAccount = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      balance: 3500.75,
      created_at: new Date(),
      updated_at: new Date(),
    };

    (prisma.account.upsert as jest.Mock).mockResolvedValue(mockUpdatedAccount);

    // Create request with valid body
    const request = new NextRequest('http://localhost:3000/api/account', {
      method: 'PUT',
      body: JSON.stringify({ balance: 3500.75 }),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('id');
    expect(data.balance).toBe(3500.75);
    expect(prisma.account.upsert).toHaveBeenCalledTimes(1);
  });

  it('should accept negative balance (overdraft)', async () => {
    const mockUpdatedAccount = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      balance: -500.0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    (prisma.account.upsert as jest.Mock).mockResolvedValue(mockUpdatedAccount);

    const request = new NextRequest('http://localhost:3000/api/account', {
      method: 'PUT',
      body: JSON.stringify({ balance: -500.0 }),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.balance).toBe(-500.0);
  });

  it('should return 400 when balance is not a number', async () => {
    const request = new NextRequest('http://localhost:3000/api/account', {
      method: 'PUT',
      body: JSON.stringify({ balance: 'invalid' }),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
  });

  it('should return 400 when balance is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/account', {
      method: 'PUT',
      body: JSON.stringify({}),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
  });

  it('should return 400 when body is invalid JSON', async () => {
    const request = new NextRequest('http://localhost:3000/api/account', {
      method: 'PUT',
      body: 'invalid json',
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
  });

  it('should return 500 on database error', async () => {
    (prisma.account.upsert as jest.Mock).mockRejectedValue(
      new Error('Database connection failed')
    );

    const request = new NextRequest('http://localhost:3000/api/account', {
      method: 'PUT',
      body: JSON.stringify({ balance: 1000.0 }),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
  });

  it('should accept zero balance', async () => {
    const mockUpdatedAccount = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      balance: 0.0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    (prisma.account.upsert as jest.Mock).mockResolvedValue(mockUpdatedAccount);

    const request = new NextRequest('http://localhost:3000/api/account', {
      method: 'PUT',
      body: JSON.stringify({ balance: 0.0 }),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.balance).toBe(0.0);
  });
});
