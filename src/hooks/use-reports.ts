import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  castReportVote,
  getRelatedReports,
  getReport,
  getReports,
  submitReport,
  updateReportStatus,
  type ListReportsParams,
  type SubmitReportInput,
} from "@/lib/api/reports"
import { queryKeys } from "@/lib/api/query-keys"
import { useReportVotesStore } from "@/stores/report-votes-store"
import type { EntityKind, ReportStatus, ReportVote, ScamReport } from "@/types/domain"

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

interface CastVoteVariables {
  id: string
  /** The vote the click should result in — `null` retracts an existing vote. */
  nextVote: ReportVote | null
  /** The browser's vote going into this click, read from the vote store by the caller. */
  previousVote: ReportVote | null
}

/**
 * Casts, changes, or retracts the current browser's confirm/dispute vote on
 * a report, optimistically updating both the report's vote counts and the
 * local vote-store record of "how did I vote" so the UI reflects it
 * instantly and survives a refresh.
 */
export function useCastReportVote() {
  const queryClient = useQueryClient()
  const setVote = useReportVotesStore((s) => s.setVote)

  return useMutation({
    mutationFn: ({ id, nextVote, previousVote }: CastVoteVariables) =>
      castReportVote(id, nextVote, previousVote),
    onMutate: async ({ id, nextVote, previousVote }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.reports.detail(id) })
      const previousReport = queryClient.getQueryData<ScamReport>(queryKeys.reports.detail(id))
      if (previousReport) {
        let { upvotes, downvotes } = previousReport
        if (previousVote === "confirm") upvotes = Math.max(0, upvotes - 1)
        if (previousVote === "dispute") downvotes = Math.max(0, downvotes - 1)
        if (nextVote === "confirm") upvotes += 1
        if (nextVote === "dispute") downvotes += 1
        queryClient.setQueryData(queryKeys.reports.detail(id), {
          ...previousReport,
          upvotes,
          downvotes,
        })
      }
      setVote(id, nextVote)
      return { previousReport, previousVote }
    },
    onError: (_err, { id }, context) => {
      if (context?.previousReport) {
        queryClient.setQueryData(queryKeys.reports.detail(id), context.previousReport)
      }
      setVote(id, context?.previousVote ?? null)
      toast.error("Failed to record your vote")
    },
    onSettled: () => {
      // Broad invalidation: a vote changes both this report's detail view and
      // its row in the reports list (Votes column, verified badge).
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all })
    },
  })
}
