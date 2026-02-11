# PRD: Palette Customization

## Summary
Allow users to select and customize color palettes, and apply them across the UI.

## Goals
- Provide presets and a custom option.
- Apply semantic colors consistently to components.

## Non-Goals
- Full theme marketplace.

## User Stories
- As a user, I can switch between preset palettes.
- As a user, I can tweak base colors and see updates.

## Functional Requirements
- Settings page for palette selection.
- Use semantic colors for UI components.
- Regenerate palette CSS when custom colors change in development or during build.

## UX Notes
- Live preview of palette changes.
- Warn if contrast is insufficient.

## Dependencies
- Color palette generator.

## Milestones
1. Preset selection UI.
2. Apply semantic colors in components.
3. Custom palette editor.

## Risks
- Contrast and accessibility issues.
