import { describe, expect, it } from "vitest"
import { SeededRandom, shortId } from "@/mocks/seed"

describe("shortId", () => {
  it("is deterministic for the same seed", () => {
    expect(shortId("report-1")).toBe(shortId("report-1"))
  })

  it("does not collide for seeds sharing a naive string prefix", () => {
    // Regression test: a prior implementation used `seed.slice(0, 8)`, which
    // collided for e.g. "report-1" and "report-10" (both truncate to
    // "report-1"), producing duplicate ids and duplicate React keys.
    const ids = new Set<string>()
    for (let i = 0; i < 200; i++) {
      ids.add(shortId(`report-${i}`))
    }
    expect(ids.size).toBe(200)
  })
})

describe("SeededRandom", () => {
  it("produces the same sequence for the same seed", () => {
    const a = new SeededRandom("fixed-seed")
    const b = new SeededRandom("fixed-seed")
    const seqA = Array.from({ length: 5 }, () => a.int(0, 1000))
    const seqB = Array.from({ length: 5 }, () => b.int(0, 1000))
    expect(seqA).toEqual(seqB)
  })

  it("int() stays within the requested inclusive range", () => {
    const rng = new SeededRandom("range-check")
    for (let i = 0; i < 100; i++) {
      const value = rng.int(5, 10)
      expect(value).toBeGreaterThanOrEqual(5)
      expect(value).toBeLessThanOrEqual(10)
    }
  })

  it("generates a well-formed Stellar-style public key", () => {
    const rng = new SeededRandom("pubkey-check")
    const key = rng.stellarPublicKey()
    expect(key).toMatch(/^G[A-Z2-7]{55}$/)
  })
})
