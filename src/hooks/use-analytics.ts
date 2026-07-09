import { useQuery } from "@tanstack/react-query"
import {
  getAssetCategoryBreakdown,
  getCategoryBreakdown,
  getDailyAlertsSeries,
  getNetworkActivitySeries,
  getRiskDistribution,
  getScamTrendSeries,
  getTopReporters,
} from "@/lib/api/analytics"
import { queryKeys } from "@/lib/api/query-keys"

export function useScamTrendSeries() {
  return useQuery({
    queryKey: queryKeys.analytics.scamTrend,
    queryFn: getScamTrendSeries,
  })
}

export function useDailyAlertsSeries() {
  return useQuery({
    queryKey: queryKeys.analytics.dailyAlerts,
    queryFn: getDailyAlertsSeries,
  })
}

export function useNetworkActivitySeries() {
  return useQuery({
    queryKey: queryKeys.analytics.networkActivity,
    queryFn: getNetworkActivitySeries,
  })
}

export function useRiskDistribution() {
  return useQuery({
    queryKey: queryKeys.analytics.riskDistribution,
    queryFn: getRiskDistribution,
  })
}

export function useCategoryBreakdown() {
  return useQuery({
    queryKey: queryKeys.analytics.categoryBreakdown,
    queryFn: getCategoryBreakdown,
  })
}

export function useAssetCategoryBreakdown() {
  return useQuery({
    queryKey: queryKeys.analytics.assetCategoryBreakdown,
    queryFn: getAssetCategoryBreakdown,
  })
}

export function useTopReporters(limit = 10) {
  return useQuery({
    queryKey: queryKeys.analytics.topReporters(limit),
    queryFn: () => getTopReporters(limit),
  })
}
