import { useCallback, useEffect, useState } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key)
      if (stored !== null) setValue(JSON.parse(stored) as T)
    } catch {
      // Ignore malformed/unavailable storage.
    } finally {
      setHydrated(true)
    }
  }, [key])

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = next instanceof Function ? next(prev) : next
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved))
        } catch {
          // Ignore quota / privacy-mode errors.
        }
        return resolved
      })
    },
    [key]
  )

  return [value, update, hydrated] as const
}
