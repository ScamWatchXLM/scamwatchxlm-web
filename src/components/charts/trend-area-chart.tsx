"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartSkeleton } from "@/components/shared/loading-skeletons"
import { ErrorState } from "@/components/shared/error-state"
import { formatCompactNumber, formatDate } from "@/lib/utils/format"
import { useChartPalette } from "@/lib/chart-colors"
import type { AnalyticsSeriesPoint } from "@/types/domain"

interface TrendAreaChartProps {
  title: string
  description?: string
  data?: AnalyticsSeriesPoint[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  valueLabel?: string
  height?: number
}

export function TrendAreaChart({
  title,
  description,
  data,
  isLoading,
  isError,
  onRetry,
  valueLabel = "Value",
  height = 260,
}: TrendAreaChartProps) {
  const palette = useChartPalette()
  const lineColor = palette.categorical[0]

  if (isLoading) return <ChartSkeleton height={height} />

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {isError || !data ? (
          <ErrorState onRetry={onRetry} className="border-none p-0" />
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={lineColor} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={lineColor} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="var(--border)"
                strokeDasharray="0"
              />
              <XAxis
                dataKey="date"
                tickFormatter={(value: string) =>
                  formatDate(value, { month: "short", day: "numeric" })
                }
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
                minTickGap={32}
              />
              <YAxis
                tickFormatter={(value: number) => formatCompactNumber(value)}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  return (
                    <div className="bg-popover rounded-md border px-3 py-2 text-xs shadow-md">
                      <p className="text-popover-foreground mb-1 font-medium">
                        {formatDate(String(label), {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-muted-foreground">
                        {valueLabel}:{" "}
                        <span className="text-popover-foreground font-medium">
                          {formatCompactNumber(Number(payload[0].value))}
                        </span>
                      </p>
                    </div>
                  )
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={lineColor}
                strokeWidth={2}
                fill="url(#trendFill)"
                activeDot={{
                  r: 4,
                  fill: lineColor,
                  stroke: palette.surfaceRing,
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
