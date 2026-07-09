"use client"

import {
  HorizontalBarChart,
  type HorizontalBarDatum,
} from "@/components/charts/horizontal-bar-chart"
import { useRiskDistribution } from "@/hooks/use-analytics"
import { useChartPalette } from "@/lib/chart-colors"
import { RISK_LEVEL_LABEL } from "@/lib/utils/format"
import type { RiskLevel } from "@/types/domain"

export function RiskDistributionCard() {
  const { data, isLoading, isError, refetch } = useRiskDistribution()
  const palette = useChartPalette()

  const statusColor: Record<RiskLevel, string> = {
    low: palette.status.good,
    medium: palette.status.warning,
    high: palette.status.serious,
    critical: palette.status.critical,
  }

  const chartData: HorizontalBarDatum[] | undefined = data?.map((d) => ({
    label: RISK_LEVEL_LABEL[d.level as RiskLevel],
    value: d.count,
    color: statusColor[d.level as RiskLevel],
  }))

  return (
    <HorizontalBarChart
      title="Risk Score Distribution"
      description="Monitored entities grouped by current risk level"
      data={chartData}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      height={220}
    />
  )
}
