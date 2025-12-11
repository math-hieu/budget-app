# Budget Tracker Application

A simple and elegant web application to track your monthly budget, savings, expenses, and pending payments.

## Features

✅ **Dashboard** - View your remaining budget at a glance
- Set your checking account balance
- See real-time budget calculations
- Visual indicators for positive/negative budget

✅ **Virtual Savings** - Track money set aside for goals
- Create savings categories
- Edit and delete savings
- See total savings impact on budget

✅ **Recurring Expenses** - Manage monthly bills
- Track monthly recurring expenses
- Mark expenses as paid/unpaid each month
- Reset payment status at the beginning of each month
- Only unpaid expenses reduce your budget

✅ **Pending Payments** - Track upcoming one-time payments
- Add bills or purchases you need to pay
- Delete payments once completed
- All pending payments reduce your budget

## Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **UI**: Material-UI (MUI) v5
- **Database**: PostgreSQL with Prisma ORM
- **Testing**: Jest, React Testing Library, Playwright
- **Containerization**: Docker & Docker Compose

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose (for database)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   cd budget-app
   ```

2. **Install dependencies**
   ```bash
   make install
   # or
   npm install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env
   ```

4. **Start the database**
   ```bash
   make docker-up
   # or
   docker-compose -f docker/docker-compose.yml up -d
   ```

5. **Run database migrations**
   ```bash
   make migrate
   # or
   npm run prisma:migrate
   ```

6. **Start development server**
   ```bash
   make dev
   # or
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Full Setup (One Command)

```bash
make setup
```

This will: install dependencies, start Docker, run migrations, and seed the database.

## Makefile Commands

### Development
- `make dev` or `make watch` - Start development server
- `make build` - Build for production
- `make start` - Start production server

### Database
- `make docker-up` - Start PostgreSQL container
- `make docker-down` - Stop PostgreSQL container
- `make migrate` - Run Prisma migrations
- `make studio` - Open Prisma Studio (database GUI)

### Testing
- `make test` - Run all tests
- `make test-watch` - Run tests in watch mode
- `make test-coverage` - Run tests with coverage report
- `make test-e2e` - Run end-to-end tests

### Code Quality
- `make lint` - Lint code
- `make lint-fix` - Lint and auto-fix issues
- `make format` - Format code with Prettier

### Utilities
- `make clean` - Remove build artifacts
- `make help` - Show all available commands

## Project Structure

```
budget-app/
├── src/
│   ├── app/                 # Next.js App Router pages and API routes
│   │   ├── api/            # API endpoints
│   │   ├── expenses/       # Recurring expenses page
│   │   ├── payments/       # Pending payments page
│   │   ├── savings/        # Virtual savings page
│   │   ├── layout.tsx      # Root layout with navigation
│   │   └── page.tsx        # Dashboard (home page)
│   ├── components/         # Reusable React components
│   ├── lib/                # Business logic and utilities
│   ├── styles/             # MUI theme configuration
│   └── types/              # TypeScript type definitions
├── prisma/                 # Database schema and migrations
├── tests/                  # Test files
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── contract/          # API contract tests
├── docker/                 # Docker configuration
└── specs/                  # Feature specifications

```

## How It Works

### Budget Calculation

Your **Remaining Budget** is calculated as:

```
Remaining Budget = Account Balance
                 - Virtual Savings
                 - Unpaid Recurring Expenses
                 - Pending Payments
```

### Monthly Workflow

1. **Start of Month**: Reset all recurring expenses to "unpaid"
2. **As You Pay Bills**: Mark recurring expenses as paid (or delete pending payments)
3. **Budget Updates**: See your remaining budget update in real-time
4. **Track Everything**: Add new savings goals, expenses, or upcoming payments anytime

## Database Schema

- **Account** - Your checking account balance
- **VirtualSaving** - Savings categories (emergency fund, vacation, etc.)
- **RecurringExpense** - Monthly bills (rent, utilities, subscriptions)
- **RecurringExpensePayment** - Tracks which expenses are paid each month
- **PendingPayment** - One-time upcoming payments (doctor bill, car repair)

## Development

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

### Code Quality

```bash
# Lint
npm run lint

# Format
npm run format

# Type check
npx tsc --noEmit
```

## Environment Variables

Create a `.env` file with:

```env
DATABASE_URL="postgresql://budget:budget123@localhost:5432/budget_app"
NODE_ENV="development"
```

## Contributing

This is a personal budget tracker. Feel free to fork and customize for your needs!

## License

ISC
