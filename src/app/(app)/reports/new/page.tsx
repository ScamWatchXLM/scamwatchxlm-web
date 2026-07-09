import { Suspense } from "react"
import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { ReportWizard } from "@/components/reports/report-wizard"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = { title: "Submit a Report" }

export default function NewReportPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Submit a Report"
        description="Help protect the Stellar network — report suspicious accounts, assets, issuers, or transactions."
      />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <ReportWizard />
      </Suspense>
    </div>
  )
}
