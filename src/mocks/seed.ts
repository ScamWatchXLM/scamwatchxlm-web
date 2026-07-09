/**
 * Deterministic pseudo-random helpers used by the mock data layer.
 *
 * The mock generators must produce identical output on the server and the
 * client for the same inputs, otherwise React hydration will mismatch. Never
 * swap this out for `Math.random()` without also making generation
 * client-only (e.g. inside a `useEffect`).
 */

export function seedFromString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (Math.imul(31, hash) + input.charCodeAt(i)) | 0
  }
  return hash >>> 0
}

/**
 * Deterministic short id derived from a full hash of `seed`, not a
 * substring of it — a naive `seed.slice(0, N)` collides whenever two seeds
 * share a prefix (e.g. "report-1" and "report-10"), which produced
 * duplicate mock entity ids and duplicate React keys in list views.
 */
export function shortId(seed: string): string {
  return seedFromString(seed).toString(36).toUpperCase().padStart(7, "0")
}

/** mulberry32 PRNG — fast, tiny, deterministic given a numeric seed. */
export function mulberry32(seed: number) {
  let a = seed
  return function next() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export class SeededRandom {
  private next: () => number

  constructor(seed: number | string) {
    this.next = mulberry32(typeof seed === "string" ? seedFromString(seed) : seed)
  }

  float(min = 0, max = 1): number {
    return min + this.next() * (max - min)
  }

  int(min: number, max: number): number {
    return Math.floor(this.float(min, max + 1))
  }

  bool(probabilityTrue = 0.5): boolean {
    return this.next() < probabilityTrue
  }

  pick<T>(items: readonly T[]): T {
    return items[this.int(0, items.length - 1)]
  }

  pickMany<T>(items: readonly T[], count: number): T[] {
    const pool = [...items]
    const result: T[] = []
    for (let i = 0; i < count && pool.length > 0; i++) {
      const idx = this.int(0, pool.length - 1)
      result.push(pool[idx])
      pool.splice(idx, 1)
    }
    return result
  }

  stellarPublicKey(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
    let out = "G"
    for (let i = 0; i < 55; i++) out += chars[this.int(0, chars.length - 1)]
    return out
  }

  txHash(): string {
    const chars = "0123456789abcdef"
    let out = ""
    for (let i = 0; i < 64; i++) out += chars[this.int(0, chars.length - 1)]
    return out
  }

  dateWithinDays(daysAgo: number): string {
    const now = Date.UTC(2026, 6, 9, 12, 0, 0)
    const offsetMs = this.float(0, daysAgo) * 24 * 60 * 60 * 1000
    return new Date(now - offsetMs).toISOString()
  }
}
