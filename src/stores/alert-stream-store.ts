import { create } from "zustand"
import type { Alert } from "@/types/domain"
import type { WsStatus } from "@/lib/websocket/client"

interface AlertStreamState {
  liveAlerts: Alert[]
  status: WsStatus
  pushAlert: (alert: Alert) => void
  acknowledge: (id: string) => void
  clear: () => void
  setStatus: (status: WsStatus) => void
}

const MAX_LIVE_ALERTS = 50

export const useAlertStreamStore = create<AlertStreamState>((set) => ({
  liveAlerts: [],
  status: "idle",
  pushAlert: (alert) =>
    set((state) => ({
      liveAlerts: [alert, ...state.liveAlerts].slice(0, MAX_LIVE_ALERTS),
    })),
  acknowledge: (id) =>
    set((state) => ({
      liveAlerts: state.liveAlerts.map((a) =>
        a.id === id ? { ...a, acknowledged: true } : a
      ),
    })),
  clear: () => set({ liveAlerts: [] }),
  setStatus: (status) => set({ status }),
}))
