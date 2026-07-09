import { env } from "@/config/env"

export class ApiError extends Error {
  status: number
  info?: unknown

  constructor(message: string, status: number, info?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.info = info
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | undefined>
  body?: unknown
}

/**
 * Typed fetch wrapper for the live ScamWatchXLM REST API.
 *
 * Only used when `NEXT_PUBLIC_API_MODE=live`. In mock mode (the default),
 * resource modules under `src/lib/api/` short-circuit to `src/mocks/db.ts`
 * instead of calling this function — see e.g. `getAssets()` in `assets.ts`.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, body, headers, ...rest } = options

  const url = new URL(path.replace(/^\//, ""), `${env.apiBaseUrl}/`)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value))
    }
  }

  const response = await fetch(url.toString(), {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    let info: unknown
    try {
      info = await response.json()
    } catch {
      info = undefined
    }
    throw new ApiError(
      `Request to ${path} failed with ${response.status}`,
      response.status,
      info
    )
  }

  if (response.status === 204) return undefined as T

  return (await response.json()) as T
}

/** Simulated network latency for the mock data layer, kept short for a snappy UX. */
export function mockDelay(ms = 220): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
