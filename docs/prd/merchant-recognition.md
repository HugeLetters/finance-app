# PRD: Merchant Recognition

## Summary
Suggest merchants based on entered descriptions to speed entry and improve data consistency.

## Goals
- Provide inline merchant suggestions while typing.
- Normalize merchant names.

## Non-Goals
- Full receipt parsing or OCR.

## User Stories
- As a user, I see merchant suggestions while typing a comment.
- As a user, I can accept a suggestion to normalize naming.

## Functional Requirements
- Suggestion service that matches historical merchants.
- Simple normalization rules and alias management.
- Ability to select and apply a suggestion.
- Ability to add suggestions manually

## UX Notes
- Suggestion dropdown anchored to the comment cell.
- Display top 3 matches with optional "use as typed".

## Data Model
- Merchant: id, name, aliases.
- Purchase.merchantId, Purchase.comment.

## Dependencies
- Purchase table inline editing.

## Milestones
1. Merchant store and matching logic.
2. Suggestion UI and acceptance flow.
3. Alias management.

## Risks
- False positives causing confusion.
