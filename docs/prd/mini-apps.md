# PRD: Mini-Apps

## Summary
Add a set of lightweight tools for shared expenses, bitcoin tracking, family debt, and monthly balances.

## Goals
- Ship four focused mini-apps with shared design language.
- Keep each tool minimal and fast to use.

## Non-Goals
- Full accounting suite.

## User Stories
- As a user, I can quickly split shared expenses.
- As a user, I can track a simple bitcoin position.
- As a user, I can record and settle family debt.
- As a user, I can view monthly balances summary.

## Functional Requirements
- Shared expenses calculator with participant inputs and split summary.
- Bitcoin tracker with holdings and price reference.
- Family debt ledger with balances per person.
- Monthly balances view based on purchases.

## UX Notes
- Each mini-app accessible from a single "Mini Apps" hub.
- Consistent card layout and quick actions.

## Data Model
- SharedExpense, DebtEntry, Holdings, MonthlyBalanceView.

## Dependencies
- Auth and workspace data.
- Spending data for monthly balances.

## Milestones
1. Mini-apps hub route and navigation.
2. Shared expenses calculator.
3. Debt ledger.
4. Bitcoin tracker and monthly balances.

## Risks
- Scope creep across four tools.
