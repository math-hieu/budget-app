# Data Model: Budget Tracker Application

**Phase**: 1 - Design
**Date**: 2025-11-21
**Purpose**: Define database schema, entity relationships, and validation rules

## Entity Relationship Diagram

```
┌─────────────────────┐
│      Account        │
│─────────────────────│
│ id: UUID (PK)       │
│ balance: NUMERIC    │
│ created_at: TIMESTAMP│
│ updated_at: TIMESTAMP│
└─────────────────────┘

┌─────────────────────┐
│   VirtualSaving     │
│─────────────────────│
│ id: UUID (PK)       │
│ name: VARCHAR(100)  │
│ amount: NUMERIC     │
│ created_at: TIMESTAMP│
│ updated_at: TIMESTAMP│
└─────────────────────┘

┌─────────────────────┐
│  RecurringExpense   │
│─────────────────────│
│ id: UUID (PK)       │
│ description: VARCHAR│
│ amount: NUMERIC     │
│ created_at: TIMESTAMP│
│ updated_at: TIMESTAMP│
└─────────────────────┘

┌─────────────────────┐
│  PendingPayment     │
│─────────────────────│
│ id: UUID (PK)       │
│ description: VARCHAR│
│ amount: NUMERIC     │
│ is_paid: BOOLEAN    │
│ created_at: TIMESTAMP│
│ updated_at: TIMESTAMP│
└─────────────────────┘
```

**Relationships**: No foreign keys. All entities are independent. The `Account` table has exactly one row (single-user MVP).

**Calculated Field** (not stored):
- **Remaining Budget** = Account.balance - (SUM(VirtualSaving.amount) + SUM(RecurringExpense.amount) + SUM(PendingPayment.amount WHERE is_paid = false))

---

## Entity Definitions

### 1. Account

**Purpose**: Stores the user's checking account balance (single row)

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| balance | NUMERIC(10, 2) | NOT NULL | Current checking account balance. Can be negative (overdraft). |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Validation Rules**:
- `balance` must be a valid decimal number with max 2 decimal places
- `balance` can be negative (to accommodate overdraft situations per FR-012)
- Only one row should exist in this table (enforced at application level)

**Business Logic**:
- When user enters balance, update this single row
- If no row exists on first load, create one with balance = 0.00

**Example**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "balance": "3500.00",
  "created_at": "2025-11-21T10:00:00Z",
  "updated_at": "2025-11-21T15:30:00Z"
}
```

---

### 2. VirtualSaving

**Purpose**: Represents user-defined savings categories (emergency fund, vacation, etc.)

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| name | VARCHAR(100) | NOT NULL | Savings category name (e.g., "Emergency Fund") |
| amount | NUMERIC(10, 2) | NOT NULL | Amount allocated to this savings category |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Validation Rules**:
- `name` must be 1-100 characters, non-empty after trimming whitespace
- `amount` must be >= 0 (savings cannot be negative)
- `amount` must have max 2 decimal places
- `name` should be unique (enforced at application level, not database level)

**Business Logic**:
- User can create multiple savings categories
- Sum of all `amount` values reduces the remaining budget
- Deleting a savings category releases its amount back to remaining budget

**Example**:
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Emergency Fund",
  "amount": "1000.00",
  "created_at": "2025-11-21T10:05:00Z",
  "updated_at": "2025-11-21T10:05:00Z"
}
```

---

### 3. RecurringExpense

**Purpose**: Represents predictable monthly expenses (rent, utilities, subscriptions)

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| description | VARCHAR(200) | NOT NULL | Expense description (e.g., "Rent", "Netflix Subscription") |
| amount | NUMERIC(10, 2) | NOT NULL | Monthly expense amount |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Validation Rules**:
- `description` must be 1-200 characters, non-empty after trimming whitespace
- `amount` must be >= 0 (expenses cannot be negative)
- `amount` must have max 2 decimal places

**Business Logic**:
- User can create multiple recurring expenses
- Sum of all `amount` values reduces the remaining budget
- These are monthly expenses only (no weekly/quarterly per spec assumptions)
- Deleting an expense releases its amount back to remaining budget

