"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ShieldHalf } from "lucide-react"
import { cn } from "@/lib/utils"
import { primaryNav, secondaryNav, siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle className="flex items-center gap-2">
            <ShieldHalf className="text-primary size-5" />
            {siteConfig.shortName}
          </SheetTitle>
        </SheetHeader>
        <nav className="space-y-6 overflow-y-auto p-3">
          <ul className="space-y-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                    pathname === item.href || pathname.startsWith(`${item.href}/`)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="size-4" />
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <div className="space-y-1 border-t pt-4">
            {secondaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="size-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
