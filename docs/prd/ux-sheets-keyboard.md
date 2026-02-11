# PRD: Sheets-Like UX and Keyboard Navigation

## Summary
Deliver a fast, spreadsheet-like interaction model with robust keyboard navigation.

## Goals
- Arrow key navigation across cells.
- Enter/escape edit modes.
- Clipboard-friendly copy/paste patterns.

## Non-Goals
- Full formula language.

## User Stories
- As a user, I can navigate cells using the keyboard only.
- As a user, I can paste a row of values into the table.

## Functional Requirements
- Focus manager for grid cells.
- Keyboard shortcuts: arrows, enter, escape, tab, delete.
- Paste handler for row-level input.

## UX Notes
- Active cell outline and row highlight.
- Smooth scrolling while navigating.

## Dependencies
- Spending table component.

## Milestones
1. Basic keyboard navigation.
2. Edit modes and shortcuts.
3. Copy/paste enhancements.

## Risks
- Accessibility conflicts with native browser behavior.
