# Component Guide

## Layering

1. **`components/ui/`** — shadcn/ui primitives (Button, Card, Dialog, Table, Form, ...). Generated via the shadcn CLI; treat as low-level building blocks.
2. **`components/shared/`** — reusable, feature-agnostic components built on top of `ui/`. Reach for these first before building something feature-specific.
3. **`components/{feature}/`** — components specific to one page or feature area (e.g. `components/dashboard/`, `components/reports/`).

## Shared components (`src/components/shared/`)

| Component                                                                 | Purpose                                                                         |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `RiskBadge`                                                               | Pill showing a risk level (low/medium/high/critical) with icon + optional score |
| `RiskMeter`                                                               | Horizontal progress-bar style risk score visualization                          |
| `SeverityBadge`                                                           | Alert severity pill (info/warning/danger/critical)                              |
| `ReportStatusBadge`                                                       | Report review status pill (pending/approved/rejected/escalated)                 |
| `StatCard`                                                                | Dashboard KPI tile — label, value, optional delta/trend, loading state          |
| `PageHeader`                                                              | Page title + description + right-aligned actions slot                           |
| `EmptyState`                                                              | Icon + title + description + optional action, for empty lists                   |
| `ErrorState`                                                              | Icon + message + retry button, for failed queries                               |
| `TableSkeleton` / `CardGridSkeleton` / `ChartSkeleton` / `DetailSkeleton` | Loading placeholders (`components/shared/loading-skeletons.tsx`)                |
| `PaginationBar`                                                           | Page-count-aware pagination controls wired to a `page`/`onPageChange` pair      |
| `FilterBar`                                                               | Search input + slot for additional filter controls                              |
| `ConfirmDialog`                                                           | Generic confirm/cancel alert dialog (used for admin approve/reject)             |
| `CopyableAddress`                                                         | Truncated address/hash with copy-to-clipboard, optionally a link                |
| `TimelineList`                                                            | Vertical event timeline (used on asset/account/issuer detail pages)             |
| `RelatedReportsList`                                                      | List of reports referencing a given entity                                      |
| `TransactionsMiniList`                                                    | Compact transaction list (used on account detail)                               |
| `RiskFactorList`                                                          | Risk score breakdown card — meter + weighted factor list                        |
| `MapPlaceholder`                                                          | Explicit placeholder for a future geo-activity map                              |
| `FadeIn`                                                                  | Minimal Framer Motion entrance animation wrapper                                |

## Chart components (`src/components/charts/`)

| Component            | Job                                                                                           |
| -------------------- | --------------------------------------------------------------------------------------------- |
| `TrendAreaChart`     | Single-series time trend (area + line), used for scam trend / daily alerts / network activity |
| `HorizontalBarChart` | Magnitude comparison across categories (risk distribution, report/asset category breakdowns)  |

Both accept `data`, `isLoading`, `isError`, `onRetry` and render their own loading/error states — pass a query result straight through.

**Color rule:** never pass `"var(--token)"` as a `fill`/`stroke`/`stopColor` prop — Recharts renders those as plain SVG attributes, which don't resolve CSS custom properties. Use `useChartPalette()` from `src/lib/chart-colors.ts` to get literal, theme-aware hex values instead.

## Data table (`src/components/tables/data-table.tsx`)

A generic, typed table: pass `columns: DataTableColumn<T>[]` (each with a `render(row: T)`), `rows`, and a `rowKey` extractor. Handles loading/error/empty states and optional row click. Every list page (`assets`, `accounts`, `issuers`, `transactions`, `reports`, admin tables) uses this instead of hand-rolling `<table>` markup.

## Forms

Built with **React Hook Form + Zod + shadcn's `Form` components** (`FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`). The report submission wizard (`src/components/reports/report-wizard.tsx`) is the reference implementation for a multi-step form:

- One `Zod` schema for the whole form (`src/features/reports/schema.ts`), with a `fields` list per step used to call `form.trigger(fields)` before advancing.
- **Give the "Next" and "Submit" buttons distinct `key` props** when they occupy the same JSX position and only one renders at a time — React reuses the same DOM node across a `type="button"` → `type="submit"` swap otherwise, which can cause the browser to treat an in-flight click as a submit. This bit us once; see the git history on `report-wizard.tsx` for the fix.

## Adding a new shadcn/ui component

```bash
npx shadcn@latest add <component-name>
```

This project uses the Radix-based `radix-nova` style (`-b radix`) — if `components.json`'s `style` field ever reads a `base-nova`/`base-*` value, a previous `shadcn init` regressed it back to the experimental Base UI primitives; re-run `npx shadcn@latest init -y -b radix -p nova` to fix it.
