"use client"

import { useMemo, useState } from "react"
import { CheckCheck, Circle } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { SeverityBadge } from "@/components/shared/severity-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useLiveAlertStream } from "@/hooks/use-live-alert-stream"
import { useAlerts } from "@/hooks/use-alerts"
import { useAlertStreamStore } from "@/stores/alert-stream-store"
import { formatRelativeTime } from "@/lib/utils/format"
import { cn } from "@/lib/utils"
import type { Alert, AlertSeverity } from "@/types/domain"
import Link from "next/link"

const ENTITY_HREF: Record<Alert["entityKind"], string> = {
  account: "/accounts",
  asset: "/assets",
  issuer: "/issuers",
  transaction: "/transactions",
}

export default function AlertsPage() {
  const { liveAlerts, status } = useLiveAlertStream()
  const acknowledge = useAlertStreamStore((s) => s.acknowledge)
  const { data, isLoading } = useAlerts({ pageSize: 30 })
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | "all">("all")
  const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string>>(new Set())

  function handleAcknowledge(id: string) {
    acknowledge(id)
    setAcknowledgedIds((prev) => new Set(prev).add(id))
  }

  const merged = useMemo(() => {
    const seen = new Set<string>()
    const combined: Alert[] = []
    for (const alert of [...liveAlerts, ...(data?.items ?? [])]) {
      if (seen.has(alert.id)) continue
      seen.add(alert.id)
      combined.push(alert)
    }
    return combined
      .filter((a) => severityFilter === "all" || a.severity === severityFilter)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [liveAlerts, data, severityFilter])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Alerts"
        description="Real-time detections streamed from the monitoring pipeline."
        actions={
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <Circle
              className={cn(
                "size-2 fill-current",
                status === "open"
                  ? "text-emerald-500"
                  : status === "connecting"
                    ? "text-amber-500"
                    : "text-red-500"
              )}
            />
            {status === "open"
              ? "Live"
              : status === "connecting"
                ? "Connecting…"
                : "Disconnected"}
          </div>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select
          value={severityFilter}
          onValueChange={(v) => setSeverityFilter(v as AlertSeverity | "all")}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All severities</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="danger">Danger</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="divide-y p-0">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4">
                <Skeleton className="h-14 w-full" />
              </div>
            ))}

          {!isLoading && merged.length === 0 && (
            <div className="p-6">
              <EmptyState title="No alerts match this filter" />
            </div>
          )}

          {merged.map((alert) => (
            <div key={alert.id} className="flex items-start gap-4 p-4">
              <SeverityBadge severity={alert.severity} className="mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">{alert.title}</p>
                  <span className="text-muted-foreground shrink-0 text-xs">
                    {formatRelativeTime(alert.createdAt)}
                  </span>
                </div>
                <p className="text-muted-foreground mt-0.5 text-sm">
                  {alert.description}
                </p>
                <Link
                  href={`${ENTITY_HREF[alert.entityKind]}/${alert.entityId}`}
                  className="text-primary mt-1 inline-block text-xs hover:underline"
                >
                  {alert.entityLabel} · {alert.entityKind}
                </Link>
              </div>
              {!alert.acknowledged && !acknowledgedIds.has(alert.id) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAcknowledge(alert.id)}
                  className="shrink-0"
                >
                  <CheckCheck className="size-3.5" /> Acknowledge
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
