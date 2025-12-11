# Research: Budget Tracker Application

**Phase**: 0 - Technical Research
**Date**: 2025-11-21
**Purpose**: Resolve technology choices, establish best practices, and document architectural decisions

## Technology Stack Decisions

### 1. Next.js 14 App Router

**Decision**: Use Next.js 14 with App Router for full-stack web application

**Rationale**:
- **Server-side rendering (SSR)** meets performance goals (< 2s initial load on 3G)
- **App Router** provides modern React Server Components with better performance than Pages Router
- **API Routes** eliminate need for separate backend framework, simplifying architecture
- **Automatic code splitting** keeps bundle size < 200KB gzipped
- **Built-in TypeScript support** aligns with type safety requirements
- **Production-ready** framework with strong ecosystem and active development

**Alternatives Considered**:
- **Remix**: Similar SSR capabilities but smaller ecosystem, less mature than Next.js
- **Vite + Express**: Would require maintaining separate frontend/backend projects, increasing complexity
- **Create React App**: Client-only rendering wouldn't meet < 2s load time on 3G networks

**Best Practices**:
- Use Server Components by default for better performance
- Move interactive UI to Client Components (marked with 'use client')
- Implement API routes in `src/app/api/` directory
- Use Next.js built-in font optimization and image optimization
- Leverage automatic static optimization where possible

**References**:
- Next.js 14 App Router: https://nextjs.org/docs/app
- App Router best practices: https://nextjs.org/docs/app/building-your-application

---

### 2. Material-UI (MUI) v5

**Decision**: Use Material-UI v5 for component library and design system

**Rationale**:
- **Comprehensive component library** covers all UI needs (forms, lists, dialogs, inputs)
- **Built-in accessibility** (ARIA attributes, keyboard navigation) helps meet WCAG 2.1 AA
- **Theming system** enables consistent design with minimal custom CSS
- **Responsive Grid system** simplifies mobile/tablet/desktop layouts
- **TypeScript support** provides type-safe props and theme customization
- **Active maintenance** and large community for troubleshooting

**Alternatives Considered**:
- **Ant Design**: Good components but heavier bundle size, less aligned with Material Design
- **Chakra UI**: Modern and lightweight but smaller component library, less mature
- **Custom CSS + Headless UI**: Maximum flexibility but requires designing entire system from scratch

**Best Practices**:
- Create custom theme in `src/styles/theme.ts` with brand colors
- Use MUI Grid/Box for responsive layouts instead of custom CSS
- Leverage MUI's elevation system for visual hierarchy
- Use MUI icons (`@mui/icons-material`) for consistency
- Implement form validation with MUI TextField error states
- Use MUI Skeleton for loading states, CircularProgress for async operations

**References**:
- MUI v5 documentation: https://mui.com/material-ui/
- MUI theming guide: https://mui.com/material-ui/customization/theming/
- MUI accessibility: https://mui.com/material-ui/guides/accessibility/

---

### 3. PostgreSQL 16 with Prisma ORM

**Decision**: Use PostgreSQL 16 as database with Prisma ORM for data access

**Rationale**:
- **PostgreSQL reliability**: ACID-compliant, mature database suitable for financial data
- **NUMERIC type**: Precise decimal arithmetic prevents floating-point errors in currency calculations
- **Prisma type safety**: Auto-generated TypeScript types from schema prevent runtime errors
- **Prisma migrations**: Version-controlled schema changes enable safe database evolution
- **Transaction support**: Prisma transactions ensure data consistency for multi-step operations
- **Docker compatibility**: PostgreSQL official image simplifies containerized deployment

**Alternatives Considered**:
- **SQLite**: Simpler but lacks concurrent write performance and network access for future scaling
- **MongoDB**: NoSQL flexibility not needed; relational model better fits structured budget data
- **MySQL**: Similar to PostgreSQL but lacks NUMERIC precision and has weaker JSON support

**Best Practices**:
- Use `NUMERIC(10, 2)` type for all currency amounts (prevents floating-point rounding errors)
- Create indexes on foreign keys and frequently queried columns
- Use Prisma transactions for operations affecting multiple tables
- Include `created_at` and `updated_at` timestamps on all tables for audit trail
- Use Prisma migrations for schema changes (never manually alter database)
- Implement connection pooling via Prisma's built-in pool management

**Schema Design Principles**:
- Single `account` table with one row (checking account balance)
- Separate tables for `savings`, `expenses`, `payments` with clear relationships
- Soft deletes not needed (spec allows hard deletes for simplicity)
- UUID primary keys provide globally unique identifiers

**References**:
- Prisma documentation: https://www.prisma.io/docs
- PostgreSQL NUMERIC type: https://www.postgresql.org/docs/current/datatype-numeric.html
- Prisma best practices: https://www.prisma.io/docs/guides/performance-and-optimization

---

### 4. Testing Strategy: Jest + RTL + Playwright + Supertest

