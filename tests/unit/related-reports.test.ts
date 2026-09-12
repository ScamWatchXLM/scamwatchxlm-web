import { describe, expect, it } from "vitest"
import { getRelatedReports, getReport } from "@/lib/api/reports"

describe("getReport after getRelatedReports", () => {
  it("resolves a related report's own id, not an unrelated fallback", async () => {
    let related: Awaited<ReturnType<typeof getRelatedReports>> = []
    for (let i = 0; i < 20 && related.length === 0; i++) {
      related = await getRelatedReports(`entity-${i}`, "account", "Example Account")
    }
    expect(related.length).toBeGreaterThan(0)

    const target = related[0]
    const fetched = await getReport(target.id)

    expect(fetched).toBeDefined()
    expect(fetched?.id).toBe(target.id)
    expect(fetched?.targetId).toBe(target.targetId)
  })

  it("returns undefined for an id that truly does not exist", async () => {
    const fetched = await getReport("does-not-exist")
    expect(fetched).toBeUndefined()
  })
})
