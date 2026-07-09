"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShieldHalf, ChevronsLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { primaryNav, secondaryNav, siteConfig } from "@/config/site"
import { useUiStore } from "@/stores/ui-store"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function Sidebar() {
  const pathname = usePathname()
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground sticky top-0 hidden h-svh shrink-0 flex-col border-r transition-[width] duration-200 md:flex",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <ShieldHalf className="text-primary size-6 shrink-0" />
        {!collapsed && (
          <span className="truncate font-semibold">{siteConfig.shortName}</span>
        )}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-2 py-4">
        <NavGroup items={primaryNav} pathname={pathname} collapsed={collapsed} />
        <div className="border-t pt-4">
          <NavGroup items={secondaryNav} pathname={pathname} collapsed={collapsed} />
        </div>
      </nav>

      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="icon"
          className="w-full"
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronsLeft
            className={cn("size-4 transition-transform", collapsed && "rotate-180")}
          />
        </Button>
      </div>
    </aside>
  )
}

function NavGroup({
  items,
  pathname,
  collapsed,
}: {
  items: typeof primaryNav
  pathname: string
  collapsed: boolean
}) {
  return (
    <ul className="space-y-1">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
        const link = (
          <Link
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed && "justify-center px-0"
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {!collapsed && <span className="truncate">{item.title}</span>}
          </Link>
        )

        return (
          <li key={item.href}>
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            ) : (
              link
            )}
          </li>
        )
      })}
    </ul>
  )
}
