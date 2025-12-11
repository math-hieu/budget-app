# Tasks: Budget Tracker Application

**Input**: Design documents from `/specs/001-budget-tracker/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included per constitution Testing Discipline principle (TDD for business logic, 80% coverage for financial calculations, 60% for UI).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app structure**: Next.js App Router at repository root
- `src/app/` - Pages and API routes
- `src/components/` - Shared React components
- `src/lib/` - Business logic and utilities
- `prisma/` - Database schema and migrations
- `tests/` - All test files

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 [P] Create project structure per implementation plan (src/, prisma/, tests/, docker/)
- [X] T002 Initialize Next.js 14 with TypeScript in project root (npx create-next-app@latest)
- [X] T003 [P] Install and configure Material-UI v5 dependencies in package.json (@mui/material, @emotion/react, @emotion/styled)
- [X] T004 [P] Install Prisma ORM and PostgreSQL client in package.json (prisma, @prisma/client, pg)
- [X] T005 [P] Install testing dependencies in package.json (jest, @testing-library/react, playwright, supertest)
- [X] T006 [P] Configure TypeScript with strict mode in tsconfig.json
- [X] T007 [P] Configure ESLint and Prettier in .eslintrc.json and .prettierrc
- [X] T008 [P] Create Docker Compose configuration in docker/docker-compose.yml (Next.js + PostgreSQL containers)
- [X] T009 [P] Create Dockerfile for Next.js application in docker/Dockerfile
- [X] T010 [P] Create .env.example file with DATABASE_URL, NODE_ENV, and other environment variables
- [X] T011 [P] Configure Jest in jest.config.js for unit and integration tests
- [X] T012 [P] Configure Playwright in playwright.config.ts for E2E tests

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T013 Create Prisma schema in prisma/schema.prisma with all 4 models (Account, VirtualSaving, RecurringExpense, PendingPayment)
- [X] T014 Run Prisma migration to create database tables (npx prisma migrate dev --name init)
- [X] T015 Create Prisma Client singleton in src/lib/db.ts
- [X] T016 [P] Create TypeScript type definitions in src/types/index.ts (Account, VirtualSaving, RecurringExpense, PendingPayment, BudgetData)
- [X] T017 [P] Create Zod validation schemas in src/lib/validation.ts (AccountSchema, SavingsSchema, ExpenseSchema, PaymentSchema)
- [X] T018 [P] Create MUI theme configuration in src/styles/theme.ts (simple and elegant design per requirements)
- [X] T019 Create root layout in src/app/layout.tsx with MUI ThemeProvider and basic navigation
- [X] T020 [P] Create currency formatter utility in src/lib/formatters.ts (handles $X,XXX.XX format with 2 decimal places)
- [X] T021 [P] Create shared LoadingSpinner component in src/components/LoadingSpinner.tsx (MUI CircularProgress)
- [X] T022 [P] Create shared DeleteConfirmDialog component in src/components/DeleteConfirmDialog.tsx (MUI Dialog for destructive actions)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Remaining Budget + Set Account Balance (Priority: P1) 🎯 MVP

**Goal**: Display calculated remaining budget and allow user to input/update checking account balance

**Independent Test**: Enter checking balance, add test data for savings/expenses/payments (using API or UI), verify remaining budget calculation is accurate to 2 decimal places

### Tests for User Story 1 (TDD - Write These FIRST)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T023 [P] [US1] Unit test for calculateRemainingBudget function in tests/unit/calculations.test.ts (all scenarios including negative budget, zero balance, overdraft)
- [X] T024 [P] [US1] Unit test for currency formatter in tests/unit/formatters.test.ts (positive, negative, zero, large numbers, 2 decimal precision)
- [X] T025 [P] [US1] Contract test for GET /api/account in tests/contract/account.test.ts (200 response, correct schema)
- [X] T026 [P] [US1] Contract test for PUT /api/account in tests/contract/account.test.ts (200 response, 400 validation error, negative balance accepted)
- [X] T027 [P] [US1] Integration test for BudgetSummary component in tests/integration/BudgetSummary.test.tsx (displays formatted amount, handles positive/negative states, updates when props change)
- [X] T028 [P] [US1] Integration test for AccountBalanceInput component in tests/integration/AccountBalanceInput.test.tsx (input validation, submit flow, error handling)

### Implementation for User Story 1

- [X] T029 [US1] Implement calculateRemainingBudget function in src/lib/calculations.ts (formula: balance - sum(savings) - sum(expenses) - sum(unpaid payments))
- [X] T030 [P] [US1] Implement GET /api/account endpoint in src/app/api/account/route.ts (fetch account from DB, return with Prisma)
- [X] T031 [P] [US1] Implement PUT /api/account endpoint in src/app/api/account/route.ts (validate with Zod, upsert account, handle overdraft)
- [X] T032 [P] [US1] Create BudgetSummary component in src/components/BudgetSummary.tsx (displays remaining budget, uses color for positive/negative, shows loading state)
- [X] T033 [P] [US1] Create AccountBalanceInput component in src/components/AccountBalanceInput.tsx (MUI TextField with currency input, validation, save button)
- [X] T034 [US1] Create Dashboard page in src/app/page.tsx (fetches all data via API, calculates budget using lib function, displays BudgetSummary and AccountBalanceInput)
- [X] T035 [US1] Add real-time budget updates on balance change in src/app/page.tsx (debounce API calls by 300ms, optimistic UI updates)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. User can enter balance and see remaining budget (even if $0 with no other data).

---

## Phase 4: User Story 2 - Manage Virtual Savings (Priority: P2)

**Goal**: Allow users to create, edit, delete virtual savings categories and see budget impact

**Independent Test**: Create savings category, edit amount, delete category, verify budget calculations update correctly

### Tests for User Story 2 (TDD - Write These FIRST)

- [X] T036 [P] [US2] Contract test for GET /api/savings in tests/contract/savings.test.ts (200 response, array schema)
- [X] T037 [P] [US2] Contract test for POST /api/savings in tests/contract/savings.test.ts (201 response, 400 validation error for negative amount)
- [X] T038 [P] [US2] Contract test for PUT /api/savings/:id in tests/contract/savings.test.ts (200 response, 404 not found)
- [X] T039 [P] [US2] Contract test for DELETE /api/savings/:id in tests/contract/savings.test.ts (204 response, 404 not found)
- [X] T040 [P] [US2] Integration test for SavingsList component in tests/integration/SavingsList.test.tsx (renders list, shows totals, edit/delete buttons work)
- [X] T041 [P] [US2] Integration test for ItemForm component in tests/integration/ItemForm.test.tsx (validates name and amount, submits correctly, shows errors)

### Implementation for User Story 2

- [X] T042 [P] [US2] Implement GET /api/savings endpoint in src/app/api/savings/route.ts (fetch all savings ordered by created_at)
- [X] T043 [P] [US2] Implement POST /api/savings endpoint in src/app/api/savings/route.ts (validate with Zod, create new savings category)
- [X] T044 [P] [US2] Implement PUT /api/savings/:id endpoint in src/app/api/savings/[id]/route.ts (validate, update savings, return 404 if not found)
- [X] T045 [P] [US2] Implement DELETE /api/savings/:id endpoint in src/app/api/savings/[id]/route.ts (delete savings, return 404 if not found)
- [X] T046 [P] [US2] Create SavingsList component in src/components/SavingsList.tsx (MUI List/Table, displays name and amount, shows total, edit/delete buttons)
- [X] T047 [P] [US2] Create reusable ItemForm component in src/components/ItemForm.tsx (MUI form with name and amount fields, validation, submit/cancel)
- [X] T048 [US2] Create Virtual Savings page in src/app/savings/page.tsx (fetches savings via API, renders SavingsList, shows ItemForm for add/edit, integrates DeleteConfirmDialog)
- [X] T049 [US2] Integrate savings into Dashboard budget calculation in src/app/page.tsx (fetch savings, pass to calculateRemainingBudget)

**Checkpoint**: User Stories 1 AND 2 should both work independently. User can manage savings and see budget impact.

---

## Phase 5: User Story 3 - Track Recurring Monthly Expenses (Priority: P3)

**Goal**: Allow users to create, edit, delete recurring expenses and see budget impact

**Independent Test**: Add recurring expense, edit amount, delete expense, verify budget calculations update correctly

### Tests for User Story 3 (TDD - Write These FIRST)

- [X] T050 [P] [US3] Contract test for GET /api/expenses in tests/contract/expenses.test.ts (200 response, array schema)
- [X] T051 [P] [US3] Contract test for POST /api/expenses in tests/contract/expenses.test.ts (201 response, 400 validation error)
- [X] T052 [P] [US3] Contract test for PUT /api/expenses/:id in tests/contract/expenses.test.ts (200 response, 404 not found)
- [X] T053 [P] [US3] Contract test for DELETE /api/expenses/:id in tests/contract/expenses.test.ts (204 response, 404 not found)
- [X] T054 [P] [US3] Integration test for ExpensesList component in tests/integration/ExpensesList.test.tsx (renders list, shows totals, edit/delete buttons work)

### Implementation for User Story 3

- [X] T055 [P] [US3] Implement GET /api/expenses endpoint in src/app/api/expenses/route.ts (fetch all expenses ordered by created_at)
- [X] T056 [P] [US3] Implement POST /api/expenses endpoint in src/app/api/expenses/route.ts (validate with Zod, create new expense)
- [X] T057 [P] [US3] Implement PUT /api/expenses/:id endpoint in src/app/api/expenses/[id]/route.ts (validate, update expense, return 404 if not found)
- [X] T058 [P] [US3] Implement DELETE /api/expenses/:id endpoint in src/app/api/expenses/[id]/route.ts (delete expense, return 404 if not found)
- [X] T059 [P] [US3] Create ExpensesList component in src/components/ExpensesList.tsx (MUI List/Table, displays description and amount, shows total, edit/delete buttons)
- [X] T060 [US3] Create Recurring Expenses page in src/app/expenses/page.tsx (fetches expenses via API, renders ExpensesList, reuses ItemForm for add/edit, integrates DeleteConfirmDialog)
- [X] T061 [US3] Integrate expenses into Dashboard budget calculation in src/app/page.tsx (fetch expenses, pass to calculateRemainingBudget)

**Checkpoint**: User Stories 1, 2, AND 3 should all work independently. User can manage expenses and see budget impact.

---

## Phase 6: User Story 4 - Manage Pending Payments (Priority: P4)

**Goal**: Allow users to create, edit, delete, and mark pending payments as paid, with budget impact

**Independent Test**: Add pending payment, mark as paid (should not affect budget), delete payment, verify calculations

### Tests for User Story 4 (TDD - Write These FIRST)

- [X] T062 [P] [US4] Contract test for GET /api/payments in tests/contract/payments.test.ts (200 response, array schema, includes is_paid field)
- [ ] T063 [P] [US4] Contract test for POST /api/payments in tests/contract/payments.test.ts (201 response, defaults is_paid to false)
- [ ] T064 [P] [US4] Contract test for PUT /api/payments/:id in tests/contract/payments.test.ts (200 response, can update is_paid, 404 not found) - SKIPPED: No PUT needed, payments are simply deleted when paid
- [X] T065 [P] [US4] Contract test for DELETE /api/payments/:id in tests/contract/payments.test.ts (204 response, 404 not found)
- [ ] T066 [P] [US4] Integration test for PaymentsList component in tests/integration/PaymentsList.test.tsx (renders list with paid/unpaid status, mark-as-paid button, shows totals for unpaid only)
- [X] T067 [P] [US4] Unit test for budget calculation with paid payments in tests/unit/calculations.test.ts (verify paid payments don't reduce budget) - Already exists in calculations.test.ts

### Implementation for User Story 4

- [X] T068 [P] [US4] Implement GET /api/payments endpoint in src/app/api/payments/route.ts (fetch all payments ordered by created_at, include is_paid field)
- [X] T069 [P] [US4] Implement POST /api/payments endpoint in src/app/api/payments/route.ts (validate with Zod, create payment with is_paid=false by default)
- [ ] T070 [P] [US4] Implement PUT /api/payments/:id endpoint in src/app/api/payments/[id]/route.ts (validate, update payment including is_paid, return 404 if not found) - SKIPPED: Simple delete workflow
- [X] T071 [P] [US4] Implement DELETE /api/payments/:id endpoint in src/app/api/payments/[id]/route.ts (delete payment, return 404 if not found)
- [X] T072 [P] [US4] Create PaymentsList component in src/components/PaymentsList.tsx (MUI List/Table with paid/unpaid visual distinction, mark-as-paid button, shows total for unpaid only, edit/delete buttons)
- [X] T073 [US4] Create Pending Payments page in src/app/payments/page.tsx (fetches payments via API, renders PaymentsList, reuses ItemForm for add/edit, integrates DeleteConfirmDialog)
- [X] T074 [US4] Integrate payments into Dashboard budget calculation in src/app/page.tsx (fetch payments, filter unpaid, pass to calculateRemainingBudget)
- [X] T075 [US4] Update calculateRemainingBudget to filter paid payments in src/lib/calculations.ts (only sum payments where is_paid = false)

**Checkpoint**: All user stories (1-4) should now be independently functional. Complete CRUD for all entities with accurate budget calculation.

---

## Phase 7: End-to-End Testing & Polish

**Purpose**: E2E tests validate full user journeys, polish improves cross-story experience

- [ ] T076 [P] E2E test for User Story 1 in tests/e2e/dashboard.spec.ts (navigate to dashboard, enter balance, verify display)
- [ ] T077 [P] E2E test for User Story 2 in tests/e2e/savings-flow.spec.ts (create savings, edit, delete, verify budget updates)
- [ ] T078 [P] E2E test for User Story 3 in tests/e2e/expenses-flow.spec.ts (create expense, edit, delete, verify budget updates)
- [ ] T079 [P] E2E test for User Story 4 in tests/e2e/payments-flow.spec.ts (create payment, mark as paid, verify budget ignores paid payments)
- [ ] T080 [P] E2E test for complete flow in tests/e2e/full-budget-flow.spec.ts (add all types, verify complex budget calculation, test negative budget)
- [ ] T081 [P] Add responsive design verification in src/app/layout.tsx (test 320px, 768px, 1024px+ breakpoints)
- [ ] T082 [P] Add accessibility improvements in all components (ARIA labels, keyboard navigation, screen reader support per WCAG 2.1 AA)
- [ ] T083 [P] Add error boundaries in src/app/layout.tsx (graceful error handling for API failures)
- [ ] T084 [P] Add loading skeletons with MUI Skeleton in src/components/ (replace LoadingSpinner with skeleton screens for better UX)
- [ ] T085 [P] Optimize bundle size (verify < 200KB gzipped, use Next.js bundle analyzer)
- [ ] T086 [P] Run test coverage report (verify 80% for calculations, 60% for UI)
- [ ] T087 Create README.md in project root (setup instructions, Docker commands, development workflow - per quickstart.md)
- [ ] T088 [P] Create CHANGELOG.md in project root (document v1.0.0 features)
- [ ] T089 Run quickstart.md validation (new developer setup in < 15 minutes)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 → US2 → US3 → US4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 dashboard but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Integrates with US1 dashboard but independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Integrates with US1 dashboard but independently testable

**Key Insight**: US2, US3, US4 all integrate with US1's dashboard for budget display, BUT they can be implemented independently because:
1. Each has its own API endpoints (no shared logic)
2. Each has its own database table (no foreign keys)
3. Each has its own page for management
4. Budget calculation function accepts optional parameters (can pass empty arrays for missing data)

### Within Each User Story

- Tests (TDD) MUST be written and FAIL before implementation
- API endpoints before frontend components (contract tests drive API design)
- Shared components (ItemForm) before pages that use them
- Core functionality before dashboard integration
- Story complete (including tests passing) before moving to next priority

### Parallel Opportunities

- **Phase 1 (Setup)**: All tasks marked [P] can run in parallel (12 parallelizable tasks)
- **Phase 2 (Foundational)**: Tasks T016-T022 marked [P] can run in parallel (7 parallelizable tasks)
- Once Foundational phase completes, **all 4 user stories can start in parallel** (if team capacity allows)
- Within each user story: All test tasks marked [P] can run in parallel
- Within each user story: API endpoint tasks marked [P] can run in parallel
- Within each user story: Component tasks marked [P] can run in parallel
- **Phase 7 (Polish)**: Most tasks marked [P] can run in parallel (11 parallelizable tasks)

---

## Parallel Example: User Story 1

```bash
# Launch all test tasks for User Story 1 together (TDD):
Task: "Unit test for calculateRemainingBudget in tests/unit/calculations.test.ts"
Task: "Unit test for currency formatter in tests/unit/formatters.test.ts"
Task: "Contract test for GET /api/account in tests/contract/account.test.ts"
Task: "Contract test for PUT /api/account in tests/contract/account.test.ts"
Task: "Integration test for BudgetSummary in tests/integration/BudgetSummary.test.tsx"
Task: "Integration test for AccountBalanceInput in tests/integration/AccountBalanceInput.test.tsx"

