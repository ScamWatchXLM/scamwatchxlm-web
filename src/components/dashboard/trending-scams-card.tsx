"use client"

import { TrendingUp, TrendingDown, Flame } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import { getReports } from "@/lib/api/reports"

/**
 * "Trending scams" is derived from the reports feed grouped by category —
 * a dedicated `/stats/trending` endpoint is a natural extensibility point
 * once the backend can compute true 24h velocity server-side.
 */
export function TrendingScamsCard() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboard", "trending-scams"],
    queryFn: () => getReports({ pageSize: 100 }),
  })

  const trending = data
    ? Object.values(
        data.items.reduce<Record<string, { category: string; count: number }>>(
          (acc, report) => {
            acc[report.category] = acc[report.category] ?? {
              category: report.category,
              count: 0,
            }
            acc[report.category].count += 1
            return acc
          },
          {}
        )
      )
        .sort((a, b) => b.count - a.count)
        .slice(0, 6)
    : undefined

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="size-4 text-orange-500" /> Trending Scams
        </CardTitle>
        <CardDescription>Report categories gaining momentum</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        {isError && <ErrorState onRetry={refetch} className="border-none p-0" />}
        {trending?.length === 0 && <EmptyState title="No trending scams" />}
        {trending?.map((item, i) => (
          <div
            key={item.category}
            className="hover:bg-muted/60 flex items-center justify-between gap-3 rounded-md p-2"
          >
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="w-6 justify-center">
                {i + 1}
              </Badge>
              <span className="text-sm font-medium capitalize">
                {item.category.replace(/_/g, " ")}
              </span>
            </div>
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              {i < 2 ? (
                <TrendingUp className="size-3.5 text-red-500" />
              ) : (
                <TrendingDown className="text-muted-foreground size-3.5" />
              )}
              {item.count} reports
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
