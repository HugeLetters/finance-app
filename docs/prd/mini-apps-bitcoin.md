# PRD: Mini-App - Bitcoin Tracker

## Summary
Track simple BTC holdings and show current value.

## Goals
- Store holdings and average cost.
- Display current value and PnL.

## Non-Goals
- Trading integrations or wallet management.

## User Stories
- As a user, I can record my BTC holdings.
- As a user, I can see current value and change.

## Functional Requirements
- Holdings input and edit.
- Price fetch with caching.
- Display current value and percent change.

## UX Notes
- Simple chart sparkline optional.

## Dependencies
- Price data source.

## Milestones
1. Holdings data model.
2. Price fetch and display.
3. PnL calculation.

## Risks
- Rate limits or downtime from price source.
