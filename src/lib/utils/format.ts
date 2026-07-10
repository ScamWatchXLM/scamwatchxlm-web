import type { RiskLevel } from "@/types/domain"

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat("en-US", options).format(value)
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: value < 1 ? 4 : 2,
  }).format(value)
}

export function formatPercent(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 1,
    ...options,
  }).format(value / 100)
}

export function formatRelativeTime(iso: string): string {
  const date = new Date(iso)
  const diffMs = date.getTime() - Date.now()
  const diffSeconds = Math.round(diffMs / 1000)
  const absSeconds = Math.abs(diffSeconds)

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ]

  for (const [unit, secondsInUnit] of units) {
    if (absSeconds >= secondsInUnit || unit === "second") {
      const delta = Math.round(diffSeconds / secondsInUnit)
      return rtf.format(delta, unit)
    }
  }

  return rtf.format(0, "second")
}

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/**
 * Intl.DateTimeFormat throws if `dateStyle`/`timeStyle` are mixed with
 * component options (`month`, `day`, etc.) in the same options object, so
 * callers passing custom `options` fully opt out of the default style —
 * they must specify every component they want.
 *
 * Date-only strings (`YYYY-MM-DD`) are parsed as UTC midnight per the ISO-8601
 * spec, which rolls back to the previous calendar day once formatted in any
 * timezone west of UTC. Since a date-only value has no time component to
 * localize in the first place, parse it from its calendar components instead
 * of letting `new Date(iso)` treat it as an instant.
 */
export function formatDate(iso: string, options?: Intl.DateTimeFormatOptions): string {
  const date = DATE_ONLY_PATTERN.test(iso)
    ? new Date(`${iso}T00:00:00`)
    : new Date(iso)
  return new Intl.DateTimeFormat(
    "en-US",
    options ?? { dateStyle: "medium", timeStyle: "short" }
  ).format(date)
}

/** Shortens a Stellar public key / tx hash to `ABCD…WXYZ` form. */
export function truncateMiddle(value: string, prefixLen = 6, suffixLen = 6): string {
  if (value.length <= prefixLen + suffixLen + 1) return value
  return `${value.slice(0, prefixLen)}…${value.slice(-suffixLen)}`
}

export function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 85) return "critical"
  if (score >= 60) return "high"
  if (score >= 30) return "medium"
  return "low"
}

export const RISK_LEVEL_LABEL: Record<RiskLevel, string> = {
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk",
  critical: "Critical Risk",
}