**Decision**: Multi-layered testing approach with unit, integration, contract, and E2E tests

**Rationale**:
- **Jest + React Testing Library (RTL)**: Standard for React component testing, fast unit tests
- **Supertest**: API testing without starting full server, validates contract compliance
- **Playwright**: Modern E2E framework with cross-browser support and auto-waiting
- **Coverage-driven**: Aligns with constitution requirement (80% financial logic, 60% UI)

**Testing Strategy by Layer**:

1. **Unit Tests (Jest)**:
   - Budget calculation functions in `src/lib/calculations.ts`
   - Currency formatting in `src/lib/formatters.ts`
   - Validation schemas in `src/lib/validation.ts`
   - Target: 100% coverage for pure functions

2. **Integration Tests (Jest + RTL)**:
   - React components with mock data
   - Component interactions and state management
   - Form validation and error handling
   - Target: 60% coverage for UI components

3. **Contract Tests (Supertest)**:
   - API endpoint request/response format
   - Status codes and error messages
   - Input validation enforcement
   - Database interaction (with test database)
   - Target: 100% coverage for API routes

4. **E2E Tests (Playwright)**:
   - Full user journeys from spec.md
   - Cross-browser testing (Chrome, Firefox, Safari)
   - Mobile viewport testing
   - Critical path: Dashboard → Add savings/expenses/payments → Verify budget

**Best Practices**:
- Write tests BEFORE implementation (TDD for business logic)
- Use test databases that mirror production schema
- Mock external dependencies (but not internal modules)
- Implement CI pipeline that runs all test suites
- Use test coverage reports to identify gaps
- Keep E2E tests focused on happy paths and critical flows

**References**:
- Jest documentation: https://jestjs.io/docs/getting-started
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro/
- Playwright documentation: https://playwright.dev/docs/intro
- Supertest documentation: https://github.com/visionmedia/supertest

---

### 5. Docker Containerization

**Decision**: Use Docker Compose with separate containers for Next.js app and PostgreSQL

**Rationale**:
- **Environment consistency**: Eliminates "works on my machine" issues
- **Simple deployment**: Single `docker-compose up` command starts entire stack
- **Isolation**: Database and app run in separate containers with defined networking
- **Production-ready**: Same containers in development and production
- **Easy setup**: Meets constitution requirement (< 15 min setup for new developers)

**Container Architecture**:
- **Next.js container**: Node 20 Alpine, builds and runs Next.js app on port 3000
- **PostgreSQL container**: Official PostgreSQL 16 image on port 5432
- **Docker network**: Allows containers to communicate via service names
- **Volumes**: Persist PostgreSQL data and enable hot-reload for development

**Best Practices**:
- Use multi-stage Dockerfile to minimize image size
- Set NODE_ENV=production for production builds
- Use `.env` file for configuration (DATABASE_URL, etc.)
- Implement health checks for both containers
- Use Docker secrets for sensitive values in production
- Document Docker commands in README.md

**docker-compose.yml structure**:
```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: budget_app
      POSTGRES_USER: budget_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  app:
    build: .
    environment:
      DATABASE_URL: postgresql://budget_user:${DB_PASSWORD}@db:5432/budget_app
      NODE_ENV: development
    ports:
      - "3000:3000"
    depends_on:
      - db
    volumes:
      - ./src:/app/src  # Hot reload in development
```

**References**:
- Docker Compose documentation: https://docs.docker.com/compose/
- Next.js Docker deployment: https://nextjs.org/docs/deployment#docker-image
- PostgreSQL Docker image: https://hub.docker.com/_/postgres

---

### 6. Input Validation with Zod

**Decision**: Use Zod for schema validation on both client and server

**Rationale**:
- **TypeScript-first**: Infer TypeScript types directly from schemas
- **Reusable schemas**: Share validation between API routes and frontend forms
- **Clear error messages**: Transform Zod errors into user-friendly messages
- **Runtime safety**: Validates data at runtime, not just compile time
- **Prisma integration**: Compatible with Prisma-generated types

**Best Practices**:
- Define schemas in `src/lib/validation.ts`
- Validate all API route inputs before database operations
- Use Zod refinements for custom validation (e.g., positive amounts)
- Transform Zod errors into user-facing messages via helper function
- Validate form inputs on client side for immediate feedback

**Example Schema**:
```typescript
import { z } from 'zod';

export const SavingsSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  amount: z.number().positive('Amount must be positive').multipleOf(0.01)
});
```

**References**:
- Zod documentation: https://zod.dev/
- Zod with Next.js: https://zod.dev/?id=nextjs

---

## Architecture Decisions

### State Management

**Decision**: Use React Server Components + URL state, no global state library

**Rationale**:
- Server Components fetch data directly, reducing client-side state
- URL search params for filter/sort state (shareable, bookmarkable)
- React Context for theme and UI preferences only
- No Redux/Zustand needed for this simple CRUD app

