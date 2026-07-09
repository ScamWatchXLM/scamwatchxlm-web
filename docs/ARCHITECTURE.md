# Architecture

## Overview

ScamWatchXLM is a Next.js 15 App Router application. It is built to run **fully standalone** — every page renders against a deterministic mock data layer — while keeping a clean seam for a real backend.

```
┌─────────────────────┐
│   App Router pages   │  src/app/**  (route groups: (marketing), (app))
└──────────┬───────────┘
           │ renders
┌──────────▼───────────┐
│  Feature components   │  src/components/{dashboard,reports,analytics,...}
└──────────┬───────────┘
           │ calls
┌──────────▼───────────┐
│   React Query hooks   │  src/hooks/use-*.ts
└──────────┬───────────┘
           │ calls
┌──────────▼───────────┐
│    API resource fns    │  src/lib/api/*.ts   (getAssets, submitReport, ...)
└──────────┬───────────┘
           │ branches on env.apiMode
     ┌─────┴─────┐
     ▼           ▼
┌─────────┐  ┌──────────┐
│  mock   │  │  live    │
│ src/mocks│ │ apiFetch │──▶ real REST API (not yet built)
└─────────┘  └──────────┘
```

## Route groups

- `src/app/(marketing)/` — landing page, About, Docs. Wrapped in `MarketingLayout` (simple navbar + footer, no auth/dashboard chrome).
- `src/app/(app)/` — everything behind the dashboard shell: Dashboard, Alerts, Search, Assets, Accounts, Issuers, Transactions, Reports, Analytics, Settings, Admin. Wrapped in `DashboardShell` (sidebar + topbar + command palette).

Route groups (parenthesized folders) don't affect the URL — `/dashboard` is still `/dashboard`, not `/(app)/dashboard`.

## Data layer

### Mock mode (default)

`NEXT_PUBLIC_API_MODE=mock` (the default) drives the entire app from `src/mocks/`:

- `src/mocks/seed.ts` — a seeded PRNG (`SeededRandom`, `mulberry32`). All "random" data is deterministic given a seed string, so server-rendered and client-rendered output always match (no hydration mismatches).
- `src/mocks/generators.ts` — functions that build one entity (`generateAsset`, `generateAccount`, `generateReport`, ...) from a seed.
- `src/mocks/db.ts` — builds fixed-size collections once per process (e.g. 120 assets, 160 accounts) using `shortId()` — never truncate a seed string for an id; that reintroduces duplicate-id collisions (see the regression test in `tests/unit/seed.test.ts`).

### Live mode

Setting `NEXT_PUBLIC_API_MODE=live` makes every function in `src/lib/api/*.ts` call `apiFetch()` (`src/lib/api/client.ts`) against `NEXT_PUBLIC_API_BASE_URL` instead. The function signatures and return shapes are identical in both modes, so no calling code changes.

### React Query

`src/hooks/use-*.ts` wrap the API functions in `useQuery`/`useMutation`, with query keys centralized in `src/lib/api/query-keys.ts`. Mutations (e.g. `useSubmitReport`, `useUpdateReportStatus`) demonstrate optimistic updates and cache invalidation.

### WebSocket / live alerts

`src/lib/websocket/client.ts` defines `ReconnectingSocket`, a reconnecting WebSocket wrapper with exponential backoff. In mock mode, `useLiveAlertStream` (`src/hooks/use-live-alert-stream.ts`) simulates a trickle of alerts on an interval instead of opening a real socket — the same hook API works once a real backend exists.

## State management

- **Server state** (anything fetched from the API) lives in React Query's cache — never duplicated into Zustand.
- **Client/UI state** lives in Zustand stores under `src/stores/`:
  - `ui-store.ts` — sidebar collapse, command palette open/closed
  - `alert-stream-store.ts` — the live alert feed buffer
  - `settings-store.ts` — user preferences, persisted to `localStorage`

## Design system

- shadcn/ui components (Radix-based) live in `src/components/ui/` — treat this directory as generated; extend via composition in `src/components/shared/` rather than editing generated files where possible.
- The color system follows a validated categorical/status/sequential palette (see `src/app/globals.css` `--chart-*` and `--status-*` tokens). **Recharts renders `fill`/`stroke`/`stopColor` as plain SVG attributes, not CSS**, so `var(--token)` does not resolve there — chart components must resolve literal hex values via `useChartPalette()` (`src/lib/chart-colors.ts`) instead. Everywhere else (Tailwind classes, `style` props) `var(--token)` works normally.

## Testing strategy

- **Unit** (Vitest + Testing Library): pure functions (`src/lib/utils`, `src/mocks/seed.ts`), Zod schemas, small presentational components, hooks.
- **E2E** (Playwright): critical user flows — navigation, the multi-step report submission wizard — run against a real dev server.
