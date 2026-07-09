# Deployment Guide

The app is a standard Next.js 15 App Router project and can be deployed anywhere Next.js runs. Three common paths:

## 1. Vercel (simplest)

1. Import the repository at [vercel.com/new](https://vercel.com/new).
2. Set environment variables (Project Settings → Environment Variables) — at minimum, leave `NEXT_PUBLIC_API_MODE` unset or `mock` to run standalone, or set it to `live` plus the two API URLs to point at a real backend.
3. Vercel auto-detects Next.js; no build command changes needed. `next.config.ts`'s `output: "standalone"` is harmless on Vercel (Vercel uses its own build output) — no changes needed there.

## 2. Docker

The included `Dockerfile` is a multi-stage build producing a minimal runtime image using Next's `standalone` output.

```bash
docker build -t scamwatchxlm-web .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_MODE=mock scamwatchxlm-web
```

Or with Compose:

```bash
docker compose up --build
```

Environment variables prefixed `NEXT_PUBLIC_*` are inlined **at build time** (standard Next.js behavior), so if you need different values per environment, build separate images per environment or pass them via `--build-arg` + `ARG`/`ENV` in the Dockerfile and reference them in `next.config.ts`.

## 3. Any Node host (Railway, Render, Fly.io, a VM, ...)

```bash
npm ci
npm run build
npm run start   # serves on $PORT, default 3000
```

The app has no database and no server-side session state in mock mode, so it scales horizontally with zero coordination. In live mode, all state lives behind the external API — the frontend remains stateless.

## CI/CD

`.github/workflows/ci.yml` runs on every push/PR: lint, typecheck, format check, unit tests (with coverage artifact), a production build, Playwright e2e tests, and a Docker build (not pushed). Wire a deploy step (Vercel CLI, `docker push` + your registry, or a platform-specific action) onto the end of that workflow, gated on `main` — this repo intentionally stops short of a live deploy target since none is configured yet.

## Health check

`GET /api/health` returns `{ status: "ok", timestamp }` — point your platform's health check / load balancer probe at this route.