**When to use Client Components**:
- Interactive forms (AccountBalanceInput, ItemForm)
- Components with event handlers (delete buttons, submit buttons)
- Components using React hooks (useState, useEffect)

---

### API Design Pattern

**Decision**: RESTful API routes following resource-based URLs

**Rationale**:
- Standard HTTP methods (GET, POST, PUT, DELETE) map to CRUD operations
- Resource-based URLs are intuitive (`/api/savings`, `/api/expenses`)
- Next.js App Router supports all HTTP methods in route handlers

**API Patterns**:
- **GET /api/account**: Fetch checking account balance
- **PUT /api/account**: Update checking account balance
- **GET /api/savings**: List all virtual savings categories
- **POST /api/savings**: Create new savings category
- **PUT /api/savings/[id]**: Update savings category
- **DELETE /api/savings/[id]**: Delete savings category
- (Similar patterns for /api/expenses and /api/payments)

---

### Currency Handling

**Decision**: Store amounts as NUMERIC(10,2) in database, use Dinero.js for calculations

**Rationale**:
- **PostgreSQL NUMERIC**: Exact decimal precision, no floating-point errors
- **Dinero.js**: Money library that uses integer arithmetic internally
- **Consistent formatting**: Locale-aware currency display

**Best Practices**:
- Always validate amounts are positive where required
- Display currency with 2 decimal places (e.g., $1,234.56)
- Perform calculations in cents/smallest unit to avoid rounding errors
- Use Dinero.js for any arithmetic (addition, subtraction, multiplication)

**References**:
- Dinero.js documentation: https://v2.dinerojs.com/docs

---

### Error Handling Strategy

**Decision**: Structured error responses with HTTP status codes + user-friendly messages

**API Error Format**:
```typescript
{
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Amount must be positive',
    details: { field: 'amount', value: -100 }
  }
}
```

**HTTP Status Codes**:
- 200: Success
- 400: Bad request (validation error)
- 404: Resource not found
- 500: Server error

**Client-Side Error Display**:
- Use MUI Alert/Snackbar for error notifications
- Show field-level errors on forms
- Log errors to console in development

---

## Performance Optimizations

### Database Query Optimization

**Decisions**:
1. **Indexes**: Add indexes on frequently queried columns (id, created_at)
2. **Eager loading**: Use Prisma `include` to fetch related data in one query
3. **Connection pooling**: Prisma automatically manages connection pool

### Frontend Performance

**Decisions**:
1. **Code splitting**: Next.js automatic route-based code splitting
2. **Image optimization**: Use Next.js `<Image>` component
3. **Font optimization**: Use Next.js font optimization
4. **Memoization**: Use React.memo() for expensive component renders
5. **Debouncing**: Debounce real-time budget updates (300ms delay)

---

## Security Considerations

### Input Validation

**Implementation**:
- Validate all inputs with Zod schemas
- Sanitize HTML inputs to prevent XSS
- Use parameterized queries via Prisma (prevents SQL injection)

### Environment Variables

**Implementation**:
- Store DATABASE_URL in .env file (never commit)
- Use Docker secrets for production credentials
- Validate required env vars at startup

### CORS & CSP

**Implementation**:
- Configure CORS headers for API routes (restrict origins in production)
- Set Content-Security-Policy headers to prevent XSS
- Use HTTPS in production (TLS 1.3+)

---

## Development Workflow

### Setup Process (< 15 minutes)

1. Clone repository
2. Copy `.env.example` to `.env` and set `DB_PASSWORD`
3. Run `docker-compose up -d` to start containers
4. Run `npx prisma migrate dev` to initialize database
5. Open http://localhost:3000 in browser

**Prerequisites**:
- Docker Desktop installed
- Node.js 20+ installed (for running Prisma CLI)

### Development Commands

```bash
# Start development environment
docker-compose up

# Run tests
npm test                  # All tests
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests
npm run test:e2e         # E2E tests

# Database operations
npx prisma migrate dev   # Create migration
npx prisma studio        # View data in GUI
npx prisma generate      # Regenerate types

# Linting & formatting
npm run lint             # ESLint
npm run format           # Prettier
```

---

## Summary

All technology choices satisfy constitution requirements:
- ✅ **Code Quality**: TypeScript strict mode, ESLint, Prettier
- ✅ **Testing**: Jest, RTL, Playwright, Supertest (80% / 60% coverage targets)
- ✅ **UX Consistency**: MUI design system, WCAG 2.1 AA accessibility
- ✅ **Performance**: Next.js SSR, code splitting, PostgreSQL indexes (< 2s load, < 200ms API)
- ✅ **Documentation**: This research.md, upcoming data-model.md and quickstart.md
- ✅ **Security**: Zod validation, Prisma parameterized queries, environment variables

No additional research needed. Ready to proceed to Phase 1 (Design & Contracts).
