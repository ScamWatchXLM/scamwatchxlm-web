import {
  generateAccount,
  generateAdminLog,
  generateAdminUser,
  generateAlert,
  generateAsset,
  generateIssuer,
  generateReport,
  generateReporter,
  generateTransaction,
  generateTrendingScam,
} from "./generators"
import type {
  Account,
  AdminLogEntry,
  AdminUser,
  Alert,
  Issuer,
  Reporter,
  ScamReport,
  StellarAsset,
  Transaction,
  TrendingScam,
} from "@/types/domain"

/**
 * In-memory mock "database". Generated once per process using deterministic
 * seeds so the data is stable across server and client renders. Swap
 * `env.apiMode` to "live" and implement the fetchers in `src/lib/api/` to
 * replace this with a real backend — the shapes already match.
 */

function buildCollection<T>(
  prefix: string,
  count: number,
  gen: (seed: string, index: number) => T
): T[] {
  return Array.from({ length: count }, (_, i) => gen(`${prefix}-${i}`, i))
}

export const mockAssets: StellarAsset[] = buildCollection("asset", 120, generateAsset)
export const mockAccounts: Account[] = buildCollection("account", 160, (seed) =>
  generateAccount(seed)
)
export const mockIssuers: Issuer[] = buildCollection("issuer", 60, (seed) =>
  generateIssuer(seed)
)
export const mockTransactions: Transaction[] = buildCollection("tx", 200, (seed) =>
  generateTransaction(seed)
)
export const mockReports: ScamReport[] = buildCollection("report", 140, (seed) =>
  generateReport(seed)
)
export const mockAlerts: Alert[] = buildCollection("alert", 80, (seed) =>
  generateAlert(seed)
).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
export const mockTrendingScams: TrendingScam[] = buildCollection("trend", 8, (seed) =>
  generateTrendingScam(seed)
)
export const mockAdminUsers: AdminUser[] = buildCollection("user", 40, (seed) =>
  generateAdminUser(seed)
)
export const mockAdminLogs: AdminLogEntry[] = buildCollection("log", 60, (seed) =>
  generateAdminLog(seed)
).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
export const mockReporters: Reporter[] = buildCollection("reporter", 20, (seed, i) =>
  generateReporter(seed, i + 1)
)
