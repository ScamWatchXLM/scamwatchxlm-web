"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { FilterBar } from "@/components/shared/filter-bar"
import { PaginationBar } from "@/components/shared/pagination-bar"
import { RiskBadge } from "@/components/shared/risk-badge"
import { CopyableAddress } from "@/components/shared/copyable-address"
import { DataTable, type DataTableColumn } from "@/components/tables/data-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useTransactions } from "@/hooks/use-transactions"
import { formatRelativeTime } from "@/lib/utils/format"
import type { Transaction } from "@/types/domain"

export default function TransactionsPage() {
  const [query, setQuery] = useState("")
  const [flaggedOnly, setFlaggedOnly] = useState(false)
  const [page, setPage] = useState(1)
  const router = useRouter()

  const { data, isLoading, isError, refetch } = useTransactions({
    page,
    pageSize: 20,
    query,
    flaggedOnly,
  })

  const columns: DataTableColumn<Transaction>[] = [
    {
      key: "hash",
      header: "Hash",
      render: (t) => <CopyableAddress value={t.hash} className="font-medium" />,
    },
    {
      key: "type",
      header: "Type",
      render: (t) => <Badge variant="outline">{t.operationType}</Badge>,
    },
    { key: "amount", header: "Amount", render: (t) => `${t.amount} ${t.assetCode}` },
    {
      key: "source",
      header: "Source",
      render: (t) => (
        <CopyableAddress value={t.sourceAccount} className="text-muted-foreground" />
      ),
    },
    { key: "time", header: "Time", render: (t) => formatRelativeTime(t.createdAt) },
    {
      key: "risk",
      header: "Risk",
      render: (t) => <RiskBadge level={t.riskScore.level} showIcon={false} />,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Recent Stellar network transactions with risk annotations."
      />

      <FilterBar
        searchValue={query}
        onSearchChange={(v) => {
          setQuery(v)
          setPage(1)
        }}
        searchPlaceholder="Search by transaction hash or source account…"
      >
        <div className="flex items-center gap-2">
          <Checkbox
            id="flagged-only"
            checked={flaggedOnly}
            onCheckedChange={(v) => {
              setFlaggedOnly(Boolean(v))
              setPage(1)
            }}
          />
          <Label htmlFor="flagged-only" className="text-sm font-normal">
            Flagged only
          </Label>
        </div>
      </FilterBar>

      <DataTable
        columns={columns}
        rows={data?.items}
        rowKey={(t) => t.hash}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onRowClick={(t) => router.push(`/transactions/${t.hash}`)}
        emptyTitle="No transactions found"
      />

      {data && (
        <PaginationBar
          page={page}
          pageSize={data.pageSize}
          total={data.total}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
