import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ReportVote } from "@/types/domain"

interface ReportVotesState {
  votes: Record<string, ReportVote>
  setVote: (reportId: string, vote: ReportVote | null) => void
}

/**
 * Tracks which way the current browser voted on each report, so the UI can
 * show the active vote and stop someone re-voting on refresh. There's no
 * auth layer yet, so this is a per-browser stand-in for a real per-account
 * vote record once a backend exists.
 */
export const useReportVotesStore = create<ReportVotesState>()(
  persist(
    (set) => ({
      votes: {},
      setVote: (reportId, vote) =>
        set((state) => {
          const votes = { ...state.votes }
          if (vote === null) {
            delete votes[reportId]
          } else {
            votes[reportId] = vote
          }
          return { votes }
        }),
    }),
    { name: "scamwatchxlm-report-votes" }
  )
)
