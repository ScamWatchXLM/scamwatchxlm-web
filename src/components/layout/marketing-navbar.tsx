"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShieldHalf } from "lucide-react"
import { cn } from "@/lib/utils"
import { marketingNav, siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { MobileNav } from "./mobile-nav"

export function MarketingNavbar() {
  const pathname = usePathname()

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <ShieldHalf className="text-primary size-6" />
          {siteConfig.shortName}
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {marketingNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/dashboard">Open Dashboard</Link>
          </Button>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}
