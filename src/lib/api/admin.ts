import { apiFetch, mockDelay } from "./client"
import { isMockMode } from "@/config/env"
import { mockAdminLogs, mockAdminUsers, mockReports } from "@/mocks/db"
import { generateNetworkStats, paginate } from "@/mocks/generators"
import { getNetConfirmations } from "@/lib/reports"
import type {
  AdminLogEntry,
  AdminUser,
  NetworkStats,
  Paginated,
  ScamReport,
} from "@/types/domain"

export interface AdminDashboardMetrics {
  pendingReports: number
  approvedToday: number
  rejectedToday: number
  activeUsers: number
  suspendedUsers: number
}

export async function getAdminMetrics(): Promise<AdminDashboardMetrics> {
  if (isMockMode) {
    await mockDelay()
    return {
      pendingReports: mockReports.filter((r) => r.status === "pending").length,
      approvedToday: mockReports.filter((r) => r.status === "approved").length % 37,
      rejectedToday: mockReports.filter((r) => r.status === "rejected").length % 21,
      activeUsers: mockAdminUsers.filter((u) => u.status === "active").length,
      suspendedUsers: mockAdminUsers.filter((u) => u.status === "suspended").length,
    }
  }
  return apiFetch<AdminDashboardMetrics>("/admin/metrics")
}

export async function getAdminReportsQueue(
  params: { page?: number; pageSize?: number } = {}
): Promise<Paginated<ScamReport>> {
  const { page = 1, pageSize = 15 } = params
  if (isMockMode) {
    await mockDelay()
    // Surface the reports with the clearest community signal — strongly
    // confirmed or strongly disputed — first, so moderators triage the
    // easiest calls before the ambiguous, low-vote ones.
    const pending = mockReports
      .filter((r) => r.status === "pending")
      .sort((a, b) => Math.abs(getNetConfirmations(b)) - Math.abs(getNetConfirmations(a)))
    return paginate(pending, page, pageSize)
  }
  return apiFetch<Paginated<ScamReport>>("/admin/reports/queue", {
    params: { page, pageSize },
  })
}

export async function getAdminUsers(
  params: { page?: number; pageSize?: number } = {}
): Promise<Paginated<AdminUser>> {
  const { page = 1, pageSize = 15 } = params
  if (isMockMode) {
    await mockDelay()
    return paginate(mockAdminUsers, page, pageSize)
  }
  return apiFetch<Paginated<AdminUser>>("/admin/users", { params: { page, pageSize } })
}

export async function getAdminLogs(
  params: { page?: number; pageSize?: number } = {}
): Promise<Paginated<AdminLogEntry>> {
  const { page = 1, pageSize = 20 } = params
  if (isMockMode) {
    await mockDelay()
    return paginate(mockAdminLogs, page, pageSize)
  }
  return apiFetch<Paginated<AdminLogEntry>>("/admin/logs", { params: { page, pageSize } })
}

export async function getAdminNetworkStats(): Promise<NetworkStats> {
  if (isMockMode) {
    await mockDelay()
    return generateNetworkStats()
  }
  return apiFetch<NetworkStats>("/admin/network-stats")
}
