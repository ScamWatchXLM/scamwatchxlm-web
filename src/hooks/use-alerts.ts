import { useQuery } from "@tanstack/react-query"
import { getAlerts, getRecentAlerts, type ListAlertsParams } from "@/lib/api/alerts"
import { queryKeys } from "@/lib/api/query-keys"

export function useAlerts(params: ListAlertsParams = {}) {
  return useQuery({
    queryKey: queryKeys.alerts.list(params),
    queryFn: () => getAlerts(params),
    placeholderData: (previous) => previous,
  })
}

export function useRecentAlerts(limit = 8) {
  return useQuery({
    queryKey: queryKeys.alerts.recent(limit),
    queryFn: () => getRecentAlerts(limit),
  })
}
