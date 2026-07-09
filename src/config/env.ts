/**
 * Centralized environment configuration.
 *
 * `NEXT_PUBLIC_API_MODE` toggles between the "mock" data layer (default, so
 * the app runs standalone with no backend) and "live", which points the API
 * client at a real ScamWatchXLM API deployment. Community contributors wiring
 * up a real backend only need to flip this flag and set the URLs below.
 */

export const env = {
  apiMode: (process.env.NEXT_PUBLIC_API_MODE ?? "mock") as "mock" | "live",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.scamwatchxlm.org/v1",
  wsBaseUrl:
    process.env.NEXT_PUBLIC_WS_BASE_URL ?? "wss://api.scamwatchxlm.org/v1/stream",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const

export const isMockMode = env.apiMode === "mock"