# After tests written and failing, launch implementation tasks in parallel:
Task: "Implement GET /api/account in src/app/api/account/route.ts"
Task: "Implement PUT /api/account in src/app/api/account/route.ts"
Task: "Create BudgetSummary component in src/components/BudgetSummary.tsx"
Task: "Create AccountBalanceInput component in src/components/AccountBalanceInput.tsx"
```

---

## Parallel Example: User Story 2

```bash
# Tests first (parallel):
Task: "Contract test for GET /api/savings in tests/contract/savings.test.ts"
Task: "Contract test for POST /api/savings in tests/contract/savings.test.ts"
Task: "Contract test for PUT /api/savings/:id in tests/contract/savings.test.ts"
Task: "Contract test for DELETE /api/savings/:id in tests/contract/savings.test.ts"
Task: "Integration test for SavingsList in tests/integration/SavingsList.test.tsx"
Task: "Integration test for ItemForm in tests/integration/ItemForm.test.tsx"

# API implementation (parallel):
Task: "Implement GET /api/savings in src/app/api/savings/route.ts"
Task: "Implement POST /api/savings in src/app/api/savings/route.ts"
Task: "Implement PUT /api/savings/:id in src/app/api/savings/[id]/route.ts"
Task: "Implement DELETE /api/savings/:id in src/app/api/savings/[id]/route.ts"

