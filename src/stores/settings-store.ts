import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { RiskLevel } from "@/types/domain"

interface SettingsState {
  emailNotifications: boolean
  pushNotifications: boolean
  minimumAlertSeverity: RiskLevel
  compactTables: boolean
  setEmailNotifications: (value: boolean) => void
  setPushNotifications: (value: boolean) => void
  setMinimumAlertSeverity: (value: RiskLevel) => void
  setCompactTables: (value: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      emailNotifications: true,
      pushNotifications: false,
      minimumAlertSeverity: "medium",
      compactTables: false,
      setEmailNotifications: (value) => set({ emailNotifications: value }),
      setPushNotifications: (value) => set({ pushNotifications: value }),
      setMinimumAlertSeverity: (value) => set({ minimumAlertSeverity: value }),
      setCompactTables: (value) => set({ compactTables: value }),
    }),
    { name: "scamwatchxlm-settings" }
  )
)
