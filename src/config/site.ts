import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  Bell,
  Search,
  Coins,
  Users,
  Building2,
  ArrowLeftRight,
  FileWarning,
  BarChart3,
  BookOpen,
  Info,
  Settings,
  ShieldCheck,
} from "lucide-react"

export const siteConfig = {
  name: "ScamWatchXLM",
  shortName: "ScamWatchXLM",
  description:
    "Public dashboard for tracking, reporting, and investigating scams across the Stellar (XLM) network.",
  url: "https://scamwatchxlm.org",
  githubUrl: "https://github.com/scamwatchxlm/scamwatchxlm-web",
  twitterUrl: "https://twitter.com/scamwatchxlm",
}

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  description?: string
}

export const primaryNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Live Alerts", href: "/alerts", icon: Bell },
  { title: "Search", href: "/search", icon: Search },
  { title: "Assets", href: "/assets", icon: Coins },
  { title: "Accounts", href: "/accounts", icon: Users },
  { title: "Issuers", href: "/issuers", icon: Building2 },
  { title: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { title: "Reports", href: "/reports", icon: FileWarning },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
]

export const secondaryNav: NavItem[] = [
  { title: "Documentation", href: "/docs", icon: BookOpen },
  { title: "About", href: "/about", icon: Info },
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Admin", href: "/admin", icon: ShieldCheck },
]

export const marketingNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Docs", href: "/docs", icon: BookOpen },
  { title: "About", href: "/about", icon: Info },
]
