"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, X } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { PaginationBar } from "@/components/shared/pagination-bar"
import { SeverityBadge } from "@/components/shared/severity-badge"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { DataTable, type DataTableColumn } from "@/components/tables/data-table"
import { Button } from "@/components/ui/button"
import { useAdminReportsQueue } from "@/hooks/use-admin"
import { useUpdateReportStatus } from "@/hooks/use-reports"
import { formatRelativeTime } from "@/lib/utils/format"
import type { ScamReport } from "@/types/domain"

export default function AdminReportsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useAdminReportsQueue({
    page,
    pageSize: 15,
  })
  const updateStatus = useUpdateReportStatus()
  const [pendingAction, setPendingAction] = useState<{
    report: ScamReport
    status: "approved" | "rejected"
  } | null>(null)

  const columns: DataTableColumn<ScamReport>[] = [
    {
      key: "title",
      header: "Report",
      render: (r) => (
        <Link href={`/reports/${r.id}`} className="hover:underline">
          <p className="font-medium">{r.title}</p>
          <p className="text-muted-foreground text-xs">{r.targetLabel}</p>
        </Link>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (r) => <span className="capitalize">{r.category.replace(/_/g, " ")}</span>,
    },
    {
      key: "severity",
      header: "Severity",
      render: (r) => <SeverityBadge severity={r.severity} />,
    },
    { key: "reporter", header: "Reporter", render: (r) => r.reporterHandle },
    { key: "filed", header: "Filed", render: (r) => formatRelativeTime(r.createdAt) },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (r) => (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPendingAction({ report: r, status: "approved" })}
          >
            <Check className="size-3.5" /> Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPendingAction({ report: r, status: "rejected" })}
          >
            <X className="size-3.5" /> Reject
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Reports"
        description="Review and act on pending community-submitted reports."
      />

      <DataTable
        columns={columns}
        rows={data?.items}
        rowKey={(r) => r.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyTitle="Queue is clear"
        emptyDescription="No pending reports need review right now."
      />

      {data && (
        <PaginationBar
          page={page}
          pageSize={data.pageSize}
          total={data.total}
          onPageChange={setPage}
        />
      )}

      <ConfirmDialog
        open={Boolean(pendingAction)}
        onOpenChange={(open) => !open && setPendingAction(null)}
        title={
          pendingAction?.status === "approved"
            ? "Approve this report?"
            : "Reject this report?"
        }
        description={
          pendingAction
            ? `"${pendingAction.report.title}" will be marked as ${pendingAction.status}.`
            : undefined
        }
        confirmLabel={pendingAction?.status === "approved" ? "Approve" : "Reject"}
        destructive={pendingAction?.status === "rejected"}
        onConfirm={() => {
          if (pendingAction) {
            updateStatus.mutate({
              id: pendingAction.report.id,
              status: pendingAction.status,
            })
            setPendingAction(null)
          }
        }}
      />
    </div>
  )
}
