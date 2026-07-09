"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/shared/error-state"
import { useTopReporters } from "@/hooks/use-analytics"
import { formatPercent } from "@/lib/utils/format"

export function TopReportersCard() {
  const { data, isLoading, isError, refetch } = useTopReporters(10)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Reporters</CardTitle>
        <CardDescription>Ranked by report volume and accuracy</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        )}
        {isError && <ErrorState onRetry={refetch} className="border-none p-0" />}
        {data && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead className="text-right">Submitted</TableHead>
                <TableHead className="text-right">Approved</TableHead>
                <TableHead className="text-right">Accuracy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((reporter) => (
                <TableRow key={reporter.handle}>
                  <TableCell className="text-muted-foreground">{reporter.rank}</TableCell>
                  <TableCell className="font-medium">{reporter.handle}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {reporter.reportsSubmitted}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {reporter.reportsApproved}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatPercent(reporter.accuracyRate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
