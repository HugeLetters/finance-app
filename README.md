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

### Realtime Sync Demo (Zero)

The repo includes a realtime todo demo at `/demo/todo` backed by Zero + Postgres.
The browser gets Zero cache URL from the server session endpoint using `ZERO_CACHE_URL`.

1. Create environment file:

```bash
cp .env.example .env
```

2. Start Postgres:

```bash
bun run db:up
```

3. Start app server and zero-cache in separate terminals:

```bash
# terminal A
bun run dev

# terminal B
bun run zero:dev
```

Open `http://localhost:3000/demo/todo` in two browsers to validate realtime sync and optimistic mutations.

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

Run realtime sync E2E only when Zero services are running:

```bash
E2E_ZERO=1 bun run e2e tests/todo-sync.spec.ts
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
