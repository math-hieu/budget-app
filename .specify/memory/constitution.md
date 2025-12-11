<!--
Sync Impact Report:
- Version change: (new) → 1.0.0
- New constitution created with 6 core principles
- Principles established:
  1. Code Quality Standards
  2. Testing Discipline (NON-NEGOTIABLE)
  3. User Experience Consistency
  4. Performance Requirements
  5. Documentation Standards
  6. Security & Privacy
- Added sections: Development Workflow, Review Process
- Templates requiring updates:
  ✅ .specify/templates/plan-template.md (already has Constitution Check section)
  ✅ .specify/templates/spec-template.md (aligned with user-focused testing scenarios)
  ✅ .specify/templates/tasks-template.md (aligned with test-first and quality gates)
- Follow-up TODOs: None
-->

# Budget App Constitution

## Core Principles

### I. Code Quality Standards

Code MUST be maintainable, readable, and follow established patterns. All code submissions MUST:

- Follow consistent naming conventions (camelCase for variables/functions, PascalCase for classes/components)
- Include meaningful variable and function names that convey intent
- Keep functions focused on single responsibilities (< 50 lines preferred)
- Avoid code duplication (DRY principle); extract reusable logic into shared utilities
- Use type safety where language supports it (TypeScript strict mode, Python type hints)
- Include error handling for all external operations (API calls, file I/O, database queries)
- Pass linting and formatting checks before commit

**Rationale**: Budget applications handle sensitive financial data. Code quality directly impacts reliability, security, and long-term maintainability. Poor code quality leads to bugs that can cause incorrect calculations or data loss.

### II. Testing Discipline (NON-NEGOTIABLE)

Testing is MANDATORY for all features. Test-Driven Development (TDD) is enforced for core business logic:

- **Red-Green-Refactor cycle**: Write failing test → Implement → Refactor
- **Unit tests** MUST cover all business logic (budget calculations, transaction categorization, balance reconciliation)
- **Integration tests** MUST verify data flow between components (API ↔ database, frontend ↔ backend)
- **Contract tests** MUST validate API endpoints match specifications
- **Edge case tests** MUST cover boundary conditions (zero/negative amounts, date boundaries, currency precision)
- Test coverage minimum: 80% for core financial logic, 60% for UI components
- All tests MUST pass before merge; no exceptions

**Rationale**: Financial calculations must be accurate. A single bug in budget calculations can undermine user trust. TDD ensures correctness is verified before implementation and prevents regressions.

### III. User Experience Consistency

User interface and interactions MUST be consistent, predictable, and accessible:

- **Design system**: All UI components follow a unified design system (colors, typography, spacing, animations)
- **Accessibility**: WCAG 2.1 Level AA compliance (keyboard navigation, screen reader support, color contrast ≥ 4.5:1)
- **Responsive design**: Application MUST be fully functional on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Error messaging**: User-facing errors MUST be clear, actionable, and non-technical (e.g., "Transaction date cannot be in the future" not "ValidationError: invalid_date")
- **Loading states**: All async operations MUST show loading indicators after 200ms
- **Confirmation patterns**: Destructive actions (delete transaction, reset budget) MUST require explicit confirmation
- **Data persistence**: Form data MUST be auto-saved or warn before navigation to prevent data loss

**Rationale**: Budget apps are used frequently and often under stress (financial planning). Consistent UX reduces cognitive load and errors. Accessibility ensures the app serves all users.

### IV. Performance Requirements

Application MUST meet performance benchmarks to ensure responsive user experience:

- **Page load**: Initial load < 2 seconds on 3G connection, subsequent loads < 500ms (cached)
- **API response**: 95th percentile response time < 200ms for read operations, < 500ms for write operations
- **Database queries**: All queries MUST use indexes; N+1 queries prohibited (use eager loading/joins)
- **Bundle size**: JavaScript bundle < 200KB gzipped for initial load; code-split large dependencies
- **Memory usage**: Client-side memory footprint < 100MB for typical session (1000 transactions displayed)
- **Rendering**: UI interactions MUST respond within 100ms (input lag); list virtualization required for >100 items
- **Offline capability**: Core features (view budgets, add transactions) MUST work offline with sync when reconnected

**Rationale**: Financial tracking apps are used multiple times daily. Slow performance frustrates users and reduces engagement. Poor performance can also indicate inefficient algorithms that won't scale.

### V. Documentation Standards

Code and features MUST be documented to facilitate collaboration and maintenance:

