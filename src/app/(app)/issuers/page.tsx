"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BadgeCheck } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { FilterBar } from "@/components/shared/filter-bar"
import { PaginationBar } from "@/components/shared/pagination-bar"
import { RiskBadge } from "@/components/shared/risk-badge"
import { CopyableAddress } from "@/components/shared/copyable-address"
import { DataTable, type DataTableColumn } from "@/components/tables/data-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useIssuers } from "@/hooks/use-issuers"
import { formatCompactNumber } from "@/lib/utils/format"
import type { Issuer } from "@/types/domain"

export default function IssuersPage() {
  const [query, setQuery] = useState("")
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [page, setPage] = useState(1)
  const router = useRouter()

  const { data, isLoading, isError, refetch } = useIssuers({
    page,
    pageSize: 15,
    query,
    verifiedOnly,
  })

  const columns: DataTableColumn<Issuer>[] = [
    {
      key: "name",
      header: "Issuer",
      render: (i) => (
        <div className="flex items-center gap-1.5">
          <div>
            <p className="font-medium">{i.name ?? "Unlabeled"}</p>
            <CopyableAddress value={i.id} className="text-muted-foreground" />
          </div>
          {i.verified && <BadgeCheck className="size-4 shrink-0 text-emerald-500" />}
        </div>
      ),
    },
    { key: "assets", header: "Assets Issued", render: (i) => i.issuedAssets.length },
    {
      key: "trustlines",
      header: "Trustlines",
      render: (i) => formatCompactNumber(i.trustlineCount),
    },
    { key: "reports", header: "Reports", render: (i) => i.reportCount },
    {
      key: "risk",
      header: "Risk",
      render: (i) => (
        <RiskBadge level={i.riskScore.level} score={i.riskScore.value} showIcon={false} />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Issuers"
        description="Asset-issuing accounts across the Stellar network."
      />

      <FilterBar
        searchValue={query}
        onSearchChange={(v) => {
          setQuery(v)
          setPage(1)
        }}
        searchPlaceholder="Search by issuer name or address…"
      >
        <div className="flex items-center gap-2">
          <Checkbox
            id="verified-only"
            checked={verifiedOnly}
            onCheckedChange={(v) => {
              setVerifiedOnly(Boolean(v))
              setPage(1)
            }}
          />
          <Label htmlFor="verified-only" className="text-sm font-normal">
            Verified only
          </Label>
        </div>
      </FilterBar>

      <DataTable
        columns={columns}
        rows={data?.items}
        rowKey={(i) => i.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onRowClick={(i) => router.push(`/issuers/${i.id}`)}
        emptyTitle="No issuers found"
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
