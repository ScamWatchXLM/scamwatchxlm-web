import { apiFetch, mockDelay } from "./client"
import { isMockMode } from "@/config/env"
import { mockReports } from "@/mocks/db"
import { generateReport, paginate } from "@/mocks/generators"
import { SeededRandom } from "@/mocks/seed"
import type {
  EntityKind,
  Paginated,
  ReportCategory,
  ReportStatus,
  ReportVote,
  ScamReport,
} from "@/types/domain"

export interface ListReportsParams {
  page?: number
  pageSize?: number
  query?: string
  status?: ReportStatus
  category?: ReportCategory
  targetId?: string
}

export async function getReports(
  params: ListReportsParams = {}
): Promise<Paginated<ScamReport>> {
  const { page = 1, pageSize = 20, query, status, category, targetId } = params

  if (isMockMode) {
    await mockDelay()
    let items = [...mockReports]
    if (query) {
      const q = query.toLowerCase()
      items = items.filter(
        (r) =>
          r.title.toLowerCase().includes(q) || r.targetLabel.toLowerCase().includes(q)
      )
    }
    if (status) items = items.filter((r) => r.status === status)
    if (category) items = items.filter((r) => r.category === category)
    if (targetId) items = items.filter((r) => r.targetId === targetId)
    items.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    return paginate(items, page, pageSize)
  }

  return apiFetch<Paginated<ScamReport>>("/reports", {
    params: { page, pageSize, query, status, category, targetId },
  })
}

/**
 * Deterministically generates 0–3 reports "about" a given entity for its
 * detail-page Reports tab. The mock report pool is generated independently
 * of real entity ids, so a direct `targetId` match against it is rare —
 * this keeps detail pages populated with representative data instead.
 */
export async function getRelatedReports(
  entityId: string,
  entityKind: EntityKind,
  entityLabel: string
): Promise<ScamReport[]> {
  if (isMockMode) {
    await mockDelay(150)
    const rng = new SeededRandom(`related-${entityId}`)
    const count = rng.int(0, 3)
    return Array.from({ length: count }, (_, i) => {
      const report = generateReport(`related-${entityId}-${i}`)
      const relatedReport: ScamReport = {
        ...report,
        targetKind: entityKind,
        targetId: entityId,
        targetLabel: entityLabel,
      }
      // Register so a later getReport(id) lookup (e.g. clicking through to
      // the detail page) can find this exact report instead of falling
      // through to an unrelated one.
      if (!mockReports.some((r) => r.id === relatedReport.id)) {
        mockReports.push(relatedReport)
      }
      return relatedReport
    })
  }
  return apiFetch<ScamReport[]>("/reports", { params: { targetId: entityId } })
}

export async function getReport(id: string): Promise<ScamReport | undefined> {
  if (isMockMode) {
    await mockDelay()
    return mockReports.find((r) => r.id === id)
  }
  return apiFetch<ScamReport>(`/reports/${id}`)
}

export interface SubmitReportInput {
  title: string
  category: ReportCategory
  description: string
  targetKind: ScamReport["targetKind"]
  targetId: string
  evidenceUrls: string[]
  reporterHandle: string
}

export async function submitReport(input: SubmitReportInput): Promise<ScamReport> {
  if (isMockMode) {
    await mockDelay(400)
    const now = new Date().toISOString()
    const report: ScamReport = {
      id: `RPT-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
      title: input.title,
      category: input.category,
      status: "pending",
      severity: "warning",
      description: input.description,
      targetKind: input.targetKind,
      targetId: input.targetId,
      targetLabel: input.targetId,
      reporterHandle: input.reporterHandle,
      createdAt: now,
      updatedAt: now,
      evidenceUrls: input.evidenceUrls,
      upvotes: 0,
      downvotes: 0,
    }
    mockReports.unshift(report)
    return report
  }

  return apiFetch<ScamReport>("/reports", { method: "POST", body: input })
}

/**
 * Casts (or changes/retracts) the current browser's vote on a report.
 * `previousVote` is passed in by the caller — read from the client-side
 * vote store — so the mock layer can move the right counters rather than
 * just incrementing blindly.
 */
export async function castReportVote(
  id: string,
  vote: ReportVote | null,
  previousVote: ReportVote | null
): Promise<ScamReport> {
  if (isMockMode) {
    await mockDelay(200)
    const report = mockReports.find((r) => r.id === id)
    if (!report) throw new Error("Report not found")
    if (previousVote === "confirm") report.upvotes = Math.max(0, report.upvotes - 1)
    if (previousVote === "dispute") report.downvotes = Math.max(0, report.downvotes - 1)
    if (vote === "confirm") report.upvotes += 1
    if (vote === "dispute") report.downvotes += 1
    report.updatedAt = new Date().toISOString()
    return report
  }

  return apiFetch<ScamReport>(`/reports/${id}/vote`, {
    method: "POST",
    body: { vote },
  })
}

export async function updateReportStatus(
  id: string,
  status: ReportStatus,
  reviewerNote?: string
): Promise<ScamReport> {
  if (isMockMode) {
    await mockDelay(250)
    const report = mockReports.find((r) => r.id === id)
    if (!report) throw new Error("Report not found")
    report.status = status
    report.updatedAt = new Date().toISOString()
    if (reviewerNote) report.reviewerNote = reviewerNote
    return report
  }

  return apiFetch<ScamReport>(`/reports/${id}/status`, {
    method: "PATCH",
    body: { status, reviewerNote },
  })
}
