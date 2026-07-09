import { apiFetch, mockDelay } from "./client"
import { isMockMode } from "@/config/env"
import { mockAssets, mockIssuers, mockReports } from "@/mocks/db"
import { generateNetworkStats } from "@/mocks/generators"
import type { Issuer, NetworkStats, ScamReport, StellarAsset } from "@/types/domain"

export async function getNetworkStats(): Promise<NetworkStats> {
  if (isMockMode) {
    await mockDelay()
    return generateNetworkStats()
  }
  return apiFetch<NetworkStats>("/stats/network")
}

export async function getMostTargetedAssets(limit = 6): Promise<StellarAsset[]> {
  if (isMockMode) {
    await mockDelay()
    return [...mockAssets]
      .sort((a, b) => b.riskScore.value - a.riskScore.value)
      .slice(0, limit)
  }
  return apiFetch<StellarAsset[]>("/stats/top-assets", { params: { limit } })
}

export async function getMostTargetedIssuers(limit = 6): Promise<Issuer[]> {
  if (isMockMode) {
    await mockDelay()
    return [...mockIssuers].sort((a, b) => b.reportCount - a.reportCount).slice(0, limit)
  }
  return apiFetch<Issuer[]>("/stats/top-issuers", { params: { limit } })
}

export async function getLatestReports(limit = 6): Promise<ScamReport[]> {
  if (isMockMode) {
    await mockDelay()
    return [...mockReports]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
  }
  return apiFetch<ScamReport[]>("/stats/latest-reports", { params: { limit } })
}