**Example**:
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "description": "Rent",
  "amount": "1200.00",
  "created_at": "2025-11-21T10:10:00Z",
  "updated_at": "2025-11-21T10:10:00Z"
}
```

---

### 4. PendingPayment

**Purpose**: Represents one-time upcoming payments (bills not yet paid, planned purchases)

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| description | VARCHAR(200) | NOT NULL | Payment description (e.g., "Car repair", "Electric bill") |
| amount | NUMERIC(10, 2) | NOT NULL | Payment amount |
| is_paid | BOOLEAN | NOT NULL, DEFAULT FALSE | Whether payment has been marked as paid |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Validation Rules**:
- `description` must be 1-200 characters, non-empty after trimming whitespace
- `amount` must be >= 0 (payments cannot be negative)
- `amount` must have max 2 decimal places
- `is_paid` must be boolean (true/false)

**Business Logic**:
- User can create multiple pending payments
- Only unpaid payments (is_paid = false) reduce the remaining budget
- When user marks payment as paid (is_paid = true), it no longer affects budget
- Paid payments can be soft-deleted or filtered out from display
- Deleting an unpaid payment releases its amount back to remaining budget

**State Transitions**:
- **Created**: is_paid = false → affects budget
- **Marked as paid**: is_paid = true → no longer affects budget
- **Deleted**: removed from database

**Example**:
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "description": "Car repair",
  "amount": "450.00",
  "is_paid": false,
  "created_at": "2025-11-21T10:15:00Z",
  "updated_at": "2025-11-21T10:15:00Z"
}
```

---

## Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Account {
  id         String   @id @default(uuid())
  balance    Decimal  @db.Decimal(10, 2)
  created_at DateTime @default(now()) @map("created_at")
  updated_at DateTime @updatedAt @map("updated_at")

  @@map("account")
}

model VirtualSaving {
  id         String   @id @default(uuid())
  name       String   @db.VarChar(100)
  amount     Decimal  @db.Decimal(10, 2)
  created_at DateTime @default(now()) @map("created_at")
  updated_at DateTime @updatedAt @map("updated_at")

  @@map("virtual_saving")
}

model RecurringExpense {
  id          String   @id @default(uuid())
  description String   @db.VarChar(200)
  amount      Decimal  @db.Decimal(10, 2)
  created_at  DateTime @default(now()) @map("created_at")
  updated_at  DateTime @updatedAt @map("updated_at")

  @@map("recurring_expense")
}

model PendingPayment {
  id          String   @id @default(uuid())
  description String   @db.VarChar(200)
  amount      Decimal  @db.Decimal(10, 2)
  is_paid     Boolean  @default(false) @map("is_paid")
  created_at  DateTime @default(now()) @map("created_at")
  updated_at  DateTime @updatedAt @map("updated_at")

  @@map("pending_payment")
}
```

---

## Database Indexes

**Performance Optimization**:

```sql
-- Primary keys are automatically indexed

-- Index for filtering unpaid payments (used in budget calculation)
CREATE INDEX idx_pending_payment_is_paid ON pending_payment(is_paid);

-- Index for sorting by creation date (if displaying chronologically)
CREATE INDEX idx_virtual_saving_created_at ON virtual_saving(created_at);
CREATE INDEX idx_recurring_expense_created_at ON recurring_expense(created_at);
CREATE INDEX idx_pending_payment_created_at ON pending_payment(created_at);
```

**Note**: Prisma will handle these indexes via migration files when they're added to the schema with `@@index` directives.

---

## Budget Calculation Logic

**Formula**:
```
Remaining Budget = Account.balance - (
  SUM(VirtualSaving.amount) +
  SUM(RecurringExpense.amount) +
  SUM(PendingPayment.amount WHERE is_paid = false)
)
```

**Implementation** (in `src/lib/calculations.ts`):

```typescript
interface BudgetData {
  accountBalance: number;
  virtualSavings: { amount: number }[];
  recurringExpenses: { amount: number }[];
  pendingPayments: { amount: number; isPaid: boolean }[];
}

