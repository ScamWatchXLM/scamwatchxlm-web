"use client"

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FilterBarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  children?: React.ReactNode
  className?: string
}

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search…",
  children,
  className,
}: FilterBarProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center", className)}>
      <div className="relative flex-1 sm:max-w-sm">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9"
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-1 size-6 -translate-y-1/2"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
          >
            <X className="size-3.5" />
          </Button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  )
}
