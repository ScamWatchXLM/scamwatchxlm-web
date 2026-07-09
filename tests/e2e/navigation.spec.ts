import { test, expect } from "@playwright/test"

test.describe("primary navigation", () => {
  test("landing page loads and links to the dashboard", async ({ page }) => {
    await page.goto("/")
    await expect(
      page.getByRole("heading", { name: /public scam intelligence/i })
    ).toBeVisible()
    await page.getByRole("link", { name: "Open Dashboard" }).last().click()
    await page.waitForURL(/\/dashboard/)
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test("dashboard renders network stats and key sections", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible()
    await expect(page.getByText("Accounts Monitored")).toBeVisible()
    await expect(page.getByText("Recent Alerts")).toBeVisible()
  })

  test("sidebar links navigate to each primary section", async ({ page }) => {
    await page.goto("/dashboard")

    const sections: [string, string][] = [
      ["Assets", "/assets"],
      ["Accounts", "/accounts"],
      ["Issuers", "/issuers"],
      ["Transactions", "/transactions"],
      ["Reports", "/reports"],
      ["Analytics", "/analytics"],
    ]

    for (const [label, path] of sections) {
      await page.getByRole("link", { name: label, exact: true }).click()
      await page.waitForURL(new RegExp(path), { timeout: 15_000 })
    }
  })

  test("unknown route renders the 404 page", async ({ page }) => {
    await page.goto("/this-route-does-not-exist")
    await expect(page.getByText("404")).toBeVisible()
  })
})