export function calculateRemainingBudget(data: BudgetData): number {
  const totalSavings = data.virtualSavings.reduce((sum, s) => sum + s.amount, 0);
  const totalExpenses = data.recurringExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalPending = data.pendingPayments
    .filter(p => !p.isPaid)
    .reduce((sum, p) => sum + p.amount, 0);

  const remaining = data.accountBalance - (totalSavings + totalExpenses + totalPending);

  // Round to 2 decimal places to handle floating point precision
  return Math.round(remaining * 100) / 100;
}
```

**Database Query** (Prisma example):

```typescript
async function fetchBudgetData() {
  const [account, savings, expenses, payments] = await Promise.all([
    prisma.account.findFirst(),
    prisma.virtualSaving.findMany(),
    prisma.recurringExpense.findMany(),
    prisma.pendingPayment.findMany()
  ]);

  return {
    accountBalance: account?.balance.toNumber() ?? 0,
    virtualSavings: savings.map(s => ({ amount: s.amount.toNumber() })),
    recurringExpenses: expenses.map(e => ({ amount: e.amount.toNumber() })),
    pendingPayments: payments.map(p => ({
      amount: p.amount.toNumber(),
      isPaid: p.is_paid
    }))
  };
}
```

---

## Data Validation Summary

**All Entities**:
- ✅ UUID primary keys for global uniqueness
- ✅ NUMERIC(10, 2) for precise currency calculations (no floating-point errors)
- ✅ Timestamps for audit trail (created_at, updated_at)
- ✅ NOT NULL constraints on required fields

**Field-Specific**:
- ✅ Account balance can be negative (overdraft support)
- ✅ All amounts must have max 2 decimal places
- ✅ Savings, expenses, payments amounts must be >= 0
- ✅ Description/name fields have length limits (100-200 chars)
- ✅ Boolean flag for paid status on pending payments

**Application-Level Validation** (via Zod):
- Trim whitespace from text inputs
- Enforce positive amounts where required
- Enforce unique names for savings categories (UX niceness, not database constraint)
- Validate budget calculation inputs before storing

---

## Migration Strategy

**Initial Migration** (creates all tables):

```bash
npx prisma migrate dev --name init
```

This will:
1. Create all four tables (account, virtual_saving, recurring_expense, pending_payment)
2. Set up UUID generation
3. Create indexes on primary keys
4. Apply NOT NULL and default constraints

**Seed Data** (for development):

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create default account with zero balance
  await prisma.account.create({
    data: {
      balance: 0.00
    }
  });

  console.log('Database seeded with default account');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
```

Run seed: `npx prisma db seed`

---

## Data Integrity Rules

1. **Single Account**: Application ensures only one account row exists
2. **No Orphans**: All entities are independent; no foreign key constraints needed
3. **Soft Deletes**: Not implemented (spec allows hard deletes for simplicity)
4. **Cascading**: N/A (no relationships)
5. **Transactions**: Use Prisma transactions for operations affecting budget calculation to ensure consistency

**Example Transaction** (creating savings + updating budget):
```typescript
await prisma.$transaction(async (tx) => {
  await tx.virtualSaving.create({
    data: { name: "Emergency Fund", amount: 1000.00 }
  });

  // Budget is recalculated on next fetch, no explicit update needed
});
```

---

## Summary

**Entity Count**: 4 tables (Account, VirtualSaving, RecurringExpense, PendingPayment)

**Total Fields**: 20 database columns across all tables

**Relationships**: None (all entities independent)

**Key Design Decisions**:
- ✅ NUMERIC(10,2) for currency precision
- ✅ UUID primary keys for scalability
- ✅ Timestamps for audit trail
- ✅ Boolean flag for payment status
- ✅ No foreign keys (simple independent entities)
- ✅ Remaining budget calculated, not stored

**Ready for Phase 1 continuation**: API contracts and quickstart guide.
