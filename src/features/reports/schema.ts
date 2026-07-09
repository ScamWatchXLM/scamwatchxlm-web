import { z } from "zod"

export const reportFormSchema = z.object({
  targetKind: z.enum(["account", "asset", "issuer", "transaction"]),
  targetId: z
    .string()
    .min(5, "Enter the account, asset, issuer, or transaction identifier")
    .max(120),
  title: z
    .string()
    .min(8, "Title must be at least 8 characters")
    .max(120, "Title must be under 120 characters"),
  category: z.enum([
    "phishing",
    "rug_pull",
    "fake_token",
    "impersonation",
    "ponzi",
    "malicious_contract",
    "social_engineering",
    "other",
  ]),
  description: z
    .string()
    .min(40, "Please provide at least 40 characters of detail")
    .max(4000, "Description must be under 4000 characters"),
  reporterHandle: z
    .string()
    .min(2, "Handle must be at least 2 characters")
    .max(40, "Handle must be under 40 characters"),
  evidenceFileNames: z.array(z.string()).max(5, "Attach at most 5 files"),
  agreeToGuidelines: z.literal(true, {
    error: "You must confirm this report is accurate and submitted in good faith",
  }),
})

export type ReportFormValues = z.infer<typeof reportFormSchema>

export const REPORT_FORM_STEPS = [
  { id: "target", title: "Target", fields: ["targetKind", "targetId"] as const },
  {
    id: "details",
    title: "Details",
    fields: ["title", "category", "description", "reporterHandle"] as const,
  },
  {
    id: "evidence",
    title: "Evidence",
    fields: ["evidenceFileNames", "agreeToGuidelines"] as const,
  },
  { id: "preview", title: "Preview", fields: [] as const },
] as const
