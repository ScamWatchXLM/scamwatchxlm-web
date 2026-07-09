# ScamWatchXLM

The public-facing dashboard where users, developers, and security researchers can explore threats and submit reports across the Stellar (XLM) network.

ScamWatchXLM tracks accounts, assets, issuers, and transactions across the Stellar network, assigns each a risk score, and lets the community file and review scam reports — all through a modern, accessible, dark-mode-first dashboard.

## Status

This repository is a **frontend scaffold at roughly 60–70% completion**, built to run entirely standalone against a deterministic mock data layer (no backend required) while being structured for a real API to be dropped in later. Extensibility points are called out inline with comments — see [`docs/DEVELOPER_GUIDE.md`](docs/DEVELOPER_GUIDE.md) for the full list before contributing.

## Tech stack

| Layer         | Choice                                                      |
| ------------- | ----------------------------------------------------------- |
| Framework     | Next.js 15 (App Router), React 19, TypeScript               |
| Styling       | Tailwind CSS v4, shadcn/ui (Radix primitives)               |
| Data fetching | TanStack Query, a typed REST client with a mock/live toggle |
| Forms         | React Hook Form + Zod                                       |
| Charts        | Recharts                                                    |
| State         | Zustand                                                     |
| Animation     | Framer Motion                                               |
| Icons         | Lucide                                                      |
| Testing       | Vitest + React Testing Library, Playwright                  |
| Tooling       | ESLint, Prettier, Docker, GitHub Actions                    |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app runs immediately against the built-in mock data layer — no environment variables or backend required.

### Connecting a real backend

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_API_MODE=live
NEXT_PUBLIC_API_BASE_URL=https://your-api.example.com/v1
NEXT_PUBLIC_WS_BASE_URL=wss://your-api.example.com/v1/stream
```

Every function in `src/lib/api/` already branches on this flag — flipping it to `live` routes all data fetching through `apiFetch()` in `src/lib/api/client.ts` instead of the mock generators, with no changes needed in components or hooks.

## Scripts

| Command                           | Description                   |
| --------------------------------- | ----------------------------- |
| `npm run dev`                     | Start the dev server          |
| `npm run build`                   | Production build              |
| `npm run start`                   | Serve the production build    |
| `npm run lint`                    | ESLint                        |
| `npm run typecheck`               | `tsc --noEmit`                |
| `npm run format` / `format:check` | Prettier                      |
| `npm run test`                    | Unit tests (Vitest)           |
| `npm run test:coverage`           | Unit tests with coverage      |
| `npm run test:e2e`                | End-to-end tests (Playwright) |

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system design, data flow, and key decisions
- [`docs/FOLDER_STRUCTURE.md`](docs/FOLDER_STRUCTURE.md) — where everything lives
- [`docs/COMPONENTS.md`](docs/COMPONENTS.md) — the component library
- [`docs/DEVELOPER_GUIDE.md`](docs/DEVELOPER_GUIDE.md) — conventions, extensibility points, how to contribute
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — deploying with Docker, Vercel, or a Node host

## License

Community-driven and open source.
