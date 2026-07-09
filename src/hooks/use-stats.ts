import { useQuery } from "@tanstack/react-query"
import {
  getLatestReports,
  getMostTargetedAssets,
  getMostTargetedIssuers,
  getNetworkStats,
} from "@/lib/api/stats"
import { queryKeys } from "@/lib/api/query-keys"

export function useNetworkStats() {
  return useQuery({ queryKey: queryKeys.stats.network, queryFn: getNetworkStats })
}

export function useMostTargetedAssets(limit = 6) {
  return useQuery({
    queryKey: queryKeys.stats.topAssets(limit),
    queryFn: () => getMostTargetedAssets(limit),
  })
}

export function useMostTargetedIssuers(limit = 6) {
  return useQuery({
    queryKey: queryKeys.stats.topIssuers(limit),
    queryFn: () => getMostTargetedIssuers(limit),
  })
}

export function useLatestReports(limit = 6) {
  return useQuery({
    queryKey: queryKeys.stats.latestReports(limit),
    queryFn: () => getLatestReports(limit),
  })
}
