/**
 * Core domain types shared across the ScamWatchXLM dashboard.
 *
 * These mirror the shape of the (not-yet-public) ScamWatchXLM API. Keep this
 * file the single source of truth for domain shapes — API client functions,
 * mock generators, and UI components should all import from here rather than
 * re-declaring shapes locally.
 */

export type RiskLevel = "low" | "medium" | "high" | "critical"

export type EntityKind = "account" | "asset" | "issuer" | "transaction"

export type ReportStatus = "pending" | "approved" | "rejected" | "escalated"

export type ReportCategory =
  | "phishing"
  | "rug_pull"
  | "fake_token"
  | "impersonation"
  | "ponzi"
  | "malicious_contract"
  | "social_engineering"
  | "other"

export type AlertSeverity = "info" | "warning" | "danger" | "critical"

export interface RiskScore {
  value: number // 0-100
  level: RiskLevel
  updatedAt: string
  factors: RiskFactor[]
}

export interface RiskFactor {
  label: string
  weight: number // contribution to score, 0-100
  description: string
}

export interface StellarAsset {
  id: string
  code: string
  issuer: string
  issuerName?: string
  domain?: string
  riskScore: RiskScore
  trustlineCount: number
  holderCount: number
  volume24h: number
  marketCapEstimate?: number
  category: AssetCategory
  createdAt: string
  flagged: boolean
  verified: boolean
}

export type AssetCategory =
  "defi" | "stablecoin" | "meme" | "utility" | "nft" | "wrapped" | "unknown"

export interface Account {
  id: string // Stellar public key (G...)
  label?: string
  riskScore: RiskScore
  createdAt: string
  lastActivityAt: string
  transactionCount: number
  reportCount: number
  balanceXlm: number
  connectedEntities: ConnectedEntity[]
  flagged: boolean
  tags: string[]
}

export interface ConnectedEntity {
  id: string
  kind: EntityKind
  label: string
  relationship: string
  riskLevel: RiskLevel
}

export interface Issuer {
  id: string // Stellar public key
  name?: string
  domain?: string
  riskScore: RiskScore
  issuedAssets: string[] // asset ids
  trustlineCount: number
  createdAt: string
  verified: boolean
  reportCount: number
}

export interface Transaction {
  hash: string
  ledger: number
  createdAt: string
  sourceAccount: string
  destinationAccount?: string
  operationType: string
  assetCode?: string
  amount?: string
  memo?: string
  riskScore: RiskScore
  flagged: boolean
  feeCharged: number
}

export interface ScamReport {
  id: string
  title: string
  category: ReportCategory
  status: ReportStatus
  severity: AlertSeverity
  description: string
  targetKind: EntityKind
  targetId: string
  targetLabel: string
  reporterHandle: string
  createdAt: string
  updatedAt: string
  evidenceUrls: string[]
  upvotes: number
  downvotes: number
  reviewerNote?: string
}

/** A community member's vote on whether a report is accurate. */
export type ReportVote = "confirm" | "dispute"

export interface Alert {
  id: string
  severity: AlertSeverity
  title: string
  description: string
  entityKind: EntityKind
  entityId: string
  entityLabel: string
  createdAt: string
  acknowledged: boolean
}

export interface NetworkStats {
  totalAccountsMonitored: number
  totalAssetsTracked: number
  totalIssuersTracked: number
  totalReports: number
  totalAlerts24h: number
  averageRiskScore: number
  activeInvestigations: number
  updatedAt: string
}

export interface TrendingScam {
  id: string
  title: string
  category: ReportCategory
  reportCount24h: number
  reportCountTotal: number
  relatedEntityIds: string[]
  trendDelta: number // percentage change
}

export interface TimelineEvent {
  id: string
  timestamp: string
  type: string
  title: string
  description: string
  severity?: AlertSeverity
}

export interface AdminUser {
  id: string
  handle: string
  email: string
  role: "admin" | "moderator" | "analyst" | "viewer"
  reportsSubmitted: number
  reportsReviewed: number
  joinedAt: string
  status: "active" | "suspended"
}

export interface AdminLogEntry {
  id: string
  actorHandle: string
  action: string
  target: string
  timestamp: string
  metadata?: Record<string, string>
}

export interface Reporter {
  handle: string
  reportsSubmitted: number
  reportsApproved: number
  accuracyRate: number
  rank: number
}

export interface AnalyticsSeriesPoint {
  date: string
  value: number
}

export interface AnalyticsCategoryBreakdown {
  category: string
  count: number
  percentage: number
}

export interface SearchResult {
  kind: EntityKind | "report"
  id: string
  label: string
  subtitle?: string
  riskLevel?: RiskLevel
  href: string
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasNextPage: boolean
}
