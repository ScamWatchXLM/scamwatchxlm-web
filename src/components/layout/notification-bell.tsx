"use client"

import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLiveAlertStream } from "@/hooks/use-live-alert-stream"
import { useSettingsStore } from "@/stores/settings-store"
import { meetsMinimumSeverity } from "@/lib/utils/format"

export function NotificationBell() {
  const { liveAlerts } = useLiveAlertStream()
  const minimumAlertSeverity = useSettingsStore((s) => s.minimumAlertSeverity)
  const unacknowledged = liveAlerts.filter(
    (a) => !a.acknowledged && meetsMinimumSeverity(a.severity, minimumAlertSeverity)
  ).length

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      asChild
      aria-label="Live alerts"
    >
      <Link href="/alerts">
        <Bell className="size-4" />
        {unacknowledged > 0 && (
          <Badge
            className="bg-destructive absolute -top-1 -right-1 h-4 min-w-4 justify-center rounded-full px-1 text-[10px] text-white"
            variant="destructive"
          >
            {unacknowledged > 99 ? "99+" : unacknowledged}
          </Badge>
        )}
      </Link>
    </Button>
  )
}
