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
import { ReportStatusBadge } from "@/components/shared/report-status-badge"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { formatRelativeTime } from "@/lib/utils/format"
import { useLatestReports } from "@/hooks/use-stats"

export function LatestReportsCard() {
  const { data: reports, isLoading, isError, refetch } = useLatestReports(6)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Reports</CardTitle>
        <CardDescription>Most recent community submissions</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/reports">View all</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-1">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        {isError && <ErrorState onRetry={refetch} className="border-none p-0" />}
        {reports?.length === 0 && <EmptyState title="No reports yet" />}
        {reports?.map((report) => (
          <Link
            key={report.id}
            href={`/reports/${report.id}`}
            className="hover:bg-muted/60 flex items-start justify-between gap-3 rounded-md p-2"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{report.title}</p>
              <p className="text-muted-foreground truncate text-xs">
                {report.targetLabel} · {formatRelativeTime(report.createdAt)}
              </p>
            </div>
            <ReportStatusBadge status={report.status} />
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
