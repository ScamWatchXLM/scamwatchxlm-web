import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { EmptyState } from "@/components/shared/empty-state"

describe("EmptyState", () => {
  it("renders the title and description", () => {
    render(<EmptyState title="No results" description="Try a different search." />)
    expect(screen.getByText("No results")).toBeInTheDocument()
    expect(screen.getByText("Try a different search.")).toBeInTheDocument()
  })

  it("renders optional action content", () => {
    render(<EmptyState title="Empty" action={<button>Retry</button>} />)
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument()
  })
})
