import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils/format"
import type { TimelineEvent } from "@/types/domain"

const SEVERITY_DOT: Record<string, string> = {
  info: "bg-sky-500",
  warning: "bg-amber-500",
  danger: "bg-orange-500",
  critical: "bg-red-500",
}

interface TimelineListProps {
  events?: TimelineEvent[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function TimelineList({ events, isLoading, isError, onRetry }: TimelineListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (isError) return <ErrorState onRetry={onRetry} />
  if (!events || events.length === 0)
    return (
      <EmptyState title="No history yet" description="No timeline events recorded." />
    )

  return (
    <ol className="relative space-y-6 border-l pl-6">
      {events.map((event) => (
        <li key={event.id} className="relative">
          <span
            className={cn(
              "ring-background absolute top-1.5 -left-[29px] size-3 rounded-full ring-4",
              event.severity ? SEVERITY_DOT[event.severity] : "bg-muted-foreground"
            )}
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">{event.title}</p>
            <span className="text-muted-foreground shrink-0 text-xs">
              {formatDate(event.timestamp)}
            </span>
          </div>
          <p className="text-muted-foreground mt-0.5 text-sm">{event.description}</p>
        </li>
      ))}
    </ol>
  )
}
