# Feature Specification: Budget Tracker Application

**Feature Branch**: `001-budget-tracker`
**Created**: 2025-11-21
**Status**: Draft
**Input**: User description: "Créé une application de gestion d'un budget sur un compte courrant. Le besoin est d'avoir un input avec le montant du compte courrant, des épargnes vituelles d'argent, une liste de frais mensuel à renouveller et des éléments en attente de paiment. Ainsi avec toutes ces informations, il sera possible de calculer le budget restant."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Remaining Budget (Priority: P1)

As a user, I want to see my remaining budget after accounting for all my financial commitments, so I can make informed spending decisions.

**Why this priority**: This is the core value proposition of the application - knowing how much money is truly available to spend. Without this, the application has no purpose.

**Independent Test**: Can be fully tested by entering a checking account balance, adding virtual savings, recurring expenses, and pending payments, then verifying the remaining budget calculation is accurate.

**Acceptance Scenarios**:

1. **Given** I have $5,000 in my checking account, **When** I add $1,000 in virtual savings, $2,000 in monthly recurring expenses, and $500 in pending payments, **Then** the system displays my remaining budget as $1,500
2. **Given** I have updated my checking account balance, **When** I view the dashboard, **Then** the remaining budget automatically recalculates and displays the new amount
3. **Given** all my financial data is entered, **When** I make changes to any category (savings, expenses, or pending payments), **Then** the remaining budget updates in real-time

---

### User Story 2 - Manage Virtual Savings (Priority: P2)

As a user, I want to allocate portions of my checking account balance to virtual savings categories (emergency fund, vacation, new car), so I can mentally separate money for specific goals without opening multiple bank accounts.

**Why this priority**: Virtual savings are critical for budgeting discipline. They allow users to "set aside" money for goals while keeping it in their checking account. This is the second most important feature after seeing the remaining budget.

**Independent Test**: Can be tested independently by creating, editing, and deleting virtual savings categories, then verifying they correctly reduce the available budget.

**Acceptance Scenarios**:

1. **Given** I'm on the virtual savings screen, **When** I create a new savings category "Emergency Fund" with $1,000, **Then** the category is saved and my remaining budget decreases by $1,000
2. **Given** I have multiple virtual savings categories, **When** I edit the amount in one category, **Then** the remaining budget adjusts accordingly
3. **Given** I have a virtual savings category, **When** I delete it, **Then** that money is released back to my remaining budget
4. **Given** I have $2,000 remaining budget, **When** I try to allocate $2,500 to virtual savings, **Then** the system warns me that this would result in a negative remaining budget

---

### User Story 3 - Track Recurring Monthly Expenses (Priority: P3)

As a user, I want to maintain a list of recurring monthly expenses (rent, utilities, subscriptions, insurance), so I can account for predictable outflows and avoid overspending.

**Why this priority**: Recurring expenses are predictable and essential to budget planning. They help prevent the common mistake of seeing checking account balance and forgetting about upcoming bills.

**Independent Test**: Can be tested by adding, editing, and deleting recurring monthly expenses, then verifying they correctly reduce the remaining budget.

**Acceptance Scenarios**:

1. **Given** I'm on the recurring expenses screen, **When** I add "Rent" for $1,200/month, **Then** the expense is saved and my remaining budget decreases by $1,200
2. **Given** I have multiple recurring expenses, **When** I edit an expense amount, **Then** the remaining budget updates immediately
3. **Given** I have recurring expenses, **When** I delete one, **Then** that amount is released back to my remaining budget
4. **Given** I have recurring expenses, **When** I view the list, **Then** I see the expense name, amount, and total monthly recurring cost

---

### User Story 4 - Manage Pending Payments (Priority: P4)

As a user, I want to track one-time pending payments (bills not yet paid, planned purchases), so I can reserve money for upcoming expenses and avoid spending it twice.

**Why this priority**: Pending payments help track the gap between money in the account and money that's already "spoken for" by upcoming obligations. This prevents overdrafts and bounced payments.

**Independent Test**: Can be tested by adding, marking as paid, and deleting pending payments, then verifying budget calculations remain accurate.

**Acceptance Scenarios**:

1. **Given** I'm on the pending payments screen, **When** I add "Car repair - $450", **Then** the payment is saved and my remaining budget decreases by $450
2. **Given** I have pending payments, **When** I mark one as paid, **Then** it's removed from the pending list and the remaining budget adjusts
3. **Given** I have pending payments, **When** I delete one, **Then** that amount is released back to my remaining budget
4. **Given** I have multiple pending payments, **When** I view the list, **Then** I see each payment description, amount, and total pending amount

---

### User Story 5 - Set Checking Account Balance (Priority: P1)

As a user, I want to input and update my current checking account balance, so the system has the starting point for all budget calculations.

**Why this priority**: This is foundational - without the checking account balance, no other calculations can work. It's tied to P1 because it's required for the core remaining budget feature.

**Independent Test**: Can be tested by entering and updating the checking account balance, then verifying all dependent calculations update correctly.

**Acceptance Scenarios**:

1. **Given** I'm a new user, **When** I enter my checking account balance of $3,500, **Then** the system saves it and uses it as the basis for budget calculations
2. **Given** I have an existing balance, **When** I update it to reflect my current bank statement, **Then** all budget calculations (remaining budget, allocations) recalculate automatically
3. **Given** I enter a negative balance, **When** I try to save, **Then** the system accepts it (allowing for overdraft scenarios) and shows remaining budget calculations accordingly

