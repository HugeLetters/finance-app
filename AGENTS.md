# Finance App Project - Agent Reference

## Agent Guidelines
- Make concise plans, sacrificing grammar for efficiency.
- After making a plan, provide a list of unresolved questions for the user to answer.

## LLM Interaction Guidelines
- Verify tool results before proceeding; batch operations for efficiency.
- Ask clarifying questions before major changes.
- Follow security best practices; avoid exposing secrets.
- Run lint and typecheck after edits.

## Project Overview
Family finance app for tracking spending, shared expenses, and mini-tools with a spreadsheet-like UX, privacy, multi-currency, and live sync.

## Product Scope (from PRDs)
- **Spending Table**: Editable grid with validation, sorting/filtering, and keyboard navigation.
- **Personal Tracking**: Per-transaction privacy toggle with access enforcement.
- **Multi-Currency**: Preferred display currency with original amount on hover.
- **Merchant Recognition**: Inline merchant suggestions while typing.
- **Mini-Apps**: Shared expenses, bitcoin tracker, family debt, monthly balances.
- **Auth & Access**: Invite-based workspace with two-user limit.
- **Customization**: Palette presets and custom palette editor.
- **Live Sync**: Near real-time updates with conflict-safe patches.
- **Command Palette**: Global quick actions launcher.

## Technology Stack (short)
- Bun runtime, Solid Start + Solid Router, SolidJS.
- Effect + effect/schema; arkregex for typed regex.
- TailwindCSS, Kobalte, Biome.
- Playwright for e2e tests.

## Core Modules
- **Differ Module** (`src/utils/differ/index.ts`): Typed diff/patch system used for live sync.

## Development Environment
- Lint/format/typecheck: `bun run lint`, `bun run lint:fix`, `bun run format`, `bun run typecheck`.
- Tests: `bun test`, `bun run e2e`, `bun run e2e:ui`.
- Build: `scripts/build.ts` handles palette generation before build.
- Palette updates: after editing `src/color/palette.ts`, regenerate `src/color/palette.css`.

## Code Conventions
- File naming: kebab-case for routes/components, camelCase for utilities/plugins.
- Imports: external first, then internal; keep sorted.
- Commit messages: verb prefix, under 50 chars.
- Documentation: use JSDoc for modules/namespaces/complex functions.

## Color System (brief)
- Semantic color tokens: primary, secondary, accent, neutral, success, warning, error.
- Palette generation lives in `src/color/generate.ts` and exports CSS vars.

## Testing Notes
- Unit tests use `src/test/index.ts` harness.
- E2E tests live in `tests/`.
