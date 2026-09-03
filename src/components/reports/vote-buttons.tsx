"use client"

import { BadgeCheck, ThumbsDown, ThumbsUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCastReportVote } from "@/hooks/use-reports"
import { getNetConfirmations, isCommunityVerified } from "@/lib/reports"
import { cn } from "@/lib/utils"
import { useReportVotesStore } from "@/stores/report-votes-store"
import type { ScamReport } from "@/types/domain"

export function VoteButtons({ report }: { report: ScamReport }) {
  const myVote = useReportVotesStore((s) => s.votes[report.id]) ?? null
  const castVote = useCastReportVote()

  const vote = (choice: "confirm" | "dispute") => {
    castVote.mutate({
      id: report.id,
      nextVote: myVote === choice ? null : choice,
      previousVote: myVote,
    })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className={cn(
            "flex-1",
            myVote === "confirm" &&
              "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          )}
          disabled={castVote.isPending}
          aria-pressed={myVote === "confirm"}
          onClick={() => vote("confirm")}
        >
          <ThumbsUp className="size-4" /> Confirm ({report.upvotes})
        </Button>
        <Button
          variant="outline"
          className={cn(
            "flex-1",
            myVote === "dispute" &&
              "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400"
          )}
          disabled={castVote.isPending}
          aria-pressed={myVote === "dispute"}
          onClick={() => vote("dispute")}
        >
          <ThumbsDown className="size-4" /> Dispute ({report.downvotes})
        </Button>
      </div>

      {isCommunityVerified(report) ? (
        <Badge
          variant="outline"
          className="w-full justify-center border-emerald-500/20 bg-emerald-500/10 py-1 text-emerald-600 dark:text-emerald-400"
        >
          <BadgeCheck className="size-3.5" /> Community Verified ·{" "}
          {getNetConfirmations(report)} net confirmations
        </Badge>
      ) : (
        <p className="text-muted-foreground text-center text-xs">
          {getNetConfirmations(report)} net confirmations
        </p>
      )}
    </div>
  )
}
