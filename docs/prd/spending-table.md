# PRD: Spending Table

## Summary
Build the core spreadsheet-like table to record and edit purchases with fast inline editing and clear data validation.

## Goals
- Capture purchases by date, spender, category, comment, recurring status.
- Enable rapid row creation, edit, and deletion.
- Support keyboard-driven workflows.

## Non-Goals
- Full analytics dashboards.
- Advanced budgeting rules.

## User Stories
- As a user, I can add a purchase in one row without leaving the table.
- As a user, I can edit any cell inline with immediate feedback.
- As a user, I can filter or sort by date, spender, category.

## Functional Requirements
- Column set: date, spender, category, amount, currency, comment, recurring.
- Row creation via UI button and keyboard shortcut.
- Inline validation with clear error states.
- Sorting and filtering per column.
- Persist edits with optimistic UI and rollback on error.

## UX Notes
- Google Sheets-like layout with fixed header.
- Active cell highlight and row focus state.
- Hover affordances for comment and recurring.

## Data Model
- Purchase: id, date, spenderId, categoryId, amount, currency, comment, recurring, createdAt, updatedAt, visibility.

## Dependencies
- Database schema for purchases and users.
- Auth to scope data per workspace.

## Milestones
1. Table skeleton and column definitions.
2. Inline editing with validation.
3. Sorting/filtering and keyboard navigation integration.

## Risks
- Performance with large datasets.
- Consistent validation across client and server.
