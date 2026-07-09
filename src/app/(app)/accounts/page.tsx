"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { FilterBar } from "@/components/shared/filter-bar"
import { PaginationBar } from "@/components/shared/pagination-bar"
import { RiskBadge } from "@/components/shared/risk-badge"
import { CopyableAddress } from "@/components/shared/copyable-address"
import { DataTable, type DataTableColumn } from "@/components/tables/data-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useAccounts } from "@/hooks/use-accounts"
import { formatCompactNumber, formatRelativeTime } from "@/lib/utils/format"
import type { Account } from "@/types/domain"

export default function AccountsPage() {
  const [query, setQuery] = useState("")
  const [flaggedOnly, setFlaggedOnly] = useState(false)
  const [page, setPage] = useState(1)
  const router = useRouter()

  const { data, isLoading, isError, refetch } = useAccounts({
    page,
    pageSize: 15,
    query,
    flaggedOnly,
  })

  const columns: DataTableColumn<Account>[] = [
    {
      key: "id",
      header: "Account",
      render: (a) => (
        <div>
          {a.label && <p className="font-medium">{a.label}</p>}
          <CopyableAddress
            value={a.id}
            className={a.label ? "text-muted-foreground" : "font-medium"}
          />
        </div>
      ),
    },
    {
      key: "transactions",
      header: "Transactions",
      render: (a) => formatCompactNumber(a.transactionCount),
    },
    { key: "reports", header: "Reports", render: (a) => a.reportCount },
    {
      key: "lastActive",
      header: "Last Active",
      render: (a) => formatRelativeTime(a.lastActivityAt),
    },
    {
      key: "risk",
      header: "Risk",
      render: (a) => (
        <RiskBadge level={a.riskScore.level} score={a.riskScore.value} showIcon={false} />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accounts"
        description="Stellar accounts monitored for suspicious activity."
      />

      <FilterBar
        searchValue={query}
        onSearchChange={(v) => {
          setQuery(v)
          setPage(1)
        }}
        searchPlaceholder="Search by account address or label…"
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
        rowKey={(a) => a.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onRowClick={(a) => router.push(`/accounts/${a.id}`)}
        emptyTitle="No accounts found"
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
