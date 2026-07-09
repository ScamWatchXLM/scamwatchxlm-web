"use client"

import { TrendAreaChart } from "@/components/charts/trend-area-chart"
import { useNetworkActivitySeries } from "@/hooks/use-analytics"

export function NetworkActivityChartCard() {
  const { data, isLoading, isError, refetch } = useNetworkActivitySeries()

  return (
    <TrendAreaChart
      title="Network Activity"
      description="Daily transaction volume across monitored accounts"
      data={data}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      valueLabel="Transactions"
    />
  )
}
