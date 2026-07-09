"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
        <AlertTriangle className="text-destructive size-16" strokeWidth={1} />
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-muted-foreground max-w-sm">
          An unexpected error occurred. You can try again, or head back to the dashboard.
        </p>
        <Button onClick={reset}>Try again</Button>
      </body>
    </html>
  )
}
