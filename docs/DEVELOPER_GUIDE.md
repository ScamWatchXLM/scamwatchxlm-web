# Developer Guide

## Setup

```bash
npm install
npm run dev
```

No environment variables are required — the app runs against the mock data layer out of the box.

## Before opening a PR

```bash
npm run lint
npm run typecheck
npm run format:check
npm run test
npm run test:e2e   # slower; spins up a real dev server
```

All five run in CI (`.github/workflows/ci.yml`) on every push and PR.

## Extensibility points

This scaffold is intentionally ~60–70% complete. The following are the main places a contribution is expected to land, roughly in order of impact:

1. **Real backend integration** — implement the REST endpoints referenced in `src/lib/api/*.ts` (each mock branch has a `// live mode` counterpart already calling `apiFetch`), and set `NEXT_PUBLIC_API_MODE=live`.
2. **Real-time alerts** — `src/lib/websocket/client.ts`'s `ReconnectingSocket` is fully implemented and ready; it just needs a real WebSocket server at `NEXT_PUBLIC_WS_BASE_URL` emitting `{ type: "alert", payload: Alert }` messages.
3. **Risk scoring model** — the mock risk factor library (`src/mocks/generators.ts`) is a placeholder for a real scoring pipeline. `RiskScore.factors` is already the shape the UI expects.
4. **Evidence upload** — `src/components/reports/evidence-upload.tsx` currently only captures file names client-side. Wire it to real object storage (presigned S3/R2 URLs are a natural fit) and populate `ScamReport.evidenceUrls` with real URLs.
5. **Admin moderation workflow** — `src/app/(app)/admin/` covers the read/approve/reject path; audit-log detail views, bulk actions, and role-gated access control are not implemented.
6. **Auth** — there is currently no authentication layer. Admin routes are not access-controlled; this is a placeholder pending a real auth provider.
7. **Global Activity Map** — `src/components/shared/map-placeholder.tsx` is an explicit stub for a future geo-distribution visualization.

Grep for these markers to find other smaller in-code notes:

```bash
grep -rn "extensibility point" src/
```

## Conventions

- **Feature-based organization** — see `docs/FOLDER_STRUCTURE.md`.
- **Mock data must stay deterministic.** Never call `Math.random()`/`Date.now()` during render — use `SeededRandom` (`src/mocks/seed.ts`) seeded by a stable string (usually the entity id). Non-deterministic mock output causes hydration mismatches between server and client render.
- **Never truncate a seed string to build an id.** `seed.slice(0, 8)` collides across many seeds sharing a prefix (e.g. `"report-1"` and `"report-10"`) — this happened once and produced duplicate React keys across the whole app. Use `shortId(seed)` instead, which hashes the full string.
- **`var(--token)` does not work as a Recharts `fill`/`stroke` prop** — see `docs/COMPONENTS.md`'s chart section.
- **Don't run `next build` and `next dev` against the same `.next` directory concurrently** — they clobber each other's build cache and produce a page that loads with no CSS/JS. Stop the dev server (or point `next build` at a different `.next` dir) before building.
- **Query keys are centralized** in `src/lib/api/query-keys.ts` — add new keys there rather than inlining array literals in hooks, so invalidation stays consistent.
- **Server state goes in React Query, client/UI state goes in Zustand** — never mirror fetched data into a Zustand store.

## Adding a new resource (worked example)

To add a new entity type end to end:

1. Add its shape to `src/types/domain.ts`.
2. Add a generator to `src/mocks/generators.ts` and a collection to `src/mocks/db.ts`.
3. Add `getX` / `getXs` functions to a new `src/lib/api/x.ts`, following the mock/live branch pattern in e.g. `assets.ts`.
4. Add query keys to `src/lib/api/query-keys.ts`.
5. Add `useX` / `useXs` hooks to `src/hooks/use-x.ts`.
6. Build the list page with `DataTable` + `FilterBar` + `PaginationBar`, and the detail page with `RiskFactorList` + `TimelineList` as needed — copy `src/app/(app)/assets/` as a template.

## Testing notes

- Unit tests live in `tests/unit/`; the setup file (`tests/unit/setup.ts`) polyfills `matchMedia`/`ResizeObserver` for jsdom.
- E2E tests live in `tests/e2e/` and boot a real `next dev` server via Playwright's `webServer` config — first navigation to an uncompiled route can take a few seconds in dev mode, so e2e assertions that wait on navigation use a generous timeout rather than the 5s default.
