"use client"

import { useEffect } from "react"
import { isMockMode } from "@/config/env"
import { alertSocket, type WsMessage } from "@/lib/websocket/client"
import { generateAlert } from "@/mocks/generators"
import { useAlertStreamStore } from "@/stores/alert-stream-store"
import type { Alert } from "@/types/domain"

let mockLoopTimer: ReturnType<typeof setInterval> | null = null
let mockLoopSubscribers = 0
let mockLoopCounter = 0

function startMockLoop(intervalMs: number) {
  mockLoopSubscribers += 1
  useAlertStreamStore.getState().setStatus("open")
  if (mockLoopTimer) return
  mockLoopTimer = setInterval(() => {
    mockLoopCounter += 1
    useAlertStreamStore.getState().pushAlert({
      ...generateAlert(`live-${Date.now()}-${mockLoopCounter}`),
      createdAt: new Date().toISOString(),
    })
  }, intervalMs)
}

function stopMockLoop() {
  mockLoopSubscribers = Math.max(0, mockLoopSubscribers - 1)
  if (mockLoopSubscribers === 0 && mockLoopTimer) {
    clearInterval(mockLoopTimer)
    mockLoopTimer = null
  }
}

/**
 * Subscribes to the live alert feed for the lifetime of the calling
 * component. In mock mode this simulates a trickle of new alerts on an
 * interval; in live mode it connects `alertSocket` to the real backend.
 * Multiple components can call this simultaneously — the mock loop is a
 * module-level singleton (mirroring `alertSocket`'s singleton connection),
 * so concurrent callers share one interval instead of each running their
 * own and multiplying the alert rate.
 */
export function useLiveAlertStream(intervalMs = 8000) {
  const pushAlert = useAlertStreamStore((s) => s.pushAlert)
  const setStatus = useAlertStreamStore((s) => s.setStatus)
  const liveAlerts = useAlertStreamStore((s) => s.liveAlerts)
  const status = useAlertStreamStore((s) => s.status)

  useEffect(() => {
    if (isMockMode) {
      startMockLoop(intervalMs)
      return () => stopMockLoop()
    }

    alertSocket.connect()
    const unsubscribeStatus = alertSocket.onStatusChange(setStatus)
    const unsubscribeMessages = alertSocket.subscribe<Alert>(
      (message: WsMessage<Alert>) => {
        if (message.type === "alert") pushAlert(message.payload)
      }
    )

    return () => {
      unsubscribeStatus()
      unsubscribeMessages()
    }
  }, [intervalMs, pushAlert, setStatus])

  return { liveAlerts, status }
}
