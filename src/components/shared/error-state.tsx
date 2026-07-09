import { AlertCircle, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this data. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "border-destructive/30 bg-destructive/5 flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-10 text-center",
        className
      )}
    >
      <div className="bg-destructive/10 flex size-12 items-center justify-center rounded-full">
        <AlertCircle className="text-destructive size-6" aria-hidden />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCw className="size-3.5" />
          Try again
        </Button>
      )}
    </div>
  )
}
