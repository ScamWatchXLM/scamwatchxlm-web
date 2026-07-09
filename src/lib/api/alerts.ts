import { apiFetch, mockDelay } from "./client"
import { isMockMode } from "@/config/env"
import { mockAlerts } from "@/mocks/db"
import { paginate } from "@/mocks/generators"
import type { Alert, AlertSeverity, Paginated } from "@/types/domain"

export interface ListAlertsParams {
  page?: number
  pageSize?: number
  severity?: AlertSeverity
  unacknowledgedOnly?: boolean
}

export async function getAlerts(
  params: ListAlertsParams = {}
): Promise<Paginated<Alert>> {
  const { page = 1, pageSize = 20, severity, unacknowledgedOnly } = params

  if (isMockMode) {
    await mockDelay(180)
    let items = [...mockAlerts]
    if (severity) items = items.filter((a) => a.severity === severity)
    if (unacknowledgedOnly) items = items.filter((a) => !a.acknowledged)
    return paginate(items, page, pageSize)
  }

  return apiFetch<Paginated<Alert>>("/alerts", {
    params: { page, pageSize, severity, unacknowledgedOnly },
  })
}

export async function getRecentAlerts(limit = 8): Promise<Alert[]> {
  if (isMockMode) {
    await mockDelay(150)
    return mockAlerts.slice(0, limit)
  }
  return apiFetch<Alert[]>("/alerts/recent", { params: { limit } })
}
