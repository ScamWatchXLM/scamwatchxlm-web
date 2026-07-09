import { apiFetch, mockDelay } from "./client"
import { isMockMode } from "@/config/env"
import { mockAssets } from "@/mocks/db"
import { generateTimelineEvent, paginate } from "@/mocks/generators"
import type { Paginated, StellarAsset, TimelineEvent } from "@/types/domain"

export interface ListAssetsParams {
  page?: number
  pageSize?: number
  query?: string
  category?: string
  flaggedOnly?: boolean
  sort?: "riskScore" | "trustlineCount" | "volume24h" | "createdAt"
}

export async function getAssets(
  params: ListAssetsParams = {}
): Promise<Paginated<StellarAsset>> {
  const {
    page = 1,
    pageSize = 20,
    query,
    category,
    flaggedOnly,
    sort = "riskScore",
  } = params

  if (isMockMode) {
    await mockDelay()
    let items = [...mockAssets]
    if (query) {
      const q = query.toLowerCase()
      items = items.filter(
        (a) => a.code.toLowerCase().includes(q) || a.issuer.toLowerCase().includes(q)
      )
    }
    if (category) items = items.filter((a) => a.category === category)
    if (flaggedOnly) items = items.filter((a) => a.flagged)
    items.sort((a, b) => {
      if (sort === "riskScore") return b.riskScore.value - a.riskScore.value
      if (sort === "trustlineCount") return b.trustlineCount - a.trustlineCount
      if (sort === "volume24h") return b.volume24h - a.volume24h
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    return paginate(items, page, pageSize)
  }

  return apiFetch<Paginated<StellarAsset>>("/assets", {
    params: { page, pageSize, query, category, flaggedOnly, sort },
  })
}

export async function getAsset(id: string): Promise<StellarAsset | undefined> {
  if (isMockMode) {
    await mockDelay()
    return mockAssets.find((a) => a.id === id) ?? mockAssets[0]
  }
  return apiFetch<StellarAsset>(`/assets/${id}`)
}

export async function getAssetTimeline(id: string): Promise<TimelineEvent[]> {
  if (isMockMode) {
    await mockDelay(150)
    return Array.from({ length: 8 }, (_, i) =>
      generateTimelineEvent(`${id}-asset-timeline-${i}`)
    )
  }
  return apiFetch<TimelineEvent[]>(`/assets/${id}/timeline`)
}
