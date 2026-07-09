"use client"

import { use } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { RiskFactorList } from "@/components/shared/risk-factor-list"
import { TimelineList } from "@/components/shared/timeline-list"
import { RelatedReportsList } from "@/components/shared/related-reports-list"
import { TransactionsMiniList } from "@/components/shared/transactions-mini-list"
import { CopyableAddress } from "@/components/shared/copyable-address"
import { RiskBadge } from "@/components/shared/risk-badge"
import { DetailSkeleton } from "@/components/shared/loading-skeletons"
import { ErrorState } from "@/components/shared/error-state"
import { EmptyState } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useAccount, useAccountTimeline } from "@/hooks/use-accounts"
import { useAccountTransactions } from "@/hooks/use-transactions"
import { useRelatedReports } from "@/hooks/use-reports"
import { formatCompactNumber, formatDate, truncateMiddle } from "@/lib/utils/format"

export default function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: account, isLoading, isError, refetch } = useAccount(id)
  const timeline = useAccountTimeline(id)
  const transactions = useAccountTransactions(id)
  const relatedReports = useRelatedReports(id, "account", account?.label ?? id)

  if (isLoading) return <DetailSkeleton />
  if (isError || !account) return <ErrorState onRetry={refetch} />

  return (
    <div className="space-y-6">
      <PageHeader
        title={account.label ?? truncateMiddle(account.id, 8, 8)}
        description={<CopyableAddress value={account.id} prefixLen={10} suffixLen={10} />}
        actions={
          <div className="flex items-center gap-2">
            {account.flagged && <Badge variant="destructive">Flagged</Badge>}
            <Button size="sm" asChild>
              <Link href={`/reports/new?targetKind=account&targetId=${account.id}`}>
                Report this account
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Transactions"
          value={formatCompactNumber(account.transactionCount)}
        />
        <StatCard label="Balance (XLM)" value={formatCompactNumber(account.balanceXlm)} />
        <StatCard label="Reports Filed" value={String(account.reportCount)} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {account.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {account.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="capitalize">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <Tabs defaultValue="connected">
            <TabsList>
              <TabsTrigger value="connected">Connected Entities</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="connected" className="mt-4 space-y-2">
              {account.connectedEntities.length === 0 ? (
                <EmptyState
                  title="No connected entities"
                  description="No frequent counterparties detected yet."
                />
              ) : (
                account.connectedEntities.map((entity) => (
                  <Link
                    key={entity.id}
                    href={`/${entity.kind}s/${entity.id}`}
                    className="hover:bg-muted/50 flex items-center justify-between gap-3 rounded-lg border p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{entity.label}</p>
                      <p className="text-muted-foreground text-xs capitalize">
                        {entity.kind} · {entity.relationship}
                      </p>
                    </div>
                    <RiskBadge level={entity.riskLevel} showIcon={false} />
                  </Link>
                ))
              )}
            </TabsContent>
            <TabsContent value="transactions" className="mt-4">
              <TransactionsMiniList
                transactions={transactions.data}
                isLoading={transactions.isLoading}
                isError={transactions.isError}
                onRetry={transactions.refetch}
              />
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
          <RiskFactorList riskScore={account.riskScore} />
          <p className="text-muted-foreground text-center text-xs">
            Account created {formatDate(account.createdAt)}
          </p>
        </div>
      </div>
    </div>
  )
}
