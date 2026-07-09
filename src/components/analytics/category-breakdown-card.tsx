"use client"

import {
  HorizontalBarChart,
  type HorizontalBarDatum,
} from "@/components/charts/horizontal-bar-chart"
import { useChartPalette } from "@/lib/chart-colors"

function formatCategoryLabel(value: string): string {
  return value
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ")
}

interface CategoryBreakdownCardProps {
  title: string
  description?: string
  data?: { category: string; count: number }[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function CategoryBreakdownCard({
  title,
  description,
  data,
  isLoading,
  isError,
  onRetry,
}: CategoryBreakdownCardProps) {
  const palette = useChartPalette()
  const sorted = data ? [...data].sort((a, b) => b.count - a.count) : undefined
  const chartData: HorizontalBarDatum[] | undefined = sorted?.map((d, i) => ({
    label: formatCategoryLabel(d.category),
    value: d.count,
    color: palette.categorical[i % palette.categorical.length],
  }))

  return (
    <HorizontalBarChart
      title={title}
      description={description}
      data={chartData}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      height={320}
    />
  )
}
