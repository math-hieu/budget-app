# Quickstart Guide: Budget Tracker Application

**Target Time**: Setup completed in < 15 minutes
**Prerequisites**: Docker Desktop, Node.js 20+

## Quick Start (TL;DR)

```bash
# 1. Clone and navigate to project
cd budget-app

# 2. Set up environment
cp .env.example .env
# Edit .env and set DB_PASSWORD=your_secure_password

# 3. Start Docker containers
docker-compose up -d

# 4. Initialize database
npx prisma migrate dev

# 5. Seed database (optional)
npx prisma db seed

# 6. Open application
open http://localhost:3000
```

Done! The application should now be running.

---

## Detailed Setup Instructions

### Step 1: Prerequisites Check

**Required Software**:
- **Docker Desktop**: [Download here](https://www.docker.com/products/docker-desktop/)
- **Node.js 20+**: [Download here](https://nodejs.org/)
- **Git**: [Download here](https://git-scm.com/)

**Verify installations**:
```bash
docker --version        # Should show Docker version 20+
node --version          # Should show Node.js v20+
npm --version           # Should show npm 10+
```

---

### Step 2: Clone Repository

```bash
# Clone the repository
git clone <repository-url>
cd budget-app

# Checkout feature branch (if applicable)
git checkout 001-budget-tracker
```

---

### Step 3: Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your settings
nano .env  # or use your preferred editor
```

**Required environment variables** (`.env`):
```bash
# Database configuration
DB_PASSWORD=your_secure_password_here

# Database URL (used by Prisma)
DATABASE_URL=postgresql://budget_user:${DB_PASSWORD}@localhost:5432/budget_app

# Node environment
NODE_ENV=development

# Next.js configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**Security Note**: Never commit `.env` to version control. It's already in `.gitignore`.

---

### Step 4: Install Dependencies

```bash
# Install Node.js dependencies
npm install

# This installs:
# - Next.js 14
# - React 18
# - Material-UI v5
# - Prisma ORM
# - Testing libraries (Jest, Playwright, RTL)
```

Expected output: `added XXX packages in Xs`

---

### Step 5: Start Docker Containers

```bash
# Start PostgreSQL and Next.js containers in detached mode
docker-compose up -d

# Verify containers are running
docker-compose ps
```

Expected output:
```
NAME                   STATUS        PORTS
budget-app-db-1        Up           0.0.0.0:5432->5432/tcp
budget-app-app-1       Up           0.0.0.0:3000->3000/tcp
```

**What's happening**:
- PostgreSQL 16 container starts on port 5432
- Next.js development server starts on port 3000
- Containers communicate via Docker network

---

### Step 6: Initialize Database

```bash
# Run Prisma migrations to create database schema
npx prisma migrate dev --name init

# This creates all tables:
# - account
# - virtual_saving
# - recurring_expense
# - pending_payment
```

Expected output: `✔ Generated Prisma Client`

**View database schema** (optional):
```bash
# Open Prisma Studio (database GUI)
npx prisma studio

# Opens at http://localhost:5555
```

---

### Step 7: Seed Database (Optional)

```bash
# Populate database with default data
npx prisma db seed

# This creates:
# - Default account with $0.00 balance
```

---

### Step 8: Verify Application

**Open in browser**:
```bash
open http://localhost:3000
```

**Expected behavior**:
1. Dashboard loads with "Remaining Budget: $0.00"
2. Navigation shows 4 sections: Dashboard, Savings, Expenses, Payments
3. Can input checking account balance and see it update
4. Can navigate to savings/expenses/payments screens

---

## Development Workflow

### Running the Application

```bash
# Start containers (if not already running)
docker-compose up

# Or in detached mode (background)
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop containers
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

---

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit          # Unit tests (Jest)
npm run test:integration   # Component integration tests (RTL)
npm run test:contract      # API contract tests (Supertest)
npm run test:e2e           # End-to-end tests (Playwright)

# Watch mode (re-runs tests on file change)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Coverage targets**:
- Financial logic (calculations): 80%
- UI components: 60%

---

### Linting & Formatting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable lint errors
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting without changing files
npm run format:check
```

---

### Database Operations

```bash
# View database in GUI
npx prisma studio

# Create new migration
npx prisma migrate dev --name <migration_name>

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Generate Prisma Client (after schema changes)
npx prisma generate

# View migration status
npx prisma migrate status
```

---

### Accessing Services

- **Application**: http://localhost:3000
- **API Endpoints**: http://localhost:3000/api/*
- **Prisma Studio**: http://localhost:5555 (when running `npx prisma studio`)
- **PostgreSQL**: localhost:5432 (use any SQL client)

**PostgreSQL connection details**:
```
Host: localhost
Port: 5432
Database: budget_app
Username: budget_user
Password: <value from .env>
```

---

## Troubleshooting

### Problem: Port already in use

**Error**: `Error starting userland proxy: listen tcp4 0.0.0.0:3000: bind: address already in use`

**Solution**:
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "3001:3000"  # Change 3000 to 3001
```

---

### Problem: Database connection refused

**Error**: `Can't reach database server at localhost:5432`

**Solution**:
```bash
# Check if PostgreSQL container is running
docker-compose ps

# If not running, start it
docker-compose up -d db

# Check container logs for errors
docker-compose logs db

# Verify DATABASE_URL in .env is correct
echo $DATABASE_URL
```

---

### Problem: Prisma Client not found

**Error**: `Cannot find module '@prisma/client'`

**Solution**:
```bash
# Reinstall dependencies
npm install

# Generate Prisma Client
npx prisma generate
```

---

### Problem: Migration failed

**Error**: `Migration failed to apply cleanly to the shadow database`

**Solution**:
```bash
# Reset database and re-run migrations
npx prisma migrate reset

# Confirm with 'y' when prompted
```

---

### Problem: Docker out of disk space

**Error**: `no space left on device`

**Solution**:
```bash
# Clean up unused Docker resources
docker system prune -a --volumes

# Confirm with 'y' when prompted
```

---

## Project Structure Overview

```
budget-app/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API routes
│   │   └── *.tsx         # Pages (dashboard, savings, expenses, payments)
│   ├── components/       # React components
│   ├── lib/              # Business logic & utilities
│   ├── types/            # TypeScript types
│   └── styles/           # MUI theme
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── tests/                # Test files
├── docker/               # Docker configuration
├── .env                  # Environment variables (not in git)
└── package.json          # Dependencies
```

---

## Next Steps

1. **Read the Spec**: Check [spec.md](./spec.md) for user stories and requirements
2. **Review Data Model**: Check [data-model.md](./data-model.md) for database schema
3. **API Contracts**: Check [contracts/openapi.yaml](./contracts/openapi.yaml) for API endpoints
4. **Run Tests**: Execute `npm test` to ensure everything works
5. **Start Coding**: Follow TDD approach - write tests first!

---

## Development Resources

**Documentation**:
- Next.js 14: https://nextjs.org/docs
- Material-UI: https://mui.com/material-ui/
- Prisma: https://www.prisma.io/docs
- TypeScript: https://www.typescriptlang.org/docs/

**Testing**:
- Jest: https://jestjs.io/docs/getting-started
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro/
- Playwright: https://playwright.dev/docs/intro

**Tools**:
- Prisma Studio: Visual database editor
- Swagger Editor: API spec viewer (https://editor.swagger.io/)

---

## Getting Help

**Common Commands Reference**:
```bash
# Development
docker-compose up          # Start app
npm test                   # Run tests
npx prisma studio          # View database
npm run lint               # Check code quality

# Database
npx prisma migrate dev     # Create migration
npx prisma generate        # Generate types
npx prisma migrate reset   # Reset database

# Debugging
docker-compose logs -f app # View app logs
docker-compose logs -f db  # View DB logs
```

**If stuck**:
1. Check troubleshooting section above
2. Review error messages in terminal
3. Check Docker container logs: `docker-compose logs`
4. Ensure all prerequisites are installed

---

## Summary

You should now have:
- ✅ Docker containers running (PostgreSQL + Next.js)
- ✅ Database initialized with schema
- ✅ Application accessible at http://localhost:3000
- ✅ Tests passing
- ✅ Development environment ready

**Total setup time**: 10-15 minutes (as per constitution requirement)

Happy coding! 🚀
