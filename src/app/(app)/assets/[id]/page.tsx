"use client"

import { use } from "react"
import Link from "next/link"
import { BadgeCheck, Building2 } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { RiskFactorList } from "@/components/shared/risk-factor-list"
import { TimelineList } from "@/components/shared/timeline-list"
import { RelatedReportsList } from "@/components/shared/related-reports-list"
import { CopyableAddress } from "@/components/shared/copyable-address"
import { DetailSkeleton } from "@/components/shared/loading-skeletons"
import { ErrorState } from "@/components/shared/error-state"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAsset, useAssetTimeline } from "@/hooks/use-assets"
import { useRelatedReports } from "@/hooks/use-reports"
import { formatCompactNumber, formatCurrency, formatDate } from "@/lib/utils/format"

export default function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: asset, isLoading, isError, refetch } = useAsset(id)
  const timeline = useAssetTimeline(id)
  const relatedReports = useRelatedReports(id, "asset", asset?.code ?? id)

  if (isLoading) return <DetailSkeleton />
  if (isError || !asset) return <ErrorState onRetry={refetch} />

  return (
    <div className="space-y-6">
      <PageHeader
        title={asset.code}
        description="Stellar asset overview and risk assessment"
        actions={
          <div className="flex items-center gap-2">
            {asset.verified && (
              <Badge
                variant="outline"
                className="gap-1 text-emerald-600 dark:text-emerald-400"
              >
                <BadgeCheck className="size-3.5" /> Verified
              </Badge>
            )}
            {asset.flagged && <Badge variant="destructive">Flagged</Badge>}
            <Button size="sm" asChild>
              <Link href={`/reports/new?targetKind=asset&targetId=${asset.id}`}>
                Report this asset
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Holders" value={formatCompactNumber(asset.holderCount)} />
        <StatCard label="Trustlines" value={formatCompactNumber(asset.trustlineCount)} />
        <StatCard label="24h Volume" value={formatCurrency(asset.volume24h)} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Issuer</CardTitle>
              <CardDescription>Issuing account details</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                  <Building2 className="text-muted-foreground size-5" />
                </div>
                <div>
                  <p className="font-medium">{asset.issuerName ?? "Unlabeled issuer"}</p>
                  <CopyableAddress
                    value={asset.issuer}
                    href={`/issuers/${asset.issuer}`}
                    className="text-muted-foreground"
                  />
                </div>
              </div>
              {asset.domain && (
                <span className="text-muted-foreground text-sm">{asset.domain}</span>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trustline Statistics</CardTitle>
              <CardDescription>
                Asset created {formatDate(asset.createdAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-muted-foreground text-xs">Total trustlines</p>
                <p className="text-lg font-semibold tabular-nums">
                  {formatCompactNumber(asset.trustlineCount)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Active holders</p>
                <p className="text-lg font-semibold tabular-nums">
                  {formatCompactNumber(asset.holderCount)}
                </p>
              </div>
              {asset.marketCapEstimate && (
                <div>
                  <p className="text-muted-foreground text-xs">Est. market cap</p>
                  <p className="text-lg font-semibold tabular-nums">
                    {formatCurrency(asset.marketCapEstimate)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="timeline">
            <TabsList>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline" className="mt-4">
              <TimelineList
                events={timeline.data}
                isLoading={timeline.isLoading}
                isError={timeline.isError}
                onRetry={timeline.refetch}
              />
            </TabsContent>
            <TabsContent value="reports" className="mt-4">
              <RelatedReportsList
                reports={relatedReports.data}
                isLoading={relatedReports.isLoading}
                isError={relatedReports.isError}
                onRetry={relatedReports.refetch}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <RiskFactorList riskScore={asset.riskScore} />
        </div>
      </div>
    </div>
  )
}
