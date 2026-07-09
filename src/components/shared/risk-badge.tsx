import { cn } from "@/lib/utils"
import { RISK_LEVEL_LABEL } from "@/lib/utils/format"
import type { RiskLevel } from "@/types/domain"
import { AlertTriangle, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react"

const RISK_STYLES: Record<RiskLevel, string> = {
  low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:text-emerald-400",
  medium: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  high: "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400",
  critical: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
}

const RISK_ICONS: Record<RiskLevel, React.ComponentType<{ className?: string }>> = {
  low: ShieldCheck,
  medium: ShieldQuestion,
  high: ShieldAlert,
  critical: AlertTriangle,
}

interface RiskBadgeProps {
  level: RiskLevel
  score?: number
  showIcon?: boolean
  className?: string
}

export function RiskBadge({ level, score, showIcon = true, className }: RiskBadgeProps) {
  const Icon = RISK_ICONS[level]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        RISK_STYLES[level],
        className
      )}
    >
      {showIcon && <Icon className="size-3.5" aria-hidden />}
      {RISK_LEVEL_LABEL[level]}
      {typeof score === "number" && (
        <span className="opacity-70">· {Math.round(score)}</span>
      )}
    </span>
  )
}
