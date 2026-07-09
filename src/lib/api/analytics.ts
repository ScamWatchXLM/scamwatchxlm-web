import { apiFetch, mockDelay } from "./client"
import { isMockMode } from "@/config/env"
import { mockAssets, mockReporters } from "@/mocks/db"
import { generateCategoryBreakdown, generateSeries } from "@/mocks/generators"
import type {
  AnalyticsCategoryBreakdown,
  AnalyticsSeriesPoint,
  AssetCategory,
  Reporter,
} from "@/types/domain"

export async function getScamTrendSeries(): Promise<AnalyticsSeriesPoint[]> {
  if (isMockMode) {
    await mockDelay()
    return generateSeries("scam-trend", 30, 20, 220)
  }
  return apiFetch<AnalyticsSeriesPoint[]>("/analytics/scam-trend")
}

export async function getDailyAlertsSeries(): Promise<AnalyticsSeriesPoint[]> {
  if (isMockMode) {
    await mockDelay()
    return generateSeries("daily-alerts", 30, 40, 400)
  }
  return apiFetch<AnalyticsSeriesPoint[]>("/analytics/daily-alerts")
}

export async function getNetworkActivitySeries(): Promise<AnalyticsSeriesPoint[]> {
  if (isMockMode) {
    await mockDelay()
    return generateSeries("network-activity", 30, 200000, 340000)
  }
  return apiFetch<AnalyticsSeriesPoint[]>("/analytics/network-activity")
}

export async function getRiskDistribution(): Promise<{ level: string; count: number }[]> {
  if (isMockMode) {
    await mockDelay()
    return [
      { level: "low", count: 6820 },
      { level: "medium", count: 2140 },
      { level: "high", count: 940 },
      { level: "critical", count: 260 },
    ]
  }
  return apiFetch("/analytics/risk-distribution")
}

export async function getCategoryBreakdown(): Promise<AnalyticsCategoryBreakdown[]> {
  if (isMockMode) {
    await mockDelay()
    return generateCategoryBreakdown("report-categories")
  }
  return apiFetch<AnalyticsCategoryBreakdown[]>("/analytics/report-categories")
}

export async function getAssetCategoryBreakdown(): Promise<
  { category: AssetCategory; count: number }[]
> {
  if (isMockMode) {
    await mockDelay()
    const counts = new Map<AssetCategory, number>()
    for (const asset of mockAssets) {
      counts.set(asset.category, (counts.get(asset.category) ?? 0) + 1)
    }
    return Array.from(counts.entries()).map(([category, count]) => ({ category, count }))
  }
  return apiFetch("/analytics/asset-categories")
}

export async function getTopReporters(limit = 10): Promise<Reporter[]> {
  if (isMockMode) {
    await mockDelay()
    return mockReporters.slice(0, limit)
  }
  return apiFetch<Reporter[]>("/analytics/top-reporters", { params: { limit } })
}
