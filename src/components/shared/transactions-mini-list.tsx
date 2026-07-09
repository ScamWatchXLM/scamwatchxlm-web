import Link from "next/link"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { RiskBadge } from "@/components/shared/risk-badge"
import { CopyableAddress } from "@/components/shared/copyable-address"
import { Skeleton } from "@/components/ui/skeleton"
import { formatRelativeTime } from "@/lib/utils/format"
import type { Transaction } from "@/types/domain"

interface TransactionsMiniListProps {
  transactions?: Transaction[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function TransactionsMiniList({
  transactions,
  isLoading,
  isError,
  onRetry,
}: TransactionsMiniListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    )
  }

  if (isError) return <ErrorState onRetry={onRetry} />
  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions"
        description="No recent transaction activity found."
      />
    )
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <Link
          key={tx.hash}
          href={`/transactions/${tx.hash}`}
          className="hover:bg-muted/50 flex items-center justify-between gap-3 rounded-lg border p-3"
        >
          <div className="min-w-0">
            <CopyableAddress value={tx.hash} className="font-medium" />
            <p className="text-muted-foreground text-xs">
              {tx.operationType} · {tx.amount} {tx.assetCode} ·{" "}
              {formatRelativeTime(tx.createdAt)}
            </p>
          </div>
          <RiskBadge level={tx.riskScore.level} showIcon={false} />
        </Link>
      ))}
    </div>
  )
}
