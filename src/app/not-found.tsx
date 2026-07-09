import Link from "next/link"
import { ShieldQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <ShieldQuestion className="text-muted-foreground size-16" strokeWidth={1} />
      <h1 className="text-4xl font-semibold tracking-tight">404</h1>
      <p className="text-muted-foreground max-w-sm">
        This page doesn&apos;t exist — it may have been moved, or the entity you&apos;re
        looking for isn&apos;t tracked yet.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/search">Search instead</Link>
        </Button>
      </div>
    </div>
  )
}
