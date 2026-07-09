"use client"

import { PageHeader } from "@/components/shared/page-header"
import { TrendAreaChart } from "@/components/charts/trend-area-chart"
import { CategoryBreakdownCard } from "@/components/analytics/category-breakdown-card"
import { TopReportersCard } from "@/components/analytics/top-reporters-card"
import { RiskDistributionCard } from "@/components/dashboard/risk-distribution-card"
import {
  useAssetCategoryBreakdown,
  useCategoryBreakdown,
  useDailyAlertsSeries,
  useNetworkActivitySeries,
  useScamTrendSeries,
} from "@/hooks/use-analytics"

export default function AnalyticsPage() {
  const scamTrend = useScamTrendSeries()
  const dailyAlerts = useDailyAlertsSeries()
  const networkActivity = useNetworkActivitySeries()
  const categoryBreakdown = useCategoryBreakdown()
  const assetCategoryBreakdown = useAssetCategoryBreakdown()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Network-wide trends across scams, alerts, risk, and reporting activity."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TrendAreaChart
          title="Scam Trend"
          description="New confirmed scams per day"
          data={scamTrend.data}
          isLoading={scamTrend.isLoading}
          isError={scamTrend.isError}
          onRetry={scamTrend.refetch}
          valueLabel="Scams"
        />
        <TrendAreaChart
          title="Daily Alerts"
          description="Automated detections per day"
          data={dailyAlerts.data}
          isLoading={dailyAlerts.isLoading}
          isError={dailyAlerts.isError}
          onRetry={dailyAlerts.refetch}
          valueLabel="Alerts"
        />
      </div>

      <TrendAreaChart
        title="Network Activity"
        description="Total daily transaction volume across monitored accounts"
        data={networkActivity.data}
        isLoading={networkActivity.isLoading}
        isError={networkActivity.isError}
        onRetry={networkActivity.refetch}
        valueLabel="Transactions"
        height={300}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RiskDistributionCard />
        <CategoryBreakdownCard
          title="Report Categories"
          description="Community reports grouped by scam type"
          data={categoryBreakdown.data?.map((d) => ({
            category: d.category,
            count: d.count,
          }))}
          isLoading={categoryBreakdown.isLoading}
          isError={categoryBreakdown.isError}
          onRetry={categoryBreakdown.refetch}
        />
      </div>

      <CategoryBreakdownCard
        title="Asset Categories"
        description="Tracked assets grouped by category"
        data={assetCategoryBreakdown.data}
        isLoading={assetCategoryBreakdown.isLoading}
        isError={assetCategoryBreakdown.isError}
        onRetry={assetCategoryBreakdown.refetch}
      />

      <TopReportersCard />
    </div>
  )
}
