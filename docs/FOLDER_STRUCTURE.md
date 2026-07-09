# Folder Structure

```
src/
├── app/                        # Next.js App Router
│   ├── (marketing)/            # Landing, About, Docs — simple navbar/footer layout
│   │   ├── about/page.tsx
│   │   ├── docs/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx            # Landing page
│   ├── (app)/                  # Dashboard shell (sidebar + topbar)
│   │   ├── dashboard/page.tsx
│   │   ├── alerts/page.tsx
│   │   ├── search/page.tsx
│   │   ├── assets/{page.tsx,[id]/page.tsx}
│   │   ├── accounts/{page.tsx,[id]/page.tsx}
│   │   ├── issuers/{page.tsx,[id]/page.tsx}
│   │   ├── transactions/{page.tsx,[hash]/page.tsx}
│   │   ├── reports/{page.tsx,[id]/page.tsx,new/page.tsx}
│   │   ├── analytics/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── admin/{page.tsx,reports/,users/,logs/}
│   │   ├── layout.tsx
│   │   └── loading.tsx
│   ├── api/health/route.ts     # Health check endpoint
│   ├── layout.tsx               # Root layout (providers, fonts, metadata)
│   ├── error.tsx                 # Global error boundary
│   ├── not-found.tsx            # 404 page
│   └── globals.css
│
├── components/
│   ├── ui/                     # shadcn/ui primitives (generated — extend, don't fork)
│   ├── layout/                 # Sidebar, Topbar, MobileNav, CommandPalette, theme toggle
│   ├── shared/                 # Cross-feature building blocks: RiskBadge, StatCard,
│   │                           # PageHeader, EmptyState, ErrorState, loading skeletons,
│   │                           # PaginationBar, FilterBar, ConfirmDialog, timelines, etc.
│   ├── charts/                 # Generic Recharts wrappers (TrendAreaChart, HorizontalBarChart)
│   ├── tables/                 # Generic DataTable
│   ├── dashboard/               # Dashboard-page-specific widgets
│   ├── analytics/               # Analytics-page-specific widgets
│   ├── reports/                 # Report wizard, evidence upload, step indicator
│   ├── admin/                   # (extensibility point — admin-specific widgets)
│   ├── marketing/               # Landing-page-only widgets (HeroStats)
│   └── providers/               # QueryProvider, ThemeProvider, AppProviders
│
├── features/
│   └── reports/schema.ts        # Zod schema + step config for the report wizard
│
├── hooks/                       # React Query hooks (use-assets.ts, use-reports.ts, ...)
│                                 # + utility hooks (use-debounced-value, use-media-query, ...)
│
├── lib/
│   ├── api/                     # Typed API client — one file per resource + query-keys.ts
│   ├── websocket/client.ts      # Reconnecting WebSocket wrapper
│   └── utils/format.ts          # Number/date/risk formatting helpers
│
├── mocks/                        # Deterministic mock data layer
│   ├── seed.ts                  # Seeded PRNG + shortId()
│   ├── generators.ts             # Per-entity generators
│   └── db.ts                     # Fixed-size in-memory collections
│
├── stores/                       # Zustand stores (ui, alert-stream, settings)
├── types/domain.ts               # Single source of truth for all domain shapes
└── config/                       # site.ts (nav config), env.ts (env var access)

tests/
├── unit/                         # Vitest + Testing Library
└── e2e/                          # Playwright

docs/                              # This documentation set
.github/workflows/ci.yml           # Lint, typecheck, unit tests, build, e2e, Docker build
```

## Conventions

- **One component per file**, named exports (not default), matching the filename in kebab-case.
- **Hooks own data fetching** — page/components call `useAssets()`, never `getAssets()` directly (the raw API functions are for hooks and server-only code only).
- **Types flow from `src/types/domain.ts`** — mock generators, API functions, and UI props all import from there rather than redeclaring shapes.
