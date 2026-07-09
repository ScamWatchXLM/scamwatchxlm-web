"use client"

import { use } from "react"
import Link from "next/link"
import { ArrowUpRight, ImageOff, ThumbsUp } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { ReportStatusBadge } from "@/components/shared/report-status-badge"
import { SeverityBadge } from "@/components/shared/severity-badge"
import { CopyableAddress } from "@/components/shared/copyable-address"
import { DetailSkeleton } from "@/components/shared/loading-skeletons"
import { ErrorState } from "@/components/shared/error-state"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useReport } from "@/hooks/use-reports"
import { formatDate } from "@/lib/utils/format"

const ENTITY_HREF: Record<string, string> = {
  account: "/accounts",
  asset: "/assets",
  issuer: "/issuers",
  transaction: "/transactions",
}

export default function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: report, isLoading, isError, refetch } = useReport(id)

  if (isLoading) return <DetailSkeleton />
  if (isError || !report) return <ErrorState onRetry={refetch} />

  return (
    <div className="space-y-6">
      <PageHeader
        title={report.title}
        description={`Filed by ${report.reporterHandle} · ${formatDate(report.createdAt)}`}
        actions={
          <div className="flex items-center gap-2">
            <SeverityBadge severity={report.severity} />
            <ReportStatusBadge status={report.status} />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {report.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evidence</CardTitle>
            </CardHeader>
            <CardContent>
              {report.evidenceUrls.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-8 text-center">
                  <ImageOff className="text-muted-foreground size-6" />
                  <p className="text-muted-foreground text-sm">
                    No evidence attached to this report.
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {report.evidenceUrls.map((url) => (
                    <li key={url}>
                      <Link
                        href={url}
                        className="text-primary flex items-center gap-1.5 text-sm hover:underline"
                      >
                        {url} <ArrowUpRight className="size-3.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {report.reviewerNote && (
            <Card>
              <CardHeader>
                <CardTitle>Reviewer Note</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {report.reviewerNote}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Report ID</span>
                <span className="font-mono">{report.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="capitalize">{report.category.replace(/_/g, " ")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Target</span>
                <Link
                  href={`${ENTITY_HREF[report.targetKind]}/${report.targetId}`}
                  className="text-primary hover:underline"
                >
                  {report.targetLabel}
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Target Address</span>
                <CopyableAddress value={report.targetId} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{formatDate(report.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full">
            <ThumbsUp className="size-4" /> Upvote ({report.upvotes})
          </Button>
        </div>
      </div>
    </div>
  )
}
