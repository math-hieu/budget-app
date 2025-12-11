import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/expenses/route';
import { GET as GET_BY_ID, PUT, DELETE } from '@/app/api/expenses/[id]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Contract Tests: /api/expenses', () => {
  beforeEach(async () => {
    // Clean up expenses before each test
    await prisma.recurringExpense.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/expenses', () => {
    it('should return 200 with empty array when no expenses exist', async () => {
      const request = new NextRequest('http://localhost:3000/api/expenses');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
    });

    it('should return 200 with array of expenses', async () => {
      // Create test expenses
      await prisma.recurringExpense.createMany({
        data: [
          { description: 'Rent', amount: 1200.00 },
          { description: 'Utilities', amount: 150.50 }
        ]
      });

      const request = new NextRequest('http://localhost:3000/api/expenses');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2);
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('description');
      expect(data[0]).toHaveProperty('amount');
      expect(data[0]).toHaveProperty('created_at');
      expect(data[0]).toHaveProperty('updated_at');
    });

    it('should return expenses ordered by created_at', async () => {
      const expense1 = await prisma.recurringExpense.create({
        data: { description: 'First', amount: 100.00 }
      });

      // Wait a bit to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));

      const expense2 = await prisma.recurringExpense.create({
        data: { description: 'Second', amount: 200.00 }
      });

      const request = new NextRequest('http://localhost:3000/api/expenses');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data[0].id).toBe(expense1.id);
      expect(data[1].id).toBe(expense2.id);
    });
  });

  describe('POST /api/expenses', () => {
    it('should return 201 and create new expense with valid data', async () => {
      const requestBody = {
        description: 'Internet',
        amount: 79.99
      };

      const request = new NextRequest('http://localhost:3000/api/expenses', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('id');
      expect(data.description).toBe('Internet');
      expect(parseFloat(data.amount)).toBe(79.99);

      // Verify in database
      const dbExpense = await prisma.recurringExpense.findUnique({
        where: { id: data.id }
      });
      expect(dbExpense).not.toBeNull();
      expect(dbExpense?.description).toBe('Internet');
    });

    it('should return 400 for negative amount', async () => {
      const requestBody = {
        description: 'Test',
        amount: -50.00
      };

      const request = new NextRequest('http://localhost:3000/api/expenses', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should return 400 for empty description', async () => {
      const requestBody = {
        description: '',
        amount: 100.00
      };

      const request = new NextRequest('http://localhost:3000/api/expenses', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should return 400 for description exceeding 200 characters', async () => {
      const requestBody = {
        description: 'a'.repeat(201),
        amount: 100.00
      };

      const request = new NextRequest('http://localhost:3000/api/expenses', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should trim whitespace from description', async () => {
      const requestBody = {
        description: '  Rent  ',
        amount: 1200.00
      };

      const request = new NextRequest('http://localhost:3000/api/expenses', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.description).toBe('Rent');
    });
  });

  describe('PUT /api/expenses/:id', () => {
    it('should return 200 and update expense with valid data', async () => {
      const expense = await prisma.recurringExpense.create({
        data: { description: 'Old Description', amount: 100.00 }
      });

      const requestBody = {
        description: 'Updated Description',
        amount: 150.00
      };

      const request = new NextRequest(
        `http://localhost:3000/api/expenses/${expense.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(requestBody)
        }
      );

      const response = await PUT(request, { params: { id: expense.id } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe(expense.id);
      expect(data.description).toBe('Updated Description');
      expect(parseFloat(data.amount)).toBe(150.00);
    });

    it('should return 404 for non-existent expense', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const requestBody = {
        description: 'Test',
        amount: 100.00
      };

      const request = new NextRequest(
        `http://localhost:3000/api/expenses/${nonExistentId}`,
        {
          method: 'PUT',
          body: JSON.stringify(requestBody)
        }
      );

      const response = await PUT(request, { params: { id: nonExistentId } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty('error');
    });

    it('should return 400 for invalid amount', async () => {
      const expense = await prisma.recurringExpense.create({
        data: { description: 'Test', amount: 100.00 }
      });

      const requestBody = {
        description: 'Test',
        amount: -50.00
      };

      const request = new NextRequest(
        `http://localhost:3000/api/expenses/${expense.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(requestBody)
        }
      );

      const response = await PUT(request, { params: { id: expense.id } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });
  });

  describe('DELETE /api/expenses/:id', () => {
    it('should return 204 and delete expense', async () => {
      const expense = await prisma.recurringExpense.create({
        data: { description: 'To Delete', amount: 100.00 }
      });

      const request = new NextRequest(
        `http://localhost:3000/api/expenses/${expense.id}`,
        {
          method: 'DELETE'
        }
      );

      const response = await DELETE(request, { params: { id: expense.id } });

      expect(response.status).toBe(204);

      // Verify deletion
      const dbExpense = await prisma.recurringExpense.findUnique({
        where: { id: expense.id }
      });
      expect(dbExpense).toBeNull();
    });

    it('should return 404 for non-existent expense', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const request = new NextRequest(
        `http://localhost:3000/api/expenses/${nonExistentId}`,
        {
          method: 'DELETE'
        }
      );

      const response = await DELETE(request, { params: { id: nonExistentId } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty('error');
    });
  });
});
