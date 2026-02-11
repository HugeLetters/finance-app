# PRD: Command Palette

## Summary
Provide a quick action launcher for navigation and common tasks.

## Goals
- Open palette with a global shortcut.
- Search and run actions quickly.

## Non-Goals
- Full scripting interface.

## User Stories
- As a user, I can open the palette and navigate to features.
- As a user, I can run "Add purchase" without clicking.

## Functional Requirements
- Global shortcut (Cmd+K / Ctrl+K).
- Searchable list of actions.
- Action registry with categories.
- Context-based actions - depending on what the user is doing or where he is different actions are availalble.

## UX Notes
- Centered modal with fuzzy search.
- Recent actions at the top.

## Dependencies
- Routes and features to register actions.

## Milestones
1. Palette UI and shortcut.
2. Action registry and core actions.
3. Extend with contextual actions.

## Risks
- Action sprawl without curation.
