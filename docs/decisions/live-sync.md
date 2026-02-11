# Live Sync Decision

Status: proposed
Date: 2026-02-10

## Context
We need real-time client synchronization for a two-user family finance app. The sync layer should be reliable, support conflict resolution, and integrate cleanly with Solid Start + Bun. We also want a path to offline-first behavior, but initial release can prioritize correctness and simplicity. 

## Options Considered
- Zero: production-oriented client/server sync, requires query/mutator endpoints, auth via cookies/tokens, expects Postgres.

## Decision
Run an initial spike with Zero as the first candidate. If the Zero spike shows unacceptable backend complexity or integration friction with Solid Start/Bu.

## Rationale
- Zero looks most mature for a small-team, real-time CRUD app.
- Postgres requirement is acceptable if we plan a hosted backend later.
- A spike will surface integration risks early without committing to full data modeling.

## Consequences
- We will likely need a Postgres-backed environment for the spike.

## Next Steps
- Build a minimal workspace + spending table sync spike with Zero.
- Validate conflict behavior on concurrent edits.
- Document backend requirements and Solid Start integration touchpoints.
