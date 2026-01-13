# Finance App Project - Agent Reference

## Project Overview
Creating a family finance app to track spending, investments, and shared expenses with live syncing and smooth user experience.

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
- **Runtime**: Bun JS - https://bun.sh/docs
- **Effect System**: Effect - https://effect.website/
- **Styling**: TailwindCSS - https://tailwindcss.com/
- **UI Kit**: Kobalte - https://kobalte.dev/docs
- **Frontend Framework**: SolidJS - https://docs.solidjs.com/quick-start
- **Routing**: Solid Router - https://docs.solidjs.com/solid-router/getting-started/installation-and-setup
- **Full-Stack Framework**: Solid Start - https://docs.solidjs.com/solid-start/getting-started
- **Linter/Formatter**: Biome - https://biomejs.dev/
- **Testing**: Playwright - https://playwright.dev/
- **Live Sync Options** (need research):
  - Zero - https://zero.rocicorp.dev/docs/introduction
  - Jazz - https://jazz.tools/docs/react
  - Livestore - https://livestore.dev/

## Future Tasks
- Research and choose live sync solution
- Set up project structure with Solid Start
- Implement authentication system
- Design database schema for spending, users, currencies
- Build spending table component
- Add mini-apps functionality
- Implement command palette
- Add keyboard navigation
- Configure custom theming
- Set up Biome linting and formatting
- Configure Playwright testing framework