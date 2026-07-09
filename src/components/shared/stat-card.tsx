import type { LucideIcon } from "lucide-react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string
  icon?: LucideIcon
  delta?: number
  deltaLabel?: string
  loading?: boolean
  className?: string
}

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaLabel,
  loading,
  className,
}: StatCardProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32" />
        </CardContent>
      </Card>
    )
  }

  const isPositive = (delta ?? 0) >= 0

  return (
    <Card className={cn("gap-2", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {label}
        </CardTitle>
        {Icon && <Icon className="text-muted-foreground size-4" aria-hidden />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
        {typeof delta === "number" && (
          <div
            className={cn(
              "mt-1 flex items-center gap-1 text-xs font-medium",
              isPositive ? "text-emerald-500" : "text-red-500"
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="size-3.5" />
            ) : (
              <ArrowDownRight className="size-3.5" />
            )}
            <span>{Math.abs(delta).toFixed(1)}%</span>
            {deltaLabel && (
              <span className="text-muted-foreground font-normal">{deltaLabel}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
