import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { RiskBadge } from "@/components/shared/risk-badge"

describe("RiskBadge", () => {
  it("renders the label for a given risk level", () => {
    render(<RiskBadge level="critical" />)
    expect(screen.getByText("Critical Risk")).toBeInTheDocument()
  })

  it("shows the numeric score when provided", () => {
    render(<RiskBadge level="high" score={72.4} />)
    expect(screen.getByText(/72/)).toBeInTheDocument()
  })

  it("omits the icon when showIcon is false", () => {
    const { container } = render(<RiskBadge level="low" showIcon={false} />)
    expect(container.querySelector("svg")).toBeNull()
  })
})
