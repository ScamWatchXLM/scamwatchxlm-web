import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { AlertSeverity } from "@/types/domain"

const SEVERITY_STYLES: Record<AlertSeverity, string> = {
  info: "bg-sky-500/10 text-sky-600 border-sky-500/20 dark:text-sky-400",
  warning: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  danger: "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400",
  critical: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
}

const SEVERITY_LABEL: Record<AlertSeverity, string> = {
  info: "Info",
  warning: "Warning",
  danger: "Danger",
  critical: "Critical",
}

export function SeverityBadge({
  severity,
  className,
}: {
  severity: AlertSeverity
  className?: string
}) {
  return (
    <Badge variant="outline" className={cn(SEVERITY_STYLES[severity], className)}>
      {SEVERITY_LABEL[severity]}
    </Badge>
  )
}
