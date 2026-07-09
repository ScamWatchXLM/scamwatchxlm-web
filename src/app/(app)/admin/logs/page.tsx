"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { PaginationBar } from "@/components/shared/pagination-bar"
import { DataTable, type DataTableColumn } from "@/components/tables/data-table"
import { Badge } from "@/components/ui/badge"
import { useAdminLogs } from "@/hooks/use-admin"
import { formatDate } from "@/lib/utils/format"
import type { AdminLogEntry } from "@/types/domain"

export default function AdminLogsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useAdminLogs({ page, pageSize: 20 })

  const columns: DataTableColumn<AdminLogEntry>[] = [
    { key: "actor", header: "Actor", render: (l) => l.actorHandle },
    {
      key: "action",
      header: "Action",
      render: (l) => <Badge variant="outline">{l.action.replace(/_/g, " ")}</Badge>,
    },
    {
      key: "target",
      header: "Target",
      render: (l) => <span className="font-mono text-xs">{l.target}</span>,
    },
    { key: "time", header: "Timestamp", render: (l) => formatDate(l.timestamp) },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="System-wide moderation and admin action history."
      />

      <DataTable
        columns={columns}
        rows={data?.items}
        rowKey={(l) => l.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
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
