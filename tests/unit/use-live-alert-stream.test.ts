import { afterEach, describe, expect, it, vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useLiveAlertStream } from "@/hooks/use-live-alert-stream"
import { useAlertStreamStore } from "@/stores/alert-stream-store"

afterEach(() => {
  useAlertStreamStore.setState({ liveAlerts: [], status: "idle" })
  vi.useRealTimers()
})

describe("useLiveAlertStream (mock mode)", () => {
  it("pushes exactly one alert per tick even with multiple mounted consumers", () => {
    vi.useFakeTimers()

    const a = renderHook(() => useLiveAlertStream(1000))
    const b = renderHook(() => useLiveAlertStream(1000))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(useAlertStreamStore.getState().liveAlerts).toHaveLength(1)

    a.unmount()
    b.unmount()
  })

  it("stamps pushed alerts with the current time, not a stale mock date", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-07-13T12:00:00.000Z"))

    const { unmount } = renderHook(() => useLiveAlertStream(1000))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    const [alert] = useAlertStreamStore.getState().liveAlerts
    expect(alert.createdAt).toBe("2026-07-13T12:00:01.000Z")

    unmount()
  })

  it("keeps the loop running for a remaining consumer after one unmounts", () => {
    vi.useFakeTimers()

    const a = renderHook(() => useLiveAlertStream(1000))
    const b = renderHook(() => useLiveAlertStream(1000))
    a.unmount()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(useAlertStreamStore.getState().liveAlerts).toHaveLength(1)
    b.unmount()
  })
})
