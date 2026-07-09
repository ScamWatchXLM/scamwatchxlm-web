"use client"

import Link from "next/link"
import { FileWarning, ScrollText, Users } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAdminMetrics, useAdminNetworkStats } from "@/hooks/use-admin"
import { formatCompactNumber } from "@/lib/utils/format"

export default function AdminPage() {
  const { data: metrics, isLoading: metricsLoading } = useAdminMetrics()
  const { data: networkStats, isLoading: statsLoading } = useAdminNetworkStats()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin"
        description="Moderation queue, user management, and system logs."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Pending Reports"
          value={String(metrics?.pendingReports ?? "—")}
          loading={metricsLoading}
        />
        <StatCard
          label="Active Users"
          value={String(metrics?.activeUsers ?? "—")}
          loading={metricsLoading}
        />
        <StatCard
          label="Suspended Users"
          value={String(metrics?.suspendedUsers ?? "—")}
          loading={metricsLoading}
        />
        <StatCard
          label="Accounts Monitored"
          value={
            networkStats ? formatCompactNumber(networkStats.totalAccountsMonitored) : "—"
          }
          loading={statsLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminLinkCard
          href="/admin/reports"
          icon={FileWarning}
          title="Manage Reports"
          description="Approve, reject, or escalate pending community reports."
        />
        <AdminLinkCard
          href="/admin/users"
          icon={Users}
          title="Manage Users"
          description="View reporter activity and moderate accounts."
        />
        <AdminLinkCard
          href="/admin/logs"
          icon={ScrollText}
          title="Audit Logs"
          description="Review recent moderation and system actions."
        />
      </div>
    </div>
  )
}

function AdminLinkCard({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <Card>
      <CardHeader>
        <Icon className="text-primary size-6" />
        <CardTitle className="mt-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" size="sm" asChild>
          <Link href={href}>Open</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
