"use client"

import { useEffect, useRef } from "react"
import { isMockMode } from "@/config/env"
import { alertSocket, type WsMessage } from "@/lib/websocket/client"
import { generateAlert } from "@/mocks/generators"
import { useAlertStreamStore } from "@/stores/alert-stream-store"
import type { Alert } from "@/types/domain"

/**
 * Subscribes to the live alert feed for the lifetime of the calling
 * component. In mock mode this simulates a trickle of new alerts on an
 * interval; in live mode it connects `alertSocket` to the real backend.
 * Multiple components can call this simultaneously — the underlying store
 * dedupes rendering, and the socket connection itself is a singleton.
 */
export function useLiveAlertStream(intervalMs = 8000) {
  const pushAlert = useAlertStreamStore((s) => s.pushAlert)
  const setStatus = useAlertStreamStore((s) => s.setStatus)
  const liveAlerts = useAlertStreamStore((s) => s.liveAlerts)
  const status = useAlertStreamStore((s) => s.status)
  const counter = useRef(0)

  useEffect(() => {
    if (isMockMode) {
      setStatus("open")
      const timer = setInterval(() => {
        counter.current += 1
        pushAlert(generateAlert(`live-${Date.now()}-${counter.current}`))
      }, intervalMs)
      return () => clearInterval(timer)
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
