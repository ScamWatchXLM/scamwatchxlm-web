import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getRelatedReports,
  getReport,
  getReports,
  submitReport,
  updateReportStatus,
  type ListReportsParams,
  type SubmitReportInput,
} from "@/lib/api/reports"
import { queryKeys } from "@/lib/api/query-keys"
import type { EntityKind, ReportStatus, ScamReport } from "@/types/domain"

export function useReports(params: ListReportsParams = {}) {
  return useQuery({
    queryKey: queryKeys.reports.list(params),
    queryFn: () => getReports(params),
    placeholderData: (previous) => previous,
  })
}

export function useReport(id: string) {
  return useQuery({
    queryKey: queryKeys.reports.detail(id),
    queryFn: () => getReport(id),
    enabled: Boolean(id),
  })
}

export function useRelatedReports(
  entityId: string,
  entityKind: EntityKind,
  entityLabel: string
) {
  return useQuery({
    queryKey: queryKeys.reports.related(entityId),
    queryFn: () => getRelatedReports(entityId, entityKind, entityLabel),
    enabled: Boolean(entityId),
  })
}

export function useSubmitReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: SubmitReportInput) => submitReport(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all })
      toast.success("Report submitted for review")
    },
    onError: () => {
      toast.error("Failed to submit report. Please try again.")
    },
  })
}

/** Optimistically flips a report's status before the server confirms it (admin review actions). */
export function useUpdateReportStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
      reviewerNote,
    }: {
      id: string
      status: ReportStatus
      reviewerNote?: string
    }) => updateReportStatus(id, status, reviewerNote),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.reports.detail(id) })
      const previous = queryClient.getQueryData<ScamReport>(queryKeys.reports.detail(id))
      if (previous) {
        queryClient.setQueryData(queryKeys.reports.detail(id), { ...previous, status })
      }
      return { previous }
    },
    onError: (_err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.reports.detail(variables.id), context.previous)
      }
      toast.error("Failed to update report status")
    },
    onSuccess: (_data, variables) => {
      toast.success(`Report marked as ${variables.status}`)
    },
    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reportsQueue({}) })
    },
  })
}
