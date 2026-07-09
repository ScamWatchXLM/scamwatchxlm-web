"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileNav } from "./mobile-nav"
import { NotificationBell } from "./notification-bell"
import { ThemeToggle } from "./theme-toggle"
import { useUiStore } from "@/stores/ui-store"

export function Topbar() {
  const setCommandPaletteOpen = useUiStore((s) => s.setCommandPaletteOpen)

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-30 flex h-14 items-center gap-3 border-b px-4 backdrop-blur">
      <MobileNav />

      <Button
        variant="outline"
        className="text-muted-foreground hidden w-full max-w-sm justify-start gap-2 text-sm sm:flex"
        onClick={() => setCommandPaletteOpen(true)}
      >
        <Search className="size-4" />
        Search accounts, assets, transactions…
        <kbd className="bg-muted ml-auto hidden rounded border px-1.5 py-0.5 font-mono text-[10px] md:inline-block">
          ⌘K
        </kbd>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="sm:hidden"
        onClick={() => setCommandPaletteOpen(true)}
        aria-label="Search"
      >
        <Search className="size-4" />
      </Button>

      <div className="ml-auto flex items-center gap-1">
        <NotificationBell />
        <ThemeToggle />
      </div>
    </header>
  )
}
