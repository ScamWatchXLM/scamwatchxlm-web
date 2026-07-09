"use client"

import { use } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/shared/page-header"
import { RiskFactorList } from "@/components/shared/risk-factor-list"
import { CopyableAddress } from "@/components/shared/copyable-address"
import { DetailSkeleton } from "@/components/shared/loading-skeletons"
import { ErrorState } from "@/components/shared/error-state"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTransaction } from "@/hooks/use-transactions"
import { formatDate } from "@/lib/utils/format"

export default function TransactionDetailPage({
  params,
}: {
  params: Promise<{ hash: string }>
}) {
  const { hash } = use(params)
  const { data: tx, isLoading, isError, refetch } = useTransaction(hash)

  if (isLoading) return <DetailSkeleton />
  if (isError || !tx) return <ErrorState onRetry={refetch} />

  const fields: { label: string; value: React.ReactNode }[] = [
    {
      label: "Transaction Hash",
      value: <CopyableAddress value={tx.hash} prefixLen={12} suffixLen={12} />,
    },
    { label: "Ledger", value: tx.ledger.toLocaleString() },
    {
      label: "Operation Type",
      value: <Badge variant="outline">{tx.operationType}</Badge>,
    },
    {
      label: "Source Account",
      value: (
        <CopyableAddress
          value={tx.sourceAccount}
          href={`/accounts/${tx.sourceAccount}`}
        />
      ),
    },
    ...(tx.destinationAccount
      ? [
          {
            label: "Destination Account",
            value: (
              <CopyableAddress
                value={tx.destinationAccount}
                href={`/accounts/${tx.destinationAccount}`}
              />
            ),
          },
        ]
      : []),
    { label: "Amount", value: `${tx.amount} ${tx.assetCode}` },
    { label: "Fee Charged", value: `${tx.feeCharged} stroops` },
    { label: "Timestamp", value: formatDate(tx.createdAt) },
    ...(tx.memo ? [{ label: "Memo", value: tx.memo }] : []),
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transaction Details"
        description={<CopyableAddress value={tx.hash} prefixLen={10} suffixLen={10} />}
        actions={
          <div className="flex items-center gap-2">
            {tx.flagged && <Badge variant="destructive">Flagged</Badge>}
            <Button size="sm" asChild>
              <Link href={`/reports/new?targetKind=transaction&targetId=${tx.hash}`}>
                Report this transaction
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Operation Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y">
              {fields.map((field) => (
                <div
                  key={field.label}
                  className="flex items-center justify-between gap-4 py-3 text-sm"
                >
                  <dt className="text-muted-foreground">{field.label}</dt>
                  <dd className="font-medium">{field.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <RiskFactorList riskScore={tx.riskScore} />
      </div>
    </div>
  )
}
