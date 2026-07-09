import { describe, expect, it, vi } from "vitest"
import { act, renderHook } from "@testing-library/react"
import { useDebouncedValue } from "@/hooks/use-debounced-value"

describe("useDebouncedValue", () => {
  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("first", 300))
    expect(result.current).toBe("first")
  })

  it("updates only after the delay elapses", () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      {
        initialProps: { value: "first" },
      }
    )

    rerender({ value: "second" })
    expect(result.current).toBe("first")

    act(() => {
      vi.advanceTimersByTime(299)
    })
    expect(result.current).toBe("first")

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe("second")

    vi.useRealTimers()
  })
})