---

### Edge Cases

- What happens when the checking account balance is zero or negative (overdraft)?
- What happens when virtual savings + recurring expenses + pending payments exceed the checking account balance (negative remaining budget)?
- What happens when a user enters non-numeric values in amount fields?
- What happens when a recurring expense amount is changed after the month has started?
- What happens when a pending payment sits unpaid for multiple months?
- What happens when a user tries to allocate more to virtual savings than their remaining budget?
- What happens when a user deletes all items from a category (empty state)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to input and update their checking account balance
- **FR-002**: System MUST allow users to create, edit, and delete virtual savings categories with names and amounts
- **FR-003**: System MUST allow users to create, edit, and delete recurring monthly expenses with descriptions and amounts
- **FR-004**: System MUST allow users to create, edit, and delete pending payments with descriptions and amounts
- **FR-005**: System MUST calculate remaining budget as: Checking Balance - (Virtual Savings + Recurring Expenses + Pending Payments)
- **FR-006**: System MUST display the remaining budget prominently on the main dashboard
- **FR-007**: System MUST update the remaining budget automatically whenever any input changes
- **FR-008**: System MUST persist all data so users can close and reopen the application without losing information
- **FR-009**: System MUST display running totals for virtual savings, recurring expenses, and pending payments
- **FR-010**: System MUST handle decimal amounts for currency (e.g., $1,234.56)
- **FR-011**: System MUST validate that amount inputs are numeric and properly formatted
- **FR-012**: System MUST allow negative checking account balances (to accommodate overdraft situations)
- **FR-013**: System MUST display when remaining budget is negative (overspent) in a visually distinct way
- **FR-014**: System MUST allow users to mark pending payments as "paid", which removes them from the pending list

### Key Entities

- **Checking Account**: Represents the user's current checking account balance. Single numeric value that serves as the starting point for all calculations.

- **Virtual Savings Category**: Represents a user-defined savings goal or allocation (e.g., "Emergency Fund", "Vacation", "New Car"). Has a name and allocated amount. Multiple categories can exist. Total of all virtual savings reduces available budget.

- **Recurring Monthly Expense**: Represents a predictable monthly bill or subscription (e.g., "Rent", "Netflix", "Car Insurance"). Has a description and monthly amount. Multiple expenses can exist. Total of all recurring expenses reduces available budget.

- **Pending Payment**: Represents a one-time upcoming payment or planned purchase (e.g., "Electric bill", "Birthday gift", "Car repair"). Has a description and amount. Multiple pending payments can exist. Total of all pending payments reduces available budget. Can be marked as paid and removed.

- **Remaining Budget**: Calculated value representing truly available spending money. Formula: Checking Balance - (Sum of Virtual Savings + Sum of Recurring Expenses + Sum of Pending Payments). This is the key output of the system.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view their calculated remaining budget within 2 seconds of entering or updating any financial data
- **SC-002**: 90% of users successfully enter their checking balance and see a remaining budget calculation on their first attempt
- **SC-003**: Users can create and manage at least 5 virtual savings categories, 10 recurring expenses, and 10 pending payments without performance degradation
- **SC-004**: Budget calculations are mathematically accurate to 2 decimal places (cent precision) in 100% of test cases
- **SC-005**: Users can complete the full workflow (enter balance, add savings, add expenses, add pending payments, view remaining budget) in under 5 minutes
- **SC-006**: Data persists between sessions with 100% reliability (no data loss on application close/reopen)
- **SC-007**: Remaining budget updates within 500ms of any change to any input field
- **SC-008**: Users can distinguish between positive and negative remaining budget states at a glance (visual design success)

## Assumptions

1. **Single User**: Application is for personal use by a single user, not multi-user or family budget sharing
2. **Single Account**: User manages only one checking account, not multiple accounts
3. **Monthly Cycle**: Recurring expenses are monthly; no support for weekly, quarterly, or annual recurring expenses in this version
4. **Local Storage**: Data is stored locally on the user's device (no cloud sync or backup in initial version)
5. **Currency**: All amounts are in the same currency (assumed to be user's local currency); no multi-currency support
6. **Manual Entry**: User manually enters and updates checking account balance; no bank account integration or automatic sync
7. **No Historical Tracking**: Application shows current state only; no transaction history, trends, or month-over-month comparisons
8. **No Budget Limits**: Application calculates remaining budget but doesn't enforce spending limits or send alerts
9. **Simple Calculation**: Remaining budget is a simple subtraction; no complex rules, percentages, or conditional logic
10. **Desktop/Mobile Web**: Application is accessible via web browser on desktop and mobile devices

## Dependencies

- None identified. This is a standalone application with no external service dependencies (in the initial version without bank integration).

## Out of Scope

The following features are explicitly out of scope for this initial version:

- Bank account integration or automatic transaction import
- Multi-user support or family budget sharing
- Budget categories for actual spending (this tracks commitments, not actual spending)
- Transaction history or expense tracking over time
- Budgeting recommendations or financial advice
- Bill payment reminders or notifications
- Reports, charts, or data visualization
- Export to spreadsheet or PDF
- Multi-currency support
- Weekly, quarterly, or annual recurring expenses (monthly only)
- Income tracking (focuses on checking balance as the starting point)
- Credit card tracking or debt management
- Investment or retirement account tracking
