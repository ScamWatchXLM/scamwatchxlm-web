import Link from "next/link"
import { BadgeCheck } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { ReportStatusBadge } from "@/components/shared/report-status-badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getNetConfirmations, isCommunityVerified } from "@/lib/reports"
import { formatRelativeTime } from "@/lib/utils/format"
import type { ScamReport } from "@/types/domain"

interface RelatedReportsListProps {
  reports?: ScamReport[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function RelatedReportsList({
  reports,
  isLoading,
  isError,
  onRetry,
}: RelatedReportsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (isError) return <ErrorState onRetry={onRetry} />
  if (!reports || reports.length === 0) {
    return (
      <EmptyState
        title="No reports filed"
        description="No community reports reference this entity yet."
      />
    )
  }

  return (
    <div className="space-y-2">
      {reports.map((report) => (
        <Link
          key={report.id}
          href={`/reports/${report.id}`}
          className="hover:bg-muted/50 flex items-start justify-between gap-3 rounded-lg border p-3"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{report.title}</p>
            <p className="text-muted-foreground text-xs">
              {report.reporterHandle} · {formatRelativeTime(report.createdAt)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {isCommunityVerified(report) && (
              <BadgeCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            )}
            <span className="text-muted-foreground text-xs tabular-nums">
              {getNetConfirmations(report)}
            </span>
            <ReportStatusBadge status={report.status} />
          </div>
        </Link>
      ))}
    </div>
  )
}
