"use client"

import { useNetworkStats } from "@/hooks/use-stats"
import { formatCompactNumber } from "@/lib/utils/format"
import { Skeleton } from "@/components/ui/skeleton"

export function HeroStats() {
  const { data, isLoading } = useNetworkStats()

  const stats = [
    { label: "Accounts monitored", value: data?.totalAccountsMonitored },
    { label: "Assets tracked", value: data?.totalAssetsTracked },
    { label: "Community reports", value: data?.totalReports },
    { label: "Alerts (24h)", value: data?.totalAlerts24h },
  ]

  return (
    <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <dt className="text-muted-foreground text-sm">{stat.label}</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
            {isLoading || stat.value === undefined ? (
              <Skeleton className="mx-auto h-9 w-20" />
            ) : (
              formatCompactNumber(stat.value)
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}
