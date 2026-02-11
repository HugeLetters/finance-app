# PRD: Personal Tracking

## Summary
Allow marking transactions as private so only the creator can view them.

## Goals
- Provide a privacy toggle per transaction.
- Enforce privacy in UI and API layers.

## Non-Goals
- Fine-grained sharing rules beyond private or shared.

## User Stories
- As a user, I can mark a purchase as private.
- As a user, I only see my private purchases.

## Functional Requirements
- Add a visibility field on purchases: shared or private.
- UI toggle in the table to set visibility.
- Backend filtering to hide private rows from other users.
- Audit-friendly metadata for changes.

## UX Notes
- Private rows show a small lock indicator.
- Privacy toggle should be quick to access inline.

## Data Model
- Purchase.visibility: "shared" | "private".

## Dependencies
- Auth and workspace identity.
- Spending table UI.

## Milestones
1. Add visibility to schema and API.
2. Add UI toggle and lock indicator.
3. Enforce server-side filtering.

## Risks
- Accidental exposure if filtering is missed in any query.
