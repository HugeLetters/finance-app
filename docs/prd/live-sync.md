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
- Evaluate Zero, Jazz, and Livestore against app needs - especially auth. 
- Docs: Zero (https://zero.rocicorp.dev/docs/introduction), Jazz (https://jazz.tools/docs/react), Livestore (https://livestore.dev/). 
- Reference: Zero (https://github.com/rocicorp/hello-zero-solid), Livestore (https://docs.livestore.dev/reference/framework-integrations/solid-integration/ and https://github.com/livestorejs/livestore/tree/main/examples/standalone/web-todomvc-solid)
- Integrate selected provider with Effect module.
- Broadcast patches and apply remotely.
- Presence indicator optional for active users.

## Data Model
- SyncLog or PatchLog with author, timestamp, patch payload.

## Dependencies
- Database schema and auth.

## Milestones
1. Provider evaluation and decision doc.
2. Once the decision is made - create a basic library intergration, don't create your own custom solutions - consult the docs and integrate. 
3. Integrate basic authentication.
4. Create a basic prototype with a todo-app.

## Risks
- Vendor lock-in or performance limits. Do not use cloud solutions.
