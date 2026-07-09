"use client"

import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RiskBadge } from "@/components/shared/risk-badge"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { useMostTargetedIssuers } from "@/hooks/use-stats"
import { truncateMiddle } from "@/lib/utils/format"

export function TopIssuersCard() {
  const { data: issuers, isLoading, isError, refetch } = useMostTargetedIssuers(6)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Targeted Issuers</CardTitle>
        <CardDescription>Ranked by community report volume</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        {isError && <ErrorState onRetry={refetch} className="border-none p-0" />}
        {issuers?.length === 0 && <EmptyState title="No flagged issuers" />}
        {issuers?.map((issuer) => (
          <Link
            key={issuer.id}
            href={`/issuers/${issuer.id}`}
            className="hover:bg-muted/60 flex items-center justify-between gap-3 rounded-md p-2"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {issuer.name ?? truncateMiddle(issuer.id)}
              </p>
              <p className="text-muted-foreground truncate text-xs">
                {issuer.reportCount} reports
              </p>
            </div>
            <RiskBadge
              level={issuer.riskScore.level}
              score={issuer.riskScore.value}
              showIcon={false}
            />
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
