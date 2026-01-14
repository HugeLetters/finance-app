# Finance App

A family finance app for tracking spending, investments, and shared expenses with live sync.

## Tech Stack

- **Runtime**: Bun JS
- **Effect System**: Effect (FP library for TypeScript)
- **Schema Validation**: effect/schema
- **Frontend Framework**: SolidJS with Solid Start
- **Styling**: TailwindCSS
- **UI Kit**: Kobalte
- **Testing**: Custom Effect-based harness with Bun:test + Playwright for E2E

## Developing

Start the development server:

```bash
bun run dev
```

## Testing

### Unit Tests

Run unit tests with the Effect-based harness:

```bash
bun test
```

See [docs/testing.md](docs/testing.md) for usage details.

### E2E Tests

Run end-to-end tests with Playwright:

```bash
# Headless
bun run e2e

# Interactive UI
bun run e2e:ui
```

## Building

Build the app:

```bash
bun run build
```

## Linting and Formatting

```bash
bun run lint
bun run format
```
