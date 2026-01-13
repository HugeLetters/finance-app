# Finance App Project - Agent Reference

## Project Overview
Creating a family finance app to track spending, investments, and shared expenses with live syncing and smooth user experience. The project is initialized with Solid Start, featuring a basic routing structure (index, about, 404 pages) and sample components (Nav, Counter), using Bun for runtime and package management.

## Desired Features
- **Spending Table**: Track purchases by date, spender, category, comment, is recurring, etc.
- **Personal Spending Tracking**: With option to mark transactions as private
- **Multi-Currency Support**: Purchases have currencies, preferred currency display, hover shows original currency
- **Merchant Recognition System**: Helper for identifying merchants
- **Mini-Apps Tab**:
  - Calculator for equal spending on shared expenses (how much I owe my wife)
  - Track Bitcoin investments (actual money tracking)
  - Track debt between family members
  - Track balance across months
- **Authentication & Access**: Invite-based auth for me and wife only, with workspace system
- **Customization**: Custom color palette with presets and fully customizable options
- **Live Sync**: Real-time synchronization between clients
- **User Experience**: Google Sheets-like interface with keyboard navigation (tab/enter/arrow keys)
- **Command Palette**: For quick actions

## Technology Stack
- **Runtime**: Bun JS - https://bun.sh/docs (used for running the app and managing dependencies with bun add/install/run)
- **Effect System**: Effect - https://effect.website/
- **Styling**: TailwindCSS - https://tailwindcss.com/
- **UI Kit**: Kobalte - https://kobalte.dev/docs
- **Frontend Framework**: SolidJS - https://docs.solidjs.com/quick-start
- **Routing**: Solid Router - https://docs.solidjs.com/solid-router/getting-started/installation-and-setup
- **Full-Stack Framework**: Solid Start - https://docs.solidjs.com/solid-start/getting-started (project initialized with default structure including src/routes/, entry files, and app.tsx)
- **Linter/Formatter**: Biome - https://biomejs.dev/ (configured with recommended rules for code quality and consistency)
- **Testing**: Playwright - https://playwright.dev/
- **Live Sync Options** (need research):
  - Zero - https://zero.rocicorp.dev/docs/introduction
  - Jazz - https://jazz.tools/docs/react
  - Livestore - https://livestore.dev/

## Development Environment
- **Code Quality**: Biome handles linting and formatting with recommended rules enabled. Run `bun run lint` to check for issues, `bun run lint:fix` to auto-apply fixes, and `bun run format` to format code.
- **VSCode Integration**: Project includes `.vscode/settings.json` configured for Biome (format on save, default formatter for JS/TS/JSON files, code actions for imports and fixes). The Biome extension is recommended in `.vscode/extensions.json`.
- **Git**: Repository initialized for version control.

## Future Tasks
- Research and choose live sync solution
- Implement authentication system
- Design database schema for spending, users, currencies
- Build spending table component
- Add mini-apps functionality
- Implement command palette
- Add keyboard navigation
- Configure custom theming
- Configure Playwright testing framework
- setup tailwind