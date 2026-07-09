"use client"

import { useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/shared/page-header"
import { FilterBar } from "@/components/shared/filter-bar"
import { PaginationBar } from "@/components/shared/pagination-bar"
import { RiskBadge } from "@/components/shared/risk-badge"
import { CopyableAddress } from "@/components/shared/copyable-address"
import { DataTable, type DataTableColumn } from "@/components/tables/data-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAssets } from "@/hooks/use-assets"
import { formatCompactNumber, formatCurrency } from "@/lib/utils/format"
import type { StellarAsset } from "@/types/domain"
import { useRouter } from "next/navigation"

export default function AssetsPage() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string>("all")
  const [flaggedOnly, setFlaggedOnly] = useState(false)
  const [page, setPage] = useState(1)
  const router = useRouter()

  const { data, isLoading, isError, refetch } = useAssets({
    page,
    pageSize: 15,
    query,
    category: category === "all" ? undefined : category,
    flaggedOnly,
  })

  const columns: DataTableColumn<StellarAsset>[] = [
    {
      key: "code",
      header: "Asset",
      render: (a) => (
        <div>
          <p className="font-medium">{a.code}</p>
          <CopyableAddress value={a.issuer} className="text-muted-foreground" />
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (a) => (
        <Badge variant="outline" className="capitalize">
          {a.category}
        </Badge>
      ),
    },
    {
      key: "holders",
      header: "Holders",
      render: (a) => formatCompactNumber(a.holderCount),
    },
    {
      key: "trustlines",
      header: "Trustlines",
      render: (a) => formatCompactNumber(a.trustlineCount),
    },
    { key: "volume", header: "24h Volume", render: (a) => formatCurrency(a.volume24h) },
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
        title="Assets"
        description="All Stellar assets currently being monitored for scam activity."
      />

      <FilterBar
        searchValue={query}
        onSearchChange={(v) => {
          setQuery(v)
          setPage(1)
        }}
        searchPlaceholder="Search by asset code or issuer…"
      >
        <Select
          value={category}
          onValueChange={(v) => {
            setCategory(v)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="defi">DeFi</SelectItem>
            <SelectItem value="stablecoin">Stablecoin</SelectItem>
            <SelectItem value="meme">Meme</SelectItem>
            <SelectItem value="utility">Utility</SelectItem>
            <SelectItem value="nft">NFT</SelectItem>
            <SelectItem value="wrapped">Wrapped</SelectItem>
            <SelectItem value="unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>
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
        onRowClick={(a) => router.push(`/assets/${a.id}`)}
        emptyTitle="No assets found"
        emptyDescription="Try adjusting your search or filters."
      />

      {data && (
        <PaginationBar
          page={page}
          pageSize={data.pageSize}
          total={data.total}
          onPageChange={setPage}
        />
      )}

      <p className="text-muted-foreground text-center text-xs">
        Don&apos;t see what you&apos;re looking for?{" "}
        <Link href="/search" className="underline underline-offset-4">
          Try a global search
        </Link>
        .
      </p>
    </div>
  )
}
