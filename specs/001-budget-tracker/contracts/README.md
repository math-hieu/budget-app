# API Contracts

This directory contains API contract specifications for the Budget Tracker application.

## Files

- **openapi.yaml**: OpenAPI 3.0 specification for all REST API endpoints

## Endpoints Summary

### Account Management
- `GET /api/account` - Fetch checking account balance
- `PUT /api/account` - Update checking account balance

### Virtual Savings
- `GET /api/savings` - List all savings categories
- `POST /api/savings` - Create savings category
- `PUT /api/savings/:id` - Update savings category
- `DELETE /api/savings/:id` - Delete savings category

### Recurring Expenses
- `GET /api/expenses` - List all recurring expenses
- `POST /api/expenses` - Create recurring expense
- `PUT /api/expenses/:id` - Update recurring expense
- `DELETE /api/expenses/:id` - Delete recurring expense

### Pending Payments
- `GET /api/payments` - List all pending payments
- `POST /api/payments` - Create pending payment
- `PUT /api/payments/:id` - Update pending payment (including marking as paid)
- `DELETE /api/payments/:id` - Delete pending payment

## Validation Rules

### Account
- `balance`: NUMERIC, can be negative (overdraft)

### Virtual Savings
- `name`: 1-100 characters, required
- `amount`: >= 0, max 2 decimal places, required

### Recurring Expense
- `description`: 1-200 characters, required
- `amount`: >= 0, max 2 decimal places, required

### Pending Payment
- `description`: 1-200 characters, required
- `amount`: >= 0, max 2 decimal places, required
- `is_paid`: boolean, defaults to false

## Error Codes

- `VALIDATION_ERROR` (400): Input validation failed
- `NOT_FOUND` (404): Resource not found
- `INTERNAL_ERROR` (500): Server error

## Testing

Contract tests will be implemented using Supertest in `tests/contract/` directory to validate:
- Request/response schemas match OpenAPI spec
- Status codes are correct
- Validation errors are properly returned
- CRUD operations work end-to-end

## Viewing the API Spec

Use Swagger Editor to visualize the API:
```bash
# Option 1: Online
# Visit https://editor.swagger.io/ and paste contents of openapi.yaml

# Option 2: Local (if swagger-ui installed)
npx swagger-ui-watcher openapi.yaml
```

## Implementation

API routes will be implemented in Next.js App Router:
- `src/app/api/account/route.ts`
- `src/app/api/savings/route.ts`
- `src/app/api/savings/[id]/route.ts`
- `src/app/api/expenses/route.ts`
- `src/app/api/expenses/[id]/route.ts`
- `src/app/api/payments/route.ts`
- `src/app/api/payments/[id]/route.ts`
