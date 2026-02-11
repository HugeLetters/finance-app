# PRD: Core Database Schema

## Summary
Design the initial database schema for users, workspaces, purchases, and currencies.

## Goals
- Establish a scalable schema for core features.
- Support multi-currency and privacy fields.

## Non-Goals
- Full analytics and reporting schema.

## User Stories
- As a user, my purchases are stored reliably with audit metadata.
- As a user, my workspace data is isolated from others.

## Functional Requirements
- Tables for User, Workspace, WorkspaceMember.
- Tables for Purchase, Category, Merchant, FxRate.
- Indexes for date, spender, category, and workspace.
- Soft deletion support for key entities.

## UX Notes
- None.

## Dependencies
- Auth design and live sync decisions.

## Milestones
1. Schema draft and review.
2. Migrations and seed data.
3. Align API contracts.

## Risks
- Early schema changes affecting future features.