# Components (parallel):
Task: "Create SavingsList component in src/components/SavingsList.tsx"
Task: "Create ItemForm component in src/components/ItemForm.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (12 tasks)
2. Complete Phase 2: Foundational (10 tasks, CRITICAL)
3. Complete Phase 3: User Story 1 (13 tasks)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Can enter checking balance
   - Can see remaining budget
   - Budget calculation accurate (even with $0 and no other data)
   - Tests pass (unit, contract, integration)
5. Deploy/demo MVP

**MVP Task Count**: 35 tasks
**MVP Delivers**: Core value - user can see remaining budget after entering balance

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (22 tasks)
2. Add User Story 1 → Test independently → Deploy/Demo (13 tasks = 35 total) 🎯 **MVP**
3. Add User Story 2 → Test independently → Deploy/Demo (14 tasks = 49 total)
4. Add User Story 3 → Test independently → Deploy/Demo (13 tasks = 62 total)
5. Add User Story 4 → Test independently → Deploy/Demo (14 tasks = 76 total)
6. Add Polish & E2E → Final release (14 tasks = 90 total)

Each increment adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (22 tasks, ~1-2 days)
2. Once Foundational is done:
   - Developer A: User Story 1 (13 tasks)
   - Developer B: User Story 2 (14 tasks)
   - Developer C: User Story 3 (13 tasks)
   - Developer D: User Story 4 (14 tasks)
