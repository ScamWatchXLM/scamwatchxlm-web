import { apiFetch, mockDelay } from "./client"
import { isMockMode } from "@/config/env"
import { mockIssuers } from "@/mocks/db"
import { generateAsset, generateTimelineEvent, paginate } from "@/mocks/generators"
import type { Issuer, Paginated, StellarAsset, TimelineEvent } from "@/types/domain"

export interface ListIssuersParams {
  page?: number
  pageSize?: number
  query?: string
  verifiedOnly?: boolean
  sort?: "riskScore" | "trustlineCount" | "reportCount"
}

export async function getIssuers(
  params: ListIssuersParams = {}
): Promise<Paginated<Issuer>> {
  const { page = 1, pageSize = 20, query, verifiedOnly, sort = "riskScore" } = params

  if (isMockMode) {
    await mockDelay()
    let items = [...mockIssuers]
    if (query) {
      const q = query.toLowerCase()
      items = items.filter(
        (i) => i.id.toLowerCase().includes(q) || i.name?.toLowerCase().includes(q)
      )
    }
    if (verifiedOnly) items = items.filter((i) => i.verified)
    items.sort((a, b) => {
      if (sort === "riskScore") return b.riskScore.value - a.riskScore.value
      if (sort === "trustlineCount") return b.trustlineCount - a.trustlineCount
      return b.reportCount - a.reportCount
    })
    return paginate(items, page, pageSize)
  }

  return apiFetch<Paginated<Issuer>>("/issuers", {
    params: { page, pageSize, query, verifiedOnly, sort },
  })
}

export async function getIssuer(id: string): Promise<Issuer | undefined> {
  if (isMockMode) {
    await mockDelay()
    return mockIssuers.find((i) => i.id === id) ?? mockIssuers[0]
  }
  return apiFetch<Issuer>(`/issuers/${id}`)
}

export async function getIssuerAssets(issuer: Issuer): Promise<StellarAsset[]> {
  if (isMockMode) {
    await mockDelay(150)
    return issuer.issuedAssets.map((assetId, i) => ({
      ...generateAsset(`issuer-asset-${issuer.id}-${i}`, i),
      id: assetId,
      issuer: issuer.id,
      issuerName: issuer.name,
    }))
  }
  return apiFetch<StellarAsset[]>(`/issuers/${issuer.id}/assets`)
}

export async function getIssuerTimeline(id: string): Promise<TimelineEvent[]> {
  if (isMockMode) {
    await mockDelay(150)
    return Array.from({ length: 8 }, (_, i) =>
      generateTimelineEvent(`${id}-issuer-timeline-${i}`)
    )
  }
  return apiFetch<TimelineEvent[]>(`/issuers/${id}/timeline`)
}
