import { env } from "@/config/env"

export type WsStatus = "idle" | "connecting" | "open" | "closed" | "error"

export interface WsMessage<T = unknown> {
  type: string
  payload: T
}

type Listener<T = unknown> = (message: WsMessage<T>) => void

/**
 * Thin reconnecting WebSocket wrapper for the live alert stream.
 *
 * This is an extensibility point: in mock mode it never actually opens a
 * socket — `useLiveAlertStream` (src/hooks/use-live-alert-stream.ts) instead
 * simulates messages on an interval. Once a real backend exists, flip
 * `NEXT_PUBLIC_API_MODE=live` and this class will connect to
 * `NEXT_PUBLIC_WS_BASE_URL` and start dispatching real messages using the
 * exact same `subscribe` API, so no consuming code needs to change.
 */
export class ReconnectingSocket {
  private socket: WebSocket | null = null
  private listeners = new Set<Listener>()
  private statusListeners = new Set<(status: WsStatus) => void>()
  private status: WsStatus = "idle"
  private reconnectAttempt = 0
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private manuallyClosed = false

  constructor(private path = "") {}

  connect() {
    if (typeof window === "undefined") return
    this.manuallyClosed = false
    this.setStatus("connecting")

    try {
      this.socket = new WebSocket(`${env.wsBaseUrl}${this.path}`)
    } catch {
      this.setStatus("error")
      this.scheduleReconnect()
      return
    }

    this.socket.onopen = () => {
      this.reconnectAttempt = 0
      this.setStatus("open")
    }

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WsMessage
        this.listeners.forEach((listener) => listener(message))
      } catch {
        // Ignore malformed frames.
      }
    }

    this.socket.onclose = () => {
      this.setStatus("closed")
      if (!this.manuallyClosed) this.scheduleReconnect()
    }

    this.socket.onerror = () => {
      this.setStatus("error")
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return
    const delay = Math.min(1000 * 2 ** this.reconnectAttempt, 30000)
    this.reconnectAttempt += 1
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.connect()
    }, delay)
  }

  private setStatus(status: WsStatus) {
    this.status = status
    this.statusListeners.forEach((listener) => listener(status))
  }

  getStatus() {
    return this.status
  }

  subscribe<T>(listener: Listener<T>) {
    this.listeners.add(listener as Listener)
    return () => this.listeners.delete(listener as Listener)
  }

  onStatusChange(listener: (status: WsStatus) => void) {
    this.statusListeners.add(listener)
    return () => this.statusListeners.delete(listener)
  }

  send(message: WsMessage) {
    this.socket?.send(JSON.stringify(message))
  }

  close() {
    this.manuallyClosed = true
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.socket?.close()
  }
}

export const alertSocket = new ReconnectingSocket("/alerts")
