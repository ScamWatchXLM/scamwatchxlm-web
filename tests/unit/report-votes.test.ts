import { describe, expect, it } from "vitest"
import { getNetConfirmations, isCommunityVerified } from "@/lib/reports"

describe("getNetConfirmations", () => {
  it("subtracts downvotes from upvotes", () => {
    expect(getNetConfirmations({ upvotes: 15, downvotes: 4 })).toBe(11)
  })
})

describe("isCommunityVerified", () => {
  it("is false with no votes", () => {
    expect(isCommunityVerified({ upvotes: 0, downvotes: 0 })).toBe(false)
  })

  it("is false below the net-confirmation floor even with a clean ratio", () => {
    expect(isCommunityVerified({ upvotes: 5, downvotes: 0 })).toBe(false)
  })

  it("is false when net confirmations are high but consensus is weak", () => {
    // 20 net, but only 67% confirm ratio — a real dispute, not consensus.
    expect(isCommunityVerified({ upvotes: 40, downvotes: 20 })).toBe(false)
  })

  it("is true once both the net-vote floor and confirm ratio are cleared", () => {
    expect(isCommunityVerified({ upvotes: 44, downvotes: 3 })).toBe(true)
  })

  it("is true right at the threshold boundary", () => {
    // net = 10, ratio = 10/10 = 100%
    expect(isCommunityVerified({ upvotes: 10, downvotes: 0 })).toBe(true)
  })
})
