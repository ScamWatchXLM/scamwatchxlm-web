import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { NetworkStatsGrid } from "@/components/dashboard/network-stats-grid"
import { RecentAlertsCard } from "@/components/dashboard/recent-alerts-card"
import { TrendingScamsCard } from "@/components/dashboard/trending-scams-card"
import { LatestReportsCard } from "@/components/dashboard/latest-reports-card"
import { TopAssetsCard } from "@/components/dashboard/top-assets-card"
import { TopIssuersCard } from "@/components/dashboard/top-issuers-card"
import { RiskDistributionCard } from "@/components/dashboard/risk-distribution-card"
import { NetworkActivityChartCard } from "@/components/dashboard/network-activity-chart-card"
import { MapPlaceholder } from "@/components/shared/map-placeholder"

export const metadata: Metadata = { title: "Dashboard" }

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Real-time overview of scam activity across the Stellar network."
      />

      <NetworkStatsGrid />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <NetworkActivityChartCard />
        </div>
        <RiskDistributionCard />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RecentAlertsCard />
        <TrendingScamsCard />
        <LatestReportsCard />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TopAssetsCard />
        <TopIssuersCard />
      </div>

      <MapPlaceholder />
    </div>
  )
}