3. Stories complete and integrate independently via dashboard
4. Team completes Polish together (14 tasks)

**Parallel Development Time Savings**: ~60% reduction (4 stories in parallel vs sequential)

---

## Notes

- **Total Tasks**: 89 tasks
- **Parallelizable Tasks**: 47 tasks marked [P] (~53% can run in parallel)
- **TDD Enforced**: 26 test tasks MUST be written before corresponding implementation
- **Test Coverage Goals**: 80% financial logic (calculations), 60% UI components
- **File Paths**: All tasks include exact file paths for implementation
- **User Story Mapping**:
  - US1: 13 tasks (T023-T035) - Core MVP
  - US2: 14 tasks (T036-T049) - Virtual Savings
  - US3: 13 tasks (T050-T061) - Recurring Expenses
  - US4: 14 tasks (T062-T075) - Pending Payments
  - Setup: 12 tasks (T001-T012)
  - Foundational: 10 tasks (T013-T022)
  - Polish: 14 tasks (T076-T089)

**Key Success Factors**:
- Each user story delivers independently testable value
- TDD ensures correctness before implementation
- Parallel opportunities maximize team efficiency
- Clear dependencies prevent blocking work
- MVP (US1) can ship first for early feedback

Stop at any checkpoint to validate story independently before proceeding. Commit after each task or logical group.
