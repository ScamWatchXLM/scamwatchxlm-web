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
import { useMostTargetedAssets } from "@/hooks/use-stats"
import { formatCompactNumber } from "@/lib/utils/format"

export function TopAssetsCard() {
  const { data: assets, isLoading, isError, refetch } = useMostTargetedAssets(6)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Targeted Assets</CardTitle>
        <CardDescription>Highest risk score right now</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        {isError && <ErrorState onRetry={refetch} className="border-none p-0" />}
        {assets?.length === 0 && <EmptyState title="No flagged assets" />}
        {assets?.map((asset) => (
          <Link
            key={asset.id}
            href={`/assets/${asset.id}`}
            className="hover:bg-muted/60 flex items-center justify-between gap-3 rounded-md p-2"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{asset.code}</p>
              <p className="text-muted-foreground truncate text-xs">
                {formatCompactNumber(asset.holderCount)} holders
              </p>
            </div>
            <RiskBadge
              level={asset.riskScore.level}
              score={asset.riskScore.value}
              showIcon={false}
            />
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
