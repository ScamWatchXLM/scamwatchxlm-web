import { describe, expect, it } from "vitest"
import { getAdminReportsQueue } from "@/lib/api/admin"
import { getNetConfirmations } from "@/lib/reports"
import { mockReports } from "@/mocks/db"

describe("getAdminReportsQueue", () => {
  it("orders pending reports by strength of community consensus, strongest first", async () => {
    const pendingCount = mockReports.filter((r) => r.status === "pending").length
    const { items } = await getAdminReportsQueue({ page: 1, pageSize: pendingCount })

    expect(items.length).toBeGreaterThan(0)
    expect(items.every((r) => r.status === "pending")).toBe(true)

    const netStrengths = items.map((r) => Math.abs(getNetConfirmations(r)))
    for (let i = 1; i < netStrengths.length; i++) {
      expect(netStrengths[i]).toBeLessThanOrEqual(netStrengths[i - 1])
    }
  })
})
