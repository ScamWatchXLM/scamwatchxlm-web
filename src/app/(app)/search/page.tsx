"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  Coins,
  Building2,
  User,
  ArrowLeftRight,
  FileWarning,
  SearchX,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { FilterBar } from "@/components/shared/filter-bar"
import { EmptyState } from "@/components/shared/empty-state"
import { RiskBadge } from "@/components/shared/risk-badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useGlobalSearch } from "@/hooks/use-search"
import type { EntityKind } from "@/types/domain"

const KIND_ICON: Record<
  EntityKind | "report",
  React.ComponentType<{ className?: string }>
> = {
  account: User,
  asset: Coins,
  issuer: Building2,
  transaction: ArrowLeftRight,
  report: FileWarning,
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") ?? "")
  const { data: results, isLoading, isFetching } = useGlobalSearch(query)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Search"
        description="Search across accounts, assets, issuers, transactions, and reports."
      />

      <FilterBar
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder="Search by account, asset code, issuer, tx hash, or report ID…"
      />

      {query.trim().length <= 1 && (
        <EmptyState
          icon={SearchX}
          title="Start typing to search"
          description="Search accounts (G…), assets, issuers, transaction hashes, or report IDs."
        />
      )}

      {query.trim().length > 1 && (isLoading || isFetching) && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}

      {query.trim().length > 1 && !isFetching && results?.length === 0 && (
        <EmptyState
          icon={SearchX}
          title="No results found"
          description={`Nothing matched "${query}".`}
        />
      )}

      {results && results.length > 0 && (
        <div className="space-y-2">
          {results.map((result) => {
            const Icon = KIND_ICON[result.kind]
            return (
              <Link key={`${result.kind}-${result.id}`} href={result.href}>
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardContent className="flex items-center gap-4 py-1">
                    <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
                      <Icon className="text-muted-foreground size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{result.label}</p>
                      <p className="text-muted-foreground truncate text-sm capitalize">
                        {result.subtitle}
                      </p>
                    </div>
                    {result.riskLevel && (
                      <RiskBadge level={result.riskLevel} showIcon={false} />
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <SearchPageContent />
    </Suspense>
  )
}
