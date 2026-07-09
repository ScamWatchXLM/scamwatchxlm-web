"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
import { formatCompactNumber } from "@/lib/utils/format"

export interface HorizontalBarDatum {
  label: string
  value: number
  color: string
}

interface HorizontalBarChartProps {
  title: string
  description?: string
  data?: HorizontalBarDatum[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  height?: number
}

export function HorizontalBarChart({
  title,
  description,
  data,
  isLoading,
  isError,
  onRetry,
  height = 280,
}: HorizontalBarChartProps) {
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
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 24, left: 8, bottom: 0 }}
              barCategoryGap={10}
            >
              <CartesianGrid horizontal={false} stroke="var(--border)" />
              <XAxis
                type="number"
                tickFormatter={(v: number) => formatCompactNumber(v)}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fill: "var(--foreground)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={120}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const datum = payload[0].payload as HorizontalBarDatum
                  return (
                    <div className="bg-popover rounded-md border px-3 py-2 text-xs shadow-md">
                      <p className="text-popover-foreground font-medium">{datum.label}</p>
                      <p className="text-muted-foreground">
                        {formatCompactNumber(Number(datum.value))}
                      </p>
                    </div>
                  )
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={20}>
                {data.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
