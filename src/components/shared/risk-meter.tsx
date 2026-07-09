import { cn } from "@/lib/utils"
import { riskLevelFromScore } from "@/lib/utils/format"

const BAR_COLOR: Record<string, string> = {
  low: "bg-emerald-500",
  medium: "bg-amber-500",
  high: "bg-orange-500",
  critical: "bg-red-500",
}

interface RiskMeterProps {
  value: number
  className?: string
  showLabel?: boolean
}

export function RiskMeter({ value, className, showLabel = true }: RiskMeterProps) {
  const level = riskLevelFromScore(value)

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
        <div
          className={cn("h-full rounded-full transition-all", BAR_COLOR[level])}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showLabel && (
        <span className="w-9 shrink-0 text-right text-sm font-medium tabular-nums">
          {Math.round(value)}
        </span>
      )}
    </div>
  )
}
