# PRD: Mini-App - Shared Expenses Calculator

## Summary
Provide a quick tool to split expenses across participants and generate per-person balances.

## Goals
- Fast input for participants and items.
- Clear output for who owes what.

## Non-Goals
- Long-term debt tracking.

## User Stories
- As a user, I can enter items and participants.
- As a user, I can share a summary with others.

## Functional Requirements
- Participant list with weights or equal split.
- Line items with payer and amount.
- Output balance summary and export text.

## UX Notes
- Compact two-column layout: inputs left, summary right.

## Dependencies
- Mini-apps hub route.

## Milestones
1. Participant management.
2. Line item entry.
3. Balance output and copy.

## Risks
- Confusing edge cases for split logic.
