/**
 * Centralized React Query key factory. Keeping keys here avoids typos and
 * makes cache invalidation (e.g. after submitting a report) predictable.
 */
export const queryKeys = {
  assets: {
    all: ["assets"] as const,
    list: (params: unknown) => ["assets", "list", params] as const,
    detail: (id: string) => ["assets", "detail", id] as const,
    timeline: (id: string) => ["assets", "timeline", id] as const,
  },
  accounts: {
    all: ["accounts"] as const,
    list: (params: unknown) => ["accounts", "list", params] as const,
    detail: (id: string) => ["accounts", "detail", id] as const,
    timeline: (id: string) => ["accounts", "timeline", id] as const,
  },
  issuers: {
    all: ["issuers"] as const,
    list: (params: unknown) => ["issuers", "list", params] as const,
    detail: (id: string) => ["issuers", "detail", id] as const,
    assets: (id: string) => ["issuers", "assets", id] as const,
    timeline: (id: string) => ["issuers", "timeline", id] as const,
  },
  transactions: {
    all: ["transactions"] as const,
    list: (params: unknown) => ["transactions", "list", params] as const,
    detail: (hash: string) => ["transactions", "detail", hash] as const,
    byAccount: (accountId: string) => ["transactions", "by-account", accountId] as const,
  },
  reports: {
    all: ["reports"] as const,
    list: (params: unknown) => ["reports", "list", params] as const,
    detail: (id: string) => ["reports", "detail", id] as const,
    related: (entityId: string) => ["reports", "related", entityId] as const,
  },
  alerts: {
    all: ["alerts"] as const,
    list: (params: unknown) => ["alerts", "list", params] as const,
    recent: (limit: number) => ["alerts", "recent", limit] as const,
  },
  analytics: {
    scamTrend: ["analytics", "scam-trend"] as const,
    dailyAlerts: ["analytics", "daily-alerts"] as const,
    networkActivity: ["analytics", "network-activity"] as const,
    riskDistribution: ["analytics", "risk-distribution"] as const,
    categoryBreakdown: ["analytics", "category-breakdown"] as const,
    assetCategoryBreakdown: ["analytics", "asset-category-breakdown"] as const,
    topReporters: (limit: number) => ["analytics", "top-reporters", limit] as const,
  },
  admin: {
    metrics: ["admin", "metrics"] as const,
    reportsQueue: (params: unknown) => ["admin", "reports-queue", params] as const,
    users: (params: unknown) => ["admin", "users", params] as const,
    logs: (params: unknown) => ["admin", "logs", params] as const,
    networkStats: ["admin", "network-stats"] as const,
  },
  search: {
    query: (q: string) => ["search", q] as const,
  },
  stats: {
    network: ["stats", "network"] as const,
    topAssets: (limit: number) => ["stats", "top-assets", limit] as const,
    topIssuers: (limit: number) => ["stats", "top-issuers", limit] as const,
    latestReports: (limit: number) => ["stats", "latest-reports", limit] as const,
  },
}
