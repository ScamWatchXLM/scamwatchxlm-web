import type { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = { title: "Documentation" }

const sections = [
  {
    id: "getting-started",
    title: "Getting started",
    body: (
      <>
        <p>
          Clone the repository and install dependencies with your package manager of
          choice, then start the dev server:
        </p>
        <pre className="bg-muted mt-3 overflow-x-auto rounded-lg p-4 text-sm">
          <code>{`git clone ${siteConfig.githubUrl}.git\ncd scamwatchxlm-web\nnpm install\nnpm run dev`}</code>
        </pre>
        <p className="mt-3">
          By default the app runs entirely against a deterministic mock data layer — no
          backend required. Set{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
            NEXT_PUBLIC_API_MODE=live
          </code>{" "}
          and{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
            NEXT_PUBLIC_API_BASE_URL
          </code>{" "}
          in <code className="bg-muted rounded px-1.5 py-0.5 text-sm">.env.local</code>{" "}
          once a real API exists.
        </p>
      </>
    ),
  },
  {
    id: "architecture",
    title: "Architecture",
    body: (
      <>
        <p>
          The app follows a feature-based architecture under{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-sm">src/</code>: route
          handlers in <code className="bg-muted rounded px-1.5 py-0.5 text-sm">app/</code>
          , cross-cutting UI in{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-sm">components/</code>,
          data access in{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-sm">lib/api/</code>, and
          React Query hooks in{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-sm">hooks/</code>. See{" "}
          <Link
            href="https://github.com/scamwatchxlm/scamwatchxlm-web/blob/main/docs/ARCHITECTURE.md"
            className="underline underline-offset-4"
          >
            ARCHITECTURE.md
          </Link>{" "}
          for the full breakdown.
        </p>
      </>
    ),
  },
  {
    id: "risk-scoring",
    title: "Risk scoring model",
    body: (
      <>
        <p>
          Every account, asset, issuer, and transaction carries a 0–100 risk score derived
          from weighted signals — holder concentration, trustline velocity, issuer age,
          community reports, and known-bad-actor correlation. Scores map to four levels:{" "}
          <strong>low</strong> (0–29), <strong>medium</strong> (30–59),{" "}
          <strong>high</strong> (60–84), and <strong>critical</strong> (85–100). The exact
          weighting is an extensibility point — see{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
            src/mocks/generators.ts
          </code>{" "}
          for the current mock heuristic library.
        </p>
      </>
    ),
  },
  {
    id: "api-client",
    title: "API client",
    body: (
      <>
        <p>
          All data access goes through typed functions in{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-sm">src/lib/api/</code>{" "}
          (e.g.{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-sm">getAssets()</code>,{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-sm">submitReport()</code>),
          wrapped by React Query hooks in{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-sm">src/hooks/</code>. Each
          resource module transparently switches between the mock data layer and a live
          REST backend based on{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
            NEXT_PUBLIC_API_MODE
          </code>
          , so UI code never needs to know which one is active.
        </p>
      </>
    ),
  },
  {
    id: "contributing",
    title: "Contributing",
    body: (
      <>
        <p>
          This project is intentionally left ~60–70% complete in several areas — real-time
          WebSocket wiring, the risk-scoring backend, the evidence upload pipeline, and
          the admin moderation workflow are all extensibility points documented inline
          with <code className="bg-muted rounded px-1.5 py-0.5 text-sm">{"// TODO"}</code>{" "}
          markers. See{" "}
          <Link
            href="https://github.com/scamwatchxlm/scamwatchxlm-web/blob/main/docs/DEVELOPER_GUIDE.md"
            className="underline underline-offset-4"
          >
            DEVELOPER_GUIDE.md
          </Link>{" "}
          before opening a pull request.
        </p>
      </>
    ),
  },
]

export default function DocsPage() {
  return (
    <div className="mx-auto flex max-w-5xl gap-10 px-4 py-16 sm:px-6">
      <nav className="sticky top-20 hidden h-fit w-48 shrink-0 space-y-1 text-sm md:block">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="text-muted-foreground hover:bg-muted hover:text-foreground block rounded-md px-3 py-1.5"
          >
            {s.title}
          </a>
        ))}
      </nav>
      <div className="min-w-0 flex-1 space-y-12">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Documentation</h1>
          <p className="text-muted-foreground mt-2">
            Everything you need to run, extend, and contribute to {siteConfig.name}.
          </p>
        </div>
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-20 space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">{s.title}</h2>
            <div className="text-muted-foreground [&_strong]:text-foreground text-sm leading-relaxed">
              {s.body}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
