import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepIndicatorProps {
  steps: readonly { id: string; title: string }[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4">
      {steps.map((step, i) => {
        const state =
          i < currentStep ? "done" : i === currentStep ? "current" : "upcoming"
        return (
          <li key={step.id} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                  state === "done" && "border-primary bg-primary text-primary-foreground",
                  state === "current" && "border-primary text-primary",
                  state === "upcoming" && "border-border text-muted-foreground"
                )}
              >
                {state === "done" ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:inline",
                  state === "upcoming" ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {step.title}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-px flex-1",
                  state === "done" ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
