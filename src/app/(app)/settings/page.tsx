"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTheme } from "next-themes"
import { useSettingsStore } from "@/stores/settings-store"
import { env } from "@/config/env"
import type { RiskLevel } from "@/types/domain"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const settings = useSettingsStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your notification preferences and display options."
      />

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Choose how you want to be notified about new alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingRow
            label="Email notifications"
            description="Receive a digest of critical alerts by email"
          >
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={settings.setEmailNotifications}
            />
          </SettingRow>
          <Separator />
          <SettingRow
            label="Push notifications"
            description="Browser push notifications for live alerts"
          >
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={settings.setPushNotifications}
            />
          </SettingRow>
          <Separator />
          <SettingRow
            label="Minimum alert severity"
            description="Only notify me for alerts at or above this level"
          >
            <Select
              value={settings.minimumAlertSeverity}
              onValueChange={(v) => settings.setMinimumAlertSeverity(v as RiskLevel)}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the dashboard looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingRow
            label="Theme"
            description="Choose light, dark, or match your system"
          >
            <Select value={mounted ? theme : undefined} onValueChange={setTheme}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="System" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <Separator />
          <SettingRow
            label="Compact tables"
            description="Reduce row height in data tables"
          >
            <Switch
              checked={settings.compactTables}
              onCheckedChange={settings.setCompactTables}
            />
          </SettingRow>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Current data source for this dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Mode</span>
            <span className="font-mono uppercase">{env.apiMode}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">API base URL</span>
            <span className="font-mono text-xs">{env.apiBaseUrl}</span>
          </div>
          <p className="text-muted-foreground text-xs">
            Set{" "}
            <code className="bg-muted rounded px-1 py-0.5">
              NEXT_PUBLIC_API_MODE=live
            </code>{" "}
            in your environment to connect a real backend.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {children}
    </div>
  )
}
