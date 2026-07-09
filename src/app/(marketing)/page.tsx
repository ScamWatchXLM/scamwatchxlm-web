import Link from "next/link"
import type { Metadata } from "next"
import {
  ArrowRight,
  Bell,
  FileWarning,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HeroStats } from "@/components/marketing/hero-stats"
import { FadeIn } from "@/components/shared/fade-in"

export const metadata: Metadata = {
  title: "Public Scam Intelligence for the Stellar Network",
}

const features = [
  {
    icon: ShieldCheck,
    title: "Risk Scoring",
    description:
      "Every account, asset, and issuer is continuously scored using on-chain heuristics and community reports.",
  },
  {
    icon: Bell,
    title: "Live Alerts",
    description:
      "Real-time detection of suspicious trustline growth, liquidity drains, and known scam signatures.",
  },
  {
    icon: FileWarning,
    title: "Community Reports",
    description:
      "Anyone can submit evidence-backed reports; a transparent review pipeline keeps the data trustworthy.",
  },
  {
    icon: Search,
    title: "Deep Investigation",
    description:
      "Trace connected entities, transaction timelines, and trustline history from a single search.",
  },
  {
    icon: TrendingUp,
    title: "Network Analytics",
    description:
      "Track scam trends, category breakdowns, and network-wide activity over time.",
  },
  {
    icon: Users,
    title: "Open & Extensible",
    description:
      "Fully open-source with a typed API client, ready for community-built integrations.",
  },
]

export default function LandingPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, var(--chart-1) 0%, transparent 35%), radial-gradient(circle at 80% 0%, var(--chart-6) 0%, transparent 30%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:px-6">
          <FadeIn>
            <span className="bg-muted/50 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
              <ShieldCheck className="size-3.5" /> Community-driven · Open source
            </span>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Public scam intelligence for the Stellar network
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg text-balance">
              Track, report, and investigate scams across XLM accounts, assets, and
              issuers — with live risk scoring, real-time alerts, and a transparent
              community reporting pipeline.
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Open Dashboard <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/reports/new">Submit a Report</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-muted/20 border-b py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <HeroStats />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Everything you need to stay ahead of scams
          </h2>
          <p className="text-muted-foreground mt-3">
            A single pane of glass for network-wide risk signals, built for researchers,
            developers, and everyday holders.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.04}>
              <Card className="h-full">
                <CardHeader>
                  <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                    <feature.icon className="size-5" />
                  </div>
                  <CardTitle className="mt-3">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="bg-muted/20 border-t">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight text-balance">
            Spotted something suspicious on the Stellar network?
          </h2>
          <p className="text-muted-foreground max-w-xl">
            Help protect the ecosystem — submit a report in minutes. Every submission is
            reviewed against on-chain signals before publication.
          </p>
          <Button size="lg" asChild>
            <Link href="/reports/new">
              Submit a Report <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
