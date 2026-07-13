import { describe, expect, it } from "vitest"
import {
  formatCompactNumber,
  formatCurrency,
  formatPercent,
  meetsMinimumSeverity,
  riskLevelFromScore,
  truncateMiddle,
} from "@/lib/utils/format"

describe("truncateMiddle", () => {
  it("shortens long strings to prefix…suffix", () => {
    expect(truncateMiddle("GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890", 6, 6)).toBe(
      "GABCDE…567890"
    )
  })

  it("returns short strings unchanged", () => {
    expect(truncateMiddle("short", 6, 6)).toBe("short")
  })
})

describe("riskLevelFromScore", () => {
  it("maps scores to the correct band", () => {
    expect(riskLevelFromScore(0)).toBe("low")
    expect(riskLevelFromScore(29)).toBe("low")
    expect(riskLevelFromScore(30)).toBe("medium")
    expect(riskLevelFromScore(59)).toBe("medium")
    expect(riskLevelFromScore(60)).toBe("high")
    expect(riskLevelFromScore(84)).toBe("high")
    expect(riskLevelFromScore(85)).toBe("critical")
    expect(riskLevelFromScore(100)).toBe("critical")
  })
})

describe("formatCompactNumber", () => {
  it("compacts large numbers", () => {
    expect(formatCompactNumber(1500)).toBe("1.5K")
    expect(formatCompactNumber(2_400_000)).toBe("2.4M")
  })
})

describe("formatCurrency", () => {
  it("formats whole-dollar amounts without excess precision", () => {
    expect(formatCurrency(1200)).toBe("$1,200.00")
  })

  it("uses extra precision for sub-$1 amounts", () => {
    expect(formatCurrency(0.1234)).toBe("$0.1234")
  })
})

describe("formatPercent", () => {
  it("formats a 0-100 value as a percentage", () => {
    expect(formatPercent(41.5)).toBe("41.5%")
  })
})

describe("meetsMinimumSeverity", () => {
  it("passes alerts at or above the minimum threshold", () => {
    expect(meetsMinimumSeverity("critical", "high")).toBe(true)
    expect(meetsMinimumSeverity("danger", "high")).toBe(true)
  })

  it("blocks alerts below the minimum threshold", () => {
    expect(meetsMinimumSeverity("info", "high")).toBe(false)
    expect(meetsMinimumSeverity("warning", "critical")).toBe(false)
  })

  it("treats 'low' as accepting every severity", () => {
    expect(meetsMinimumSeverity("info", "low")).toBe(true)
  })
})
