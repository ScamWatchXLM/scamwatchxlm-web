"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { StepIndicator } from "@/components/reports/step-indicator"
import { EvidenceUpload } from "@/components/reports/evidence-upload"
import { ReportStatusBadge } from "@/components/shared/report-status-badge"
import { useSubmitReport } from "@/hooks/use-reports"
import {
  REPORT_FORM_STEPS,
  reportFormSchema,
  type ReportFormValues,
} from "@/features/reports/schema"
import type { ScamReport } from "@/types/domain"

const CATEGORY_OPTIONS: { value: ReportFormValues["category"]; label: string }[] = [
  { value: "phishing", label: "Phishing" },
  { value: "rug_pull", label: "Rug Pull" },
  { value: "fake_token", label: "Fake Token" },
  { value: "impersonation", label: "Impersonation" },
  { value: "ponzi", label: "Ponzi / Pyramid Scheme" },
  { value: "malicious_contract", label: "Malicious Contract" },
  { value: "social_engineering", label: "Social Engineering" },
  { value: "other", label: "Other" },
]

export function ReportWizard() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(0)
  const [submittedReport, setSubmittedReport] = useState<ScamReport | null>(null)
  const submitReport = useSubmitReport()

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    mode: "onTouched",
    defaultValues: {
      targetKind:
        (searchParams.get("targetKind") as ReportFormValues["targetKind"]) ?? "account",
      targetId: searchParams.get("targetId") ?? "",
      title: "",
      category: "phishing",
      description: "",
      reporterHandle: "",
      evidenceFileNames: [],
      agreeToGuidelines: undefined as unknown as true,
    },
  })

  async function goNext() {
    const fields = REPORT_FORM_STEPS[step].fields as unknown as (keyof ReportFormValues)[]
    const valid = fields.length === 0 || (await form.trigger(fields))
    if (valid) setStep((s) => Math.min(s + 1, REPORT_FORM_STEPS.length - 1))
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0))
  }

  async function onSubmit(values: ReportFormValues) {
    const report = await submitReport.mutateAsync({
      title: values.title,
      category: values.category,
      description: values.description,
      targetKind: values.targetKind,
      targetId: values.targetId,
      evidenceUrls: values.evidenceFileNames,
      reporterHandle: values.reporterHandle,
    })
    setSubmittedReport(report)
  }

  if (submittedReport) return <ReportConfirmation report={submittedReport} />

  const values = form.watch()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <StepIndicator steps={REPORT_FORM_STEPS} currentStep={step} />

        <Card>
          <CardContent className="space-y-5 pt-6">
            {step === 0 && (
              <>
                <FormField
                  control={form.control}
                  name="targetKind"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What are you reporting?</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="account">Account</SelectItem>
                          <SelectItem value="asset">Asset</SelectItem>
                          <SelectItem value="issuer">Issuer</SelectItem>
                          <SelectItem value="transaction">Transaction</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Identifier</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Account address, asset code, issuer address, or tx hash"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Paste the exact address, code, or hash you want to report.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Fake wallet login page mimicking Lobstr"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORY_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={6}
                          placeholder="Describe what happened, when, and how you identified it as a scam…"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length ?? 0}/4000 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reporterHandle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your handle</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="How should reviewers credit this report?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {step === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="evidenceFileNames"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Evidence (optional)</FormLabel>
                      <FormControl>
                        <EvidenceUpload
                          fileNames={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agreeToGuidelines"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start gap-3 rounded-lg border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value === true}
                          onCheckedChange={(v) => field.onChange(v === true)}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-normal">
                          I confirm this report is accurate to the best of my knowledge
                          and submitted in good faith.
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-muted-foreground text-sm font-medium">
                  Review before submitting
                </h3>
                <dl className="divide-y">
                  <PreviewRow
                    label="Target"
                    value={`${values.targetKind} · ${values.targetId || "—"}`}
                  />
                  <PreviewRow label="Title" value={values.title || "—"} />
                  <PreviewRow
                    label="Category"
                    value={
                      CATEGORY_OPTIONS.find((c) => c.value === values.category)?.label ??
                      "—"
                    }
                  />
                  <PreviewRow
                    label="Description"
                    value={values.description || "—"}
                    multiline
                  />
                  <PreviewRow
                    label="Reporter handle"
                    value={values.reporterHandle || "—"}
                  />
                  <PreviewRow
                    label="Evidence files"
                    value={
                      values.evidenceFileNames.length
                        ? values.evidenceFileNames.join(", ")
                        : "None attached"
                    }
                  />
                </dl>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" onClick={goBack} disabled={step === 0}>
            <ArrowLeft className="size-4" /> Back
          </Button>
          {step < REPORT_FORM_STEPS.length - 1 ? (
            <Button key="next-button" type="button" onClick={goNext}>
              Next <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button key="submit-button" type="submit" disabled={submitReport.isPending}>
              {submitReport.isPending && <Loader2 className="size-4 animate-spin" />}
              Submit Report
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}

function PreviewRow({
  label,
  value,
  multiline,
}: {
  label: string
  value: string
  multiline?: boolean
}) {
  return (
    <div className="py-3">
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd
        className={
          multiline ? "mt-1 text-sm whitespace-pre-wrap" : "mt-1 text-sm font-medium"
        }
      >
        {value}
      </dd>
    </div>
  )
}

function ReportConfirmation({ report }: { report: ScamReport }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
        <CheckCircle2 className="size-12 text-emerald-500" />
        <div>
          <h2 className="text-xl font-semibold">Report submitted</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Thank you — your report is now in the review queue.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border px-4 py-2">
          <span className="font-mono text-sm">{report.id}</span>
          <ReportStatusBadge status={report.status} />
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link href={`/reports/${report.id}`}>View Report</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/reports">Back to Reports</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
