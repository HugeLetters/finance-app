# PRD: Live Sync

## Summary
Enable real-time synchronization across clients with conflict-aware updates. Useful info in [Live-Sync Decisions](../decisions/live-sync.md)

## Goals
- Near real-time updates for spending data.
- Safe conflict resolution and patching.
- Select and implement a live sync provider.

## Non-Goals
- Offline-first full CRDT system in v1.

## User Stories
- As a user, I see changes from another device within seconds.
- As a user, conflicting edits do not corrupt data.

## Functional Requirements
- Evaluate Zero, Jazz, and Livestore against app needs.
- Integrate selected provider with Effect and Differ module.
- Broadcast patches and apply remotely.
- Presence indicator optional for active users.

## UX Notes
- Subtle sync indicator in header.
- Inline cell updates animate on remote change.

## Data Model
- SyncLog or PatchLog with author, timestamp, patch payload.

## Dependencies
- Database schema and auth.
- Spending table patches.

## Milestones
1. Provider evaluation and decision doc.
2. Prototype live updates on purchases.
3. Expand to other entities.

## Risks
- Vendor lock-in or performance limits.
