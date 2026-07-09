import { apiFetch, mockDelay } from "./client"
import { isMockMode } from "@/config/env"
import { mockAccounts } from "@/mocks/db"
import { generateTimelineEvent, paginate } from "@/mocks/generators"
import type { Account, Paginated, TimelineEvent } from "@/types/domain"

export interface ListAccountsParams {
  page?: number
  pageSize?: number
  query?: string
  flaggedOnly?: boolean
  sort?: "riskScore" | "transactionCount" | "reportCount" | "lastActivityAt"
}

export async function getAccounts(
  params: ListAccountsParams = {}
): Promise<Paginated<Account>> {
  const { page = 1, pageSize = 20, query, flaggedOnly, sort = "riskScore" } = params

  if (isMockMode) {
    await mockDelay()
    let items = [...mockAccounts]
    if (query) {
      const q = query.toLowerCase()
      items = items.filter(
        (a) => a.id.toLowerCase().includes(q) || a.label?.toLowerCase().includes(q)
      )
    }
    if (flaggedOnly) items = items.filter((a) => a.flagged)
    items.sort((a, b) => {
      if (sort === "riskScore") return b.riskScore.value - a.riskScore.value
      if (sort === "transactionCount") return b.transactionCount - a.transactionCount
      if (sort === "reportCount") return b.reportCount - a.reportCount
      return new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
    })
    return paginate(items, page, pageSize)
  }

  return apiFetch<Paginated<Account>>("/accounts", {
    params: { page, pageSize, query, flaggedOnly, sort },
  })
}

export async function getAccount(id: string): Promise<Account | undefined> {
  if (isMockMode) {
    await mockDelay()
    return mockAccounts.find((a) => a.id === id) ?? mockAccounts[0]
  }
  return apiFetch<Account>(`/accounts/${id}`)
}

export async function getAccountTimeline(id: string): Promise<TimelineEvent[]> {
  if (isMockMode) {
    await mockDelay(150)
    return Array.from({ length: 10 }, (_, i) =>
      generateTimelineEvent(`${id}-timeline-${i}`)
    )
  }
  return apiFetch<TimelineEvent[]>(`/accounts/${id}/timeline`)
}
