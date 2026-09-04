import type { ScamReport } from "@/types/domain"

/** Minimum net confirmations before a report can be marked community-verified. */
const VERIFIED_MIN_NET_VOTES = 10
/** Minimum share of confirm votes (of all votes cast) required alongside the net-vote floor. */
const VERIFIED_MIN_CONFIRM_RATIO = 0.75

export function getNetConfirmations(report: Pick<ScamReport, "upvotes" | "downvotes">): number {
  return report.upvotes - report.downvotes
}

/**
 * A report is "Community Verified" once it has cleared a minimum number of
 * net confirmations (upvotes minus downvotes) and confirm votes make up most
 * of the total votes cast — a small brigade of disputes on an otherwise
 * heavily-confirmed report shouldn't flip verification, but a report that's
 * merely popular without a clear consensus shouldn't qualify either.
 */
export function isCommunityVerified(
  report: Pick<ScamReport, "upvotes" | "downvotes">
): boolean {
  const totalVotes = report.upvotes + report.downvotes
  if (totalVotes === 0) return false
  const net = getNetConfirmations(report)
  const confirmRatio = report.upvotes / totalVotes
  return net >= VERIFIED_MIN_NET_VOTES && confirmRatio >= VERIFIED_MIN_CONFIRM_RATIO
}
