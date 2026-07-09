"use client"

import { Activity, FileWarning, ShieldAlert, Users } from "lucide-react"
import { StatCard } from "@/components/shared/stat-card"
import { useNetworkStats } from "@/hooks/use-stats"
import { formatCompactNumber } from "@/lib/utils/format"

export function NetworkStatsGrid() {
  const { data, isLoading } = useNetworkStats()

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Accounts Monitored"
        value={data ? formatCompactNumber(data.totalAccountsMonitored) : "—"}
        icon={Users}
        loading={isLoading}
      />
      <StatCard
        label="Reports Filed"
        value={data ? formatCompactNumber(data.totalReports) : "—"}
        icon={FileWarning}
        loading={isLoading}
      />
      <StatCard
        label="Alerts (24h)"
        value={data ? formatCompactNumber(data.totalAlerts24h) : "—"}
        icon={ShieldAlert}
        loading={isLoading}
      />
      <StatCard
        label="Active Investigations"
        value={data ? formatCompactNumber(data.activeInvestigations) : "—"}
        icon={Activity}
        loading={isLoading}
      />
    </div>
  )
}
