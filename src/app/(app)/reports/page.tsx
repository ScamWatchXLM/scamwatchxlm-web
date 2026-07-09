"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { FilterBar } from "@/components/shared/filter-bar"
import { PaginationBar } from "@/components/shared/pagination-bar"
import { ReportStatusBadge } from "@/components/shared/report-status-badge"
import { SeverityBadge } from "@/components/shared/severity-badge"
import { DataTable, type DataTableColumn } from "@/components/tables/data-table"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useReports } from "@/hooks/use-reports"
import { formatRelativeTime } from "@/lib/utils/format"
import type { ReportStatus, ScamReport } from "@/types/domain"

export default function ReportsPage() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<ReportStatus | "all">("all")
  const [page, setPage] = useState(1)
  const router = useRouter()

  const { data, isLoading, isError, refetch } = useReports({
    page,
    pageSize: 15,
    query,
    status: status === "all" ? undefined : status,
  })

  const columns: DataTableColumn<ScamReport>[] = [
    {
      key: "title",
      header: "Report",
      render: (r) => (
        <div>
          <p className="font-medium">{r.title}</p>
          <p className="text-muted-foreground text-xs">{r.targetLabel}</p>
        </div>
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
    { key: "created", header: "Filed", render: (r) => formatRelativeTime(r.createdAt) },
    {
      key: "status",
      header: "Status",
      render: (r) => <ReportStatusBadge status={r.status} />,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Community-submitted scam reports and their review status."
        actions={
          <Button asChild>
            <Link href="/reports/new">
              <Plus className="size-4" /> Submit a Report
            </Link>
          </Button>
        }
      />

      <FilterBar
        searchValue={query}
        onSearchChange={(v) => {
          setQuery(v)
          setPage(1)
        }}
        searchPlaceholder="Search reports…"
      >
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as ReportStatus | "all")
            setPage(1)
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="escalated">Escalated</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>

      <DataTable
        columns={columns}
        rows={data?.items}
        rowKey={(r) => r.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onRowClick={(r) => router.push(`/reports/${r.id}`)}
        emptyTitle="No reports found"
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