- **API documentation**: All endpoints documented with request/response schemas, example payloads, error codes
- **Code comments**: Complex business logic MUST have explanatory comments (why, not what)
- **README**: Setup instructions MUST work for new developers in < 15 minutes
- **Architecture decisions**: Major architectural choices MUST be documented in `/docs/architecture/` with rationale
- **Changelog**: All user-facing changes MUST be documented in CHANGELOG.md following Keep a Changelog format
- **Data models**: Entity relationships and constraints MUST be documented with schema diagrams

**Rationale**: Budget apps involve complex domain logic (tax categories, recurring transactions, budget rollover rules). Documentation prevents knowledge silos and reduces onboarding time.

### VI. Security & Privacy

Financial data MUST be protected with security best practices:

- **Authentication**: Multi-factor authentication (MFA) available; session timeout after 30 minutes inactivity
- **Authorization**: Role-based access control (RBAC); users can only access their own financial data
- **Data encryption**: Data encrypted at rest (AES-256) and in transit (TLS 1.3+)
- **Input validation**: All user inputs sanitized to prevent injection attacks (SQL, XSS, command injection)
- **Secrets management**: No credentials/API keys in code; use environment variables or secret managers
- **Dependency security**: Automated security scanning (Dependabot/Snyk); critical vulnerabilities patched within 48 hours
- **Privacy compliance**: GDPR/CCPA compliant; users can export and delete their data
- **Audit logging**: All financial data modifications logged with timestamp, user ID, and change details

**Rationale**: Budget apps contain highly sensitive PII and financial data. Security breaches can cause financial harm and legal liability. Privacy compliance is legally required in many jurisdictions.

## Development Workflow

All development MUST follow this workflow:

1. **Feature specification**: Create spec.md with user stories and acceptance criteria (use `/speckit.specify`)
2. **Implementation planning**: Create plan.md with technical approach and architecture (use `/speckit.plan`)
3. **Constitution check**: Verify plan complies with all principles; document any justified exceptions
4. **Task generation**: Break down implementation into actionable tasks (use `/speckit.tasks`)
5. **Test-first implementation**: Write failing tests, implement to pass, refactor
6. **Code review**: All code reviewed by at least one other developer (see Review Process below)
7. **CI/CD pipeline**: Automated tests, linting, security scans MUST pass
8. **Manual testing**: QA validates user stories in spec.md on staging environment
9. **Merge**: Feature merged to main only after all gates pass

## Review Process

Code reviews MUST verify:

- [ ] **Functionality**: Code implements requirements from spec.md
- [ ] **Tests**: All tests pass; coverage meets minimums; TDD followed for business logic
- [ ] **Code quality**: Follows style guide; no code smells; proper error handling
- [ ] **Performance**: No obvious performance issues; database queries optimized
- [ ] **Security**: Input validation present; no hardcoded secrets; dependencies up-to-date
- [ ] **UX consistency**: UI matches design system; accessibility requirements met
- [ ] **Documentation**: Complex logic documented; API changes reflected in docs

**Review SLAs**:
- Small changes (< 100 lines): Reviewed within 4 hours
- Medium changes (100-500 lines): Reviewed within 1 business day
- Large changes (> 500 lines): Should be broken down or reviewed within 2 business days

**Blocking issues**: Security vulnerabilities, failing tests, missing required tests, accessibility violations, or performance regressions MUST be fixed before approval.

## Governance

This constitution is the authoritative source for all development practices. It supersedes conflicting team practices or individual preferences.

**Amendment process**:
1. Propose change with rationale in team discussion (document, meeting, or RFC)
2. Evaluate impact on existing features and templates
3. Require majority approval from core maintainers
4. Update constitution version following semantic versioning
5. Propagate changes to dependent templates (plan-template.md, spec-template.md, tasks-template.md)
6. Communicate changes to all team members with migration guidance if needed

**Compliance**:
- All pull requests MUST verify compliance with constitution principles
- Constitution violations flagged in code review MUST be addressed or explicitly justified
- Retrospectives SHOULD review constitution effectiveness quarterly
- Use `/speckit.constitution` command to update this file
- Use `/speckit.analyze` command to verify cross-artifact consistency

**Complexity justification**: Any principle violation MUST be justified in plan.md Complexity Tracking section with:
- Which principle is violated
- Why the complexity/violation is required
- What simpler alternatives were considered and why they're insufficient

**Version**: 1.0.0 | **Ratified**: 2025-11-21 | **Last Amended**: 2025-11-21
