import { describe, expect, it } from "vitest"
import { generateSeries } from "@/mocks/generators"

describe("generateSeries", () => {
  it("ends on the mock 'today' rather than the day before it", () => {
    const series = generateSeries("test-series", 30, 0, 100)
    const last = series[series.length - 1]
    expect(last.date).toBe("2026-07-09")
  })

  it("spans exactly `points` consecutive days ending on 'today'", () => {
    const points = 14
    const series = generateSeries("test-series", points, 0, 100)
    const dates = series.map((p) => p.date)
    expect(dates).toEqual([
      "2026-06-26",
      "2026-06-27",
      "2026-06-28",
      "2026-06-29",
      "2026-06-30",
      "2026-07-01",
      "2026-07-02",
      "2026-07-03",
      "2026-07-04",
      "2026-07-05",
      "2026-07-06",
      "2026-07-07",
      "2026-07-08",
      "2026-07-09",
    ])
  })
})
