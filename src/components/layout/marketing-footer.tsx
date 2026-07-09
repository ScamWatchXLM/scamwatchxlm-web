import Link from "next/link"
import { ShieldHalf } from "lucide-react"
import { siteConfig } from "@/config/site"

const footerLinks = [
  {
    title: "Product",
    links: [
      { title: "Dashboard", href: "/dashboard" },
      { title: "Live Alerts", href: "/alerts" },
      { title: "Analytics", href: "/analytics" },
      { title: "Reports", href: "/reports" },
    ],
  },
  {
    title: "Resources",
    links: [
      { title: "Documentation", href: "/docs" },
      { title: "About", href: "/about" },
      { title: "Submit a Report", href: "/reports/new" },
    ],
  },
  {
    title: "Community",
    links: [
      { title: "GitHub", href: siteConfig.githubUrl },
      { title: "Twitter / X", href: siteConfig.twitterUrl },
    ],
  },
]

export function MarketingFooter() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="col-span-2 space-y-3 md:col-span-1">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldHalf className="text-primary size-5" />
            {siteConfig.shortName}
          </div>
          <p className="text-muted-foreground max-w-xs text-sm">
            {siteConfig.description}
          </p>
        </div>

        {footerLinks.map((group) => (
          <div key={group.title} className="space-y-3">
            <h3 className="text-sm font-medium">{group.title}</h3>
            <ul className="space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="text-muted-foreground border-t px-4 py-6 text-center text-xs sm:px-6">
        © {new Date().getFullYear()} {siteConfig.name}. Community-driven and open source.
      </div>
    </footer>
  )
}
