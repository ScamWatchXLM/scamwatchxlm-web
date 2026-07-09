import type { Metadata } from "next"
import { Code2, AtSign, ShieldHalf } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { siteConfig } from "@/config/site"
import Link from "next/link"

export const metadata: Metadata = { title: "About" }

const principles = [
  {
    title: "Transparency by default",
    description:
      "Every risk score is broken down into the factors that produced it. Reports go through a visible review pipeline, not a black box.",
  },
  {
    title: "Community-powered",
    description:
      "Anyone can submit a report. Reviewers cross-reference submissions against on-chain signals before publication.",
  },
  {
    title: "Open source",
    description:
      "The full dashboard, API client, and data model are open source — built for contributors to extend and audit.",
  },
  {
    title: "No custody, ever",
    description:
      "ScamWatchXLM never asks for a seed phrase, private key, or wallet connection. We only observe public ledger data.",
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <ShieldHalf className="text-primary size-12" />
        <h1 className="text-3xl font-semibold tracking-tight">About {siteConfig.name}</h1>
        <p className="text-muted-foreground max-w-2xl">{siteConfig.description}</p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {principles.map((p) => (
          <Card key={p.title}>
            <CardHeader>
              <CardTitle>{p.title}</CardTitle>
              <CardDescription>{p.description}</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </div>

      <div className="mt-16 space-y-4 text-center">
        <h2 className="text-xl font-semibold">Get involved</h2>
        <p className="text-muted-foreground mx-auto max-w-xl text-sm">
          This project is built in the open. File an issue, contribute a heuristic, or
          help triage reports — every contribution makes the Stellar network safer.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" asChild>
            <Link href={siteConfig.githubUrl}>
              <Code2 className="size-4" /> GitHub
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={siteConfig.twitterUrl}>
              <AtSign className="size-4" /> Twitter / X
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
