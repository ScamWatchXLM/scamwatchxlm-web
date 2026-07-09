import { useQuery } from "@tanstack/react-query"
import {
  getAdminLogs,
  getAdminMetrics,
  getAdminNetworkStats,
  getAdminReportsQueue,
  getAdminUsers,
} from "@/lib/api/admin"
import { queryKeys } from "@/lib/api/query-keys"

export function useAdminMetrics() {
  return useQuery({ queryKey: queryKeys.admin.metrics, queryFn: getAdminMetrics })
}

export function useAdminReportsQueue(params: { page?: number; pageSize?: number } = {}) {
  return useQuery({
    queryKey: queryKeys.admin.reportsQueue(params),
    queryFn: () => getAdminReportsQueue(params),
    placeholderData: (previous) => previous,
  })
}

export function useAdminUsers(params: { page?: number; pageSize?: number } = {}) {
  return useQuery({
    queryKey: queryKeys.admin.users(params),
    queryFn: () => getAdminUsers(params),
    placeholderData: (previous) => previous,
  })
}

export function useAdminLogs(params: { page?: number; pageSize?: number } = {}) {
  return useQuery({
    queryKey: queryKeys.admin.logs(params),
    queryFn: () => getAdminLogs(params),
    placeholderData: (previous) => previous,
  })
}

export function useAdminNetworkStats() {
  return useQuery({
    queryKey: queryKeys.admin.networkStats,
    queryFn: getAdminNetworkStats,
  })
}
