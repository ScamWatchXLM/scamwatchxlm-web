import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ReportStatus } from "@/types/domain"

const STATUS_STYLES: Record<ReportStatus, string> = {
  pending: "bg-muted text-muted-foreground border-border",
  approved:
    "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
  escalated: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
}

const STATUS_LABEL: Record<ReportStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  escalated: "Escalated",
}

export function ReportStatusBadge({
  status,
  className,
}: {
  status: ReportStatus
  className?: string
}) {
  return (
    <Badge variant="outline" className={cn(STATUS_STYLES[status], className)}>
      {STATUS_LABEL[status]}
    </Badge>
  )
}
