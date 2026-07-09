"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { PaginationBar } from "@/components/shared/pagination-bar"
import { DataTable, type DataTableColumn } from "@/components/tables/data-table"
import { Badge } from "@/components/ui/badge"
import { useAdminUsers } from "@/hooks/use-admin"
import { formatDate } from "@/lib/utils/format"
import type { AdminUser } from "@/types/domain"

export default function AdminUsersPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useAdminUsers({ page, pageSize: 15 })

  const columns: DataTableColumn<AdminUser>[] = [
    {
      key: "handle",
      header: "User",
      render: (u) => (
        <div>
          <p className="font-medium">{u.handle}</p>
          <p className="text-muted-foreground text-xs">{u.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (u) => (
        <Badge variant="outline" className="capitalize">
          {u.role}
        </Badge>
      ),
    },
    { key: "submitted", header: "Reports Submitted", render: (u) => u.reportsSubmitted },
    { key: "reviewed", header: "Reports Reviewed", render: (u) => u.reportsReviewed },
    {
      key: "joined",
      header: "Joined",
      render: (u) =>
        formatDate(u.joinedAt, { dateStyle: "medium", timeStyle: undefined }),
    },
    {
      key: "status",
      header: "Status",
      render: (u) => (
        <Badge
          variant={u.status === "active" ? "outline" : "destructive"}
          className="capitalize"
        >
          {u.status}
        </Badge>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Community reporters, moderators, and analysts."
      />

      <DataTable
        columns={columns}
        rows={data?.items}
        rowKey={(u) => u.id}
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
