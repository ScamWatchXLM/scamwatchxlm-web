"use client"

import { use } from "react"
import Link from "next/link"
import { BadgeCheck } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { RiskFactorList } from "@/components/shared/risk-factor-list"
import { TimelineList } from "@/components/shared/timeline-list"
import { RelatedReportsList } from "@/components/shared/related-reports-list"
import { CopyableAddress } from "@/components/shared/copyable-address"
import { RiskBadge } from "@/components/shared/risk-badge"
import { EmptyState } from "@/components/shared/empty-state"
import { DetailSkeleton } from "@/components/shared/loading-skeletons"
import { ErrorState } from "@/components/shared/error-state"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useIssuer, useIssuerAssets, useIssuerTimeline } from "@/hooks/use-issuers"
import { useRelatedReports } from "@/hooks/use-reports"
import { formatCompactNumber, formatDate, truncateMiddle } from "@/lib/utils/format"

export default function IssuerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: issuer, isLoading, isError, refetch } = useIssuer(id)
  const assets = useIssuerAssets(issuer)
  const timeline = useIssuerTimeline(id)
  const relatedReports = useRelatedReports(id, "issuer", issuer?.name ?? id)

  if (isLoading) return <DetailSkeleton />
  if (isError || !issuer) return <ErrorState onRetry={refetch} />

  return (
    <div className="space-y-6">
      <PageHeader
        title={issuer.name ?? truncateMiddle(issuer.id, 8, 8)}
        description={<CopyableAddress value={issuer.id} prefixLen={10} suffixLen={10} />}
        actions={
          <div className="flex items-center gap-2">
            {issuer.verified && (
              <Badge
                variant="outline"
                className="gap-1 text-emerald-600 dark:text-emerald-400"
              >
                <BadgeCheck className="size-3.5" /> Verified
              </Badge>
            )}
            <Button size="sm" asChild>
              <Link href={`/reports/new?targetKind=issuer&targetId=${issuer.id}`}>
                Report this issuer
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Assets Issued" value={String(issuer.issuedAssets.length)} />
        <StatCard label="Trustlines" value={formatCompactNumber(issuer.trustlineCount)} />
        <StatCard label="Reports Filed" value={String(issuer.reportCount)} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Tabs defaultValue="assets">
            <TabsList>
              <TabsTrigger value="assets">Issued Assets</TabsTrigger>
              <TabsTrigger value="timeline">Risk History</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="assets" className="mt-4 space-y-2">
              {assets.isLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              {!assets.isLoading && assets.data?.length === 0 && (
                <EmptyState title="No assets issued" />
              )}
              {assets.data?.map((asset) => (
                <Link
                  key={asset.id}
                  href={`/assets/${asset.id}`}
                  className="hover:bg-muted/50 flex items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{asset.code}</p>
                    <p className="text-muted-foreground text-xs">
                      {formatCompactNumber(asset.holderCount)} holders
                    </p>
                  </div>
                  <RiskBadge level={asset.riskScore.level} showIcon={false} />
                </Link>
              ))}
            </TabsContent>
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
          <RiskFactorList riskScore={issuer.riskScore} />
          <p className="text-muted-foreground text-center text-xs">
            Issuer created {formatDate(issuer.createdAt)}
          </p>
        </div>
      </div>
    </div>
  )
}
