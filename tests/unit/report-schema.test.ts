import { describe, expect, it } from "vitest"
import { reportFormSchema } from "@/features/reports/schema"

const validReport = {
  targetKind: "account" as const,
  targetId: "GABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF",
  title: "Fake wallet login page",
  category: "phishing" as const,
  description: "A".repeat(50),
  reporterHandle: "reporter1",
  evidenceFileNames: [],
  agreeToGuidelines: true as const,
}

describe("reportFormSchema", () => {
  it("accepts a fully valid report", () => {
    const result = reportFormSchema.safeParse(validReport)
    expect(result.success).toBe(true)
  })

  it("rejects a title that is too short", () => {
    const result = reportFormSchema.safeParse({ ...validReport, title: "short" })
    expect(result.success).toBe(false)
  })

  it("rejects a description under 40 characters", () => {
    const result = reportFormSchema.safeParse({
      ...validReport,
      description: "too short",
    })
    expect(result.success).toBe(false)
  })

  it("rejects when the guidelines checkbox is not agreed to", () => {
    const result = reportFormSchema.safeParse({
      ...validReport,
      agreeToGuidelines: false,
    })
    expect(result.success).toBe(false)
  })

  it("rejects more than 5 evidence files", () => {
    const result = reportFormSchema.safeParse({
      ...validReport,
      evidenceFileNames: ["a.png", "b.png", "c.png", "d.png", "e.png", "f.png"],
    })
    expect(result.success).toBe(false)
  })
})
