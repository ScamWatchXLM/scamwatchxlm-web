"use client"

import Link from "next/link"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SeverityBadge } from "@/components/shared/severity-badge"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { formatRelativeTime } from "@/lib/utils/format"
import { useRecentAlerts } from "@/hooks/use-alerts"
import { Bell } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function RecentAlertsCard() {
  const { data: alerts, isLoading, isError, refetch } = useRecentAlerts(6)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
        <CardDescription>Latest automated detections across the network</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/alerts">View all</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-1">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        {isError && <ErrorState onRetry={refetch} className="border-none p-0" />}
        {!isLoading && !isError && alerts?.length === 0 && (
          <EmptyState
            icon={Bell}
            title="No recent alerts"
            description="The network is quiet right now."
          />
        )}
        {alerts?.map((alert) => (
          <div
            key={alert.id}
            className="hover:bg-muted/60 flex items-start gap-3 rounded-md p-2"
          >
            <div className="mt-0.5">
              <SeverityBadge severity={alert.severity} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{alert.title}</p>
              <p className="text-muted-foreground truncate text-xs">
                {alert.entityLabel}
              </p>
            </div>
            <span className="text-muted-foreground shrink-0 text-xs">
              {formatRelativeTime(alert.createdAt)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
