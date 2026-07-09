import { test, expect } from "@playwright/test"

test("submitting a report walks through all four steps to confirmation", async ({
  page,
}) => {
  await page.goto("/reports/new")

  // Step 1: Target
  await expect(page.getByRole("heading", { name: "Submit a Report" })).toBeVisible()
  await page
    .getByPlaceholder("Account address, asset code, issuer address, or tx hash")
    .fill("GABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF")
  await page.getByRole("button", { name: "Next", exact: true }).click()

  // Step 2: Details
  await page
    .getByPlaceholder(/Fake wallet login page/)
    .fill("Test phishing page impersonating a wallet login")
  await page
    .getByPlaceholder(/Describe what happened/)
    .fill(
      "This is a detailed test description of the scam that is definitely over forty characters long."
    )
  await page.getByPlaceholder(/How should reviewers credit/).fill("e2e_test_reporter")
  await page.getByRole("button", { name: "Next", exact: true }).click()

  // Step 3: Evidence — skip file upload, accept guidelines
  await page.locator('button[role="checkbox"]').click()
  await page.getByRole("button", { name: "Next", exact: true }).click()

  // Step 4: Preview
  await expect(page.getByText("Review before submitting")).toBeVisible()
  await expect(page.getByText("e2e_test_reporter")).toBeVisible()
  await page.getByRole("button", { name: "Submit Report" }).click()

  // Confirmation
  await expect(page.getByRole("heading", { name: "Report submitted" })).toBeVisible()
  await expect(page.getByText(/^RPT-/)).toBeVisible()
})

test("target identifier is required before advancing", async ({ page }) => {
  await page.goto("/reports/new")
  await page.getByRole("button", { name: "Next", exact: true }).click()
  await expect(
    page.getByText("Enter the account, asset, issuer, or transaction identifier")
  ).toBeVisible()
})
