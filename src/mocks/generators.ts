import { SeededRandom, shortId } from "./seed"
import { riskLevelFromScore } from "@/lib/utils/format"
import type {
  Account,
  AdminLogEntry,
  AdminUser,
  Alert,
  AlertSeverity,
  AnalyticsCategoryBreakdown,
  AnalyticsSeriesPoint,
  AssetCategory,
  ConnectedEntity,
  EntityKind,
  Issuer,
  NetworkStats,
  Paginated,
  Reporter,
  RiskFactor,
  RiskScore,
  ScamReport,
  ReportCategory,
  ReportStatus,
  SearchResult,
  StellarAsset,
  TimelineEvent,
  Transaction,
  TrendingScam,
} from "@/types/domain"

const ASSET_CODES = [
  "MOONX",
  "STELR",
  "YLDR",
  "GALX",
  "NOVA",
  "AQUAR",
  "LUMX",
  "VELOX",
  "ZEBRA",
  "TIDE",
  "FROST",
  "EMBER",
  "ORBIT",
  "PULSE",
  "RIFT",
]

const ASSET_CATEGORIES: AssetCategory[] = [
  "defi",
  "stablecoin",
  "meme",
  "utility",
  "nft",
  "wrapped",
  "unknown",
]

const REPORT_CATEGORIES: ReportCategory[] = [
  "phishing",
  "rug_pull",
  "fake_token",
  "impersonation",
  "ponzi",
  "malicious_contract",
  "social_engineering",
  "other",
]

const REPORT_STATUSES: ReportStatus[] = ["pending", "approved", "rejected", "escalated"]

const ALERT_SEVERITIES: AlertSeverity[] = ["info", "warning", "danger", "critical"]

const ENTITY_KINDS: EntityKind[] = ["account", "asset", "issuer", "transaction"]

const RISK_FACTOR_LIBRARY: Omit<RiskFactor, "weight">[] = [
  {
    label: "New issuer account",
    description: "Issuer account was created within the last 7 days.",
  },
  {
    label: "Sudden holder growth",
    description: "Holder count grew more than 500% in 24 hours.",
  },
  {
    label: "Concentrated supply",
    description: "Top 5 holders control over 80% of supply.",
  },
  {
    label: "No verified domain",
    description: "Asset has no linked / verified home domain (SEP-10).",
  },
  {
    label: "Reported by community",
    description: "Multiple independent community reports filed.",
  },
  {
    label: "Blacklisted counterpart",
    description: "Interacted with a known flagged account.",
  },
  {
    label: "Abnormal transaction velocity",
    description: "Transaction frequency far exceeds network baseline.",
  },
  {
    label: "Liquidity removed",
    description: "Large liquidity withdrawal detected shortly after listing.",
  },
  {
    label: "Clone of known brand",
    description: "Asset code or domain mimics an established project.",
  },
  {
    label: "Dormant reactivation",
    description: "Long-dormant account resumed activity abruptly.",
  },
]

const ORG_NAMES = [
  "Lumen Bridge",
  "Aquarius Labs",
  "Stellar Forge",
  "Orbit Exchange",
  "Nova Finance",
  "Tidewater DAO",
  "Frostbyte Capital",
  "Emberlink",
  "Riftline Protocol",
  "Pulsewave",
]

const REPORT_TITLES: Record<ReportCategory, string[]> = {
  phishing: [
    "Fake wallet login page",
    "Spoofed support DM requesting seed phrase",
    "Malicious QR code campaign",
  ],
  rug_pull: [
    "Liquidity pulled after presale",
    "Team wallet drained post-launch",
    "Fake yield vault exit scam",
  ],
  fake_token: [
    "Impersonation of major stablecoin",
    "Cloned ticker with fake domain",
    "Counterfeit LP token",
  ],
  impersonation: [
    "Fake support account on social media",
    "Cloned project website",
    "Impersonating core team member",
  ],
  ponzi: [
    "Guaranteed 40% weekly returns scheme",
    "Referral pyramid disguised as staking",
    "Fake arbitrage bot payouts",
  ],
  malicious_contract: [
    "Trustline drain via malicious claimable balance",
    "Approval exploit on swap contract",
    "Hidden fee siphon in router",
  ],
  social_engineering: [
    "Fake giveaway requiring deposit",
    "Impersonated exchange support",
    "Discord admin account takeover",
  ],
  other: [
    "Suspicious airdrop requiring signature",
    "Unverified bridge contract",
    "Anomalous account cluster",
  ],
}

const REPORTER_HANDLES = [
  "stellar_sentinel",
  "xlm_watchdog",
  "chain_auditor7",
  "lumen_detective",
  "trustline_tracker",
  "anon_reporter",
  "onchain_owl",
  "ledger_lookout",
]

function riskScore(rng: SeededRandom, baseline?: number): RiskScore {
  const value = baseline ?? rng.int(2, 98)
  const factorCount = rng.int(2, 4)
  const factors = rng.pickMany(RISK_FACTOR_LIBRARY, factorCount).map((f) => ({
    ...f,
    weight: rng.int(5, 35),
  }))
  return {
    value,
    level: riskLevelFromScore(value),
    updatedAt: rng.dateWithinDays(2),
    factors,
  }
}

export function generateAsset(seed: string, index: number): StellarAsset {
  const rng = new SeededRandom(seed)
  const code = `${rng.pick(ASSET_CODES)}${index % 7 === 0 ? rng.int(1, 99) : ""}`
  const flagged = rng.bool(0.28)
  return {
    id: `${code}-${shortId(seed)}`,
    code,
    issuer: rng.stellarPublicKey(),
    issuerName: rng.bool(0.6) ? rng.pick(ORG_NAMES) : undefined,
    domain: rng.bool(0.5) ? `${code.toLowerCase()}.io` : undefined,
    riskScore: riskScore(rng, flagged ? rng.int(55, 99) : rng.int(2, 60)),
    trustlineCount: rng.int(12, 48000),
    holderCount: rng.int(10, 32000),
    volume24h: rng.float(0, 2_500_000),
    marketCapEstimate: rng.bool(0.7) ? rng.float(1000, 40_000_000) : undefined,
    category: rng.pick(ASSET_CATEGORIES),
    createdAt: rng.dateWithinDays(400),
    flagged,
    verified: rng.bool(0.35),
  }
}

export function generateAccount(seed: string): Account {
  const rng = new SeededRandom(seed)
  const flagged = rng.bool(0.22)
  const connectedCount = rng.int(0, 5)
  const connectedEntities: ConnectedEntity[] = Array.from(
    { length: connectedCount },
    () => ({
      id: rng.stellarPublicKey(),
      kind: rng.pick(ENTITY_KINDS),
      label: rng.bool(0.5) ? rng.pick(ORG_NAMES) : "Unlabeled account",
      relationship: rng.pick([
        "frequent counterparty",
        "shared funding source",
        "co-signer",
        "trustline holder",
      ]),
      riskLevel: rng.pick(["low", "medium", "high", "critical"] as const),
    })
  )

  return {
    id: rng.stellarPublicKey(),
    label: rng.bool(0.3) ? rng.pick(ORG_NAMES) : undefined,
    riskScore: riskScore(rng, flagged ? rng.int(55, 99) : rng.int(2, 55)),
    createdAt: rng.dateWithinDays(900),
    lastActivityAt: rng.dateWithinDays(5),
    transactionCount: rng.int(1, 15000),
    reportCount: flagged ? rng.int(1, 24) : rng.int(0, 2),
    balanceXlm: rng.float(0, 250000),
    connectedEntities,
    flagged,
    tags: rng.bool(0.4)
      ? rng.pickMany(["exchange", "bot", "whale", "new", "dormant"], rng.int(1, 2))
      : [],
  }
}

export function generateIssuer(seed: string): Issuer {
  const rng = new SeededRandom(seed)
  const assetCount = rng.int(1, 6)
  return {
    id: rng.stellarPublicKey(),
    name: rng.bool(0.65) ? rng.pick(ORG_NAMES) : undefined,
    domain: rng.bool(0.55)
      ? `${rng.pick(ORG_NAMES).toLowerCase().replace(/\s+/g, "")}.com`
      : undefined,
    riskScore: riskScore(rng),
    issuedAssets: Array.from(
      { length: assetCount },
      (_, i) => generateAsset(`${seed}-asset-${i}`, i).id
    ),
    trustlineCount: rng.int(20, 60000),
    createdAt: rng.dateWithinDays(1200),
    verified: rng.bool(0.4),
    reportCount: rng.int(0, 40),
  }
}

const OPERATION_TYPES = [
  "payment",
  "path_payment_strict_send",
  "manage_sell_offer",
  "create_claimable_balance",
  "change_trust",
  "invoke_host_function",
]

export function generateTransaction(seed: string): Transaction {
  const rng = new SeededRandom(seed)
  const flagged = rng.bool(0.15)
  return {
    hash: rng.txHash(),
    ledger: rng.int(45_000_000, 52_000_000),
    createdAt: rng.dateWithinDays(30),
    sourceAccount: rng.stellarPublicKey(),
    destinationAccount: rng.bool(0.85) ? rng.stellarPublicKey() : undefined,
    operationType: rng.pick(OPERATION_TYPES),
    assetCode: rng.bool(0.7) ? rng.pick(ASSET_CODES) : "XLM",
    amount: rng.float(0.1, 500000).toFixed(2),
    memo: rng.bool(0.3)
      ? rng.pick(["payment", "ref:9931", "invoice-4482", ""])
      : undefined,
    riskScore: riskScore(rng, flagged ? rng.int(60, 99) : rng.int(1, 50)),
    flagged,
    feeCharged: rng.int(100, 10000),
  }
}

export function generateReport(seed: string): ScamReport {
  const rng = new SeededRandom(seed)
  const category = rng.pick(REPORT_CATEGORIES)
  const status = rng.pick(REPORT_STATUSES)
  const targetKind = rng.pick(ENTITY_KINDS)
  return {
    id: `RPT-${shortId(seed)}`,
    title: rng.pick(REPORT_TITLES[category]),
    category,
    status,
    severity: rng.pick(ALERT_SEVERITIES),
    description:
      "Community-submitted report describing suspicious activity associated with this entity. Full evidence and correlated on-chain signals are available in the detail view.",
    targetKind,
    targetId: rng.stellarPublicKey(),
    targetLabel: rng.bool(0.5) ? rng.pick(ORG_NAMES) : rng.pick(ASSET_CODES),
    reporterHandle: rng.pick(REPORTER_HANDLES),
    createdAt: rng.dateWithinDays(60),
    updatedAt: rng.dateWithinDays(10),
    evidenceUrls: rng.bool(0.5)
      ? [`https://evidence.scamwatchxlm.org/${shortId(seed)}.png`]
      : [],
    upvotes: rng.int(0, 340),
    reviewerNote:
      status !== "pending"
        ? "Reviewed against on-chain signals and community evidence."
        : undefined,
  }
}

export function generateAlert(seed: string): Alert {
  const rng = new SeededRandom(seed)
  const entityKind = rng.pick(ENTITY_KINDS)
  const severity = rng.pick(ALERT_SEVERITIES)
  const titles: Record<AlertSeverity, string[]> = {
    info: [
      "New issuer domain verified",
      "Trustline count stabilized",
      "Routine monitoring update",
    ],
    warning: [
      "Unusual trustline growth detected",
      "Holder concentration increasing",
      "New wallet cluster forming",
    ],
    danger: [
      "Liquidity withdrawal detected",
      "Rapid holder count spike",
      "Suspicious transaction pattern",
    ],
    critical: [
      "Rug pull signature detected",
      "Mass trustline drain in progress",
      "Confirmed scam network match",
    ],
  }
  return {
    id: `ALT-${shortId(seed)}`,
    severity,
    title: rng.pick(titles[severity]),
    description:
      "Automated detection triggered by network heuristics; correlated with recent community reports.",
    entityKind,
    entityId: rng.stellarPublicKey(),
    entityLabel: rng.bool(0.5) ? rng.pick(ORG_NAMES) : rng.pick(ASSET_CODES),
    createdAt: rng.dateWithinDays(3),
    acknowledged: rng.bool(0.3),
  }
}

export function generateTrendingScam(seed: string): TrendingScam {
  const rng = new SeededRandom(seed)
  const category = rng.pick(REPORT_CATEGORIES)
  return {
    id: `TRND-${shortId(seed)}`,
    title: rng.pick(REPORT_TITLES[category]),
    category,
    reportCount24h: rng.int(3, 120),
    reportCountTotal: rng.int(50, 900),
    relatedEntityIds: Array.from({ length: rng.int(1, 4) }, () => rng.stellarPublicKey()),
    trendDelta: rng.float(-20, 240),
  }
}

export function generateTimelineEvent(seed: string): TimelineEvent {
  const rng = new SeededRandom(seed)
  const severity = rng.bool(0.6) ? rng.pick(ALERT_SEVERITIES) : undefined
  return {
    id: `EVT-${shortId(seed)}`,
    timestamp: rng.dateWithinDays(180),
    type: rng.pick([
      "risk_score_change",
      "report_filed",
      "trustline_change",
      "transaction_flagged",
      "ownership_change",
    ]),
    title: rng.pick([
      "Risk score updated",
      "New community report filed",
      "Large trustline change observed",
      "Transaction flagged by heuristics",
      "Issuer metadata updated",
    ]),
    description:
      "Detected via automated monitoring pipeline and cross-referenced with historical baselines.",
    severity,
  }
}

export function generateNetworkStats(): NetworkStats {
  const rng = new SeededRandom("network-stats-v1")
  return {
    totalAccountsMonitored: rng.int(1_800_000, 2_400_000),
    totalAssetsTracked: rng.int(45000, 68000),
    totalIssuersTracked: rng.int(9000, 15000),
    totalReports: rng.int(38000, 52000),
    totalAlerts24h: rng.int(120, 640),
    averageRiskScore: rng.float(18, 32),
    activeInvestigations: rng.int(30, 140),
    updatedAt: new Date(Date.UTC(2026, 6, 9, 12, 0, 0)).toISOString(),
  }
}

export function generateAdminUser(seed: string): AdminUser {
  const rng = new SeededRandom(seed)
  return {
    id: `USR-${shortId(seed)}`,
    handle: rng.pick(REPORTER_HANDLES) + rng.int(1, 999),
    email: `${rng.pick(REPORTER_HANDLES)}${rng.int(1, 99)}@example.com`,
    role: rng.pick(["admin", "moderator", "analyst", "viewer"] as const),
    reportsSubmitted: rng.int(0, 220),
    reportsReviewed: rng.int(0, 500),
    joinedAt: rng.dateWithinDays(700),
    status: rng.bool(0.92) ? "active" : "suspended",
  }
}

export function generateAdminLog(seed: string): AdminLogEntry {
  const rng = new SeededRandom(seed)
  const action = rng.pick([
    "approved_report",
    "rejected_report",
    "escalated_report",
    "suspended_user",
    "flagged_asset",
    "updated_risk_model",
  ])
  return {
    id: `LOG-${shortId(seed)}`,
    actorHandle: rng.pick(REPORTER_HANDLES),
    action,
    target: rng.bool(0.5) ? `RPT-${shortId(seed)}` : rng.pick(ASSET_CODES),
    timestamp: rng.dateWithinDays(45),
    metadata: { source: "admin-console" },
  }
}

export function generateReporter(seed: string, rank: number): Reporter {
  const rng = new SeededRandom(seed)
  const submitted = rng.int(20, 400)
  const approved = Math.round(submitted * rng.float(0.4, 0.95))
  return {
    handle: rng.pick(REPORTER_HANDLES) + rng.int(1, 999),
    reportsSubmitted: submitted,
    reportsApproved: approved,
    accuracyRate: Math.round((approved / submitted) * 1000) / 10,
    rank,
  }
}

export function generateSeries(
  seed: string,
  points: number,
  min: number,
  max: number
): AnalyticsSeriesPoint[] {
  const rng = new SeededRandom(seed)
  const now = Date.UTC(2026, 6, 9)
  let value = rng.float(min, max)
  return Array.from({ length: points }, (_, i) => {
    value = Math.max(min, Math.min(max, value + rng.float(-max * 0.08, max * 0.08)))
    const date = new Date(now - (points - i) * 24 * 60 * 60 * 1000)
    return { date: date.toISOString().slice(0, 10), value: Math.round(value) }
  })
}

export function generateCategoryBreakdown(seed: string): AnalyticsCategoryBreakdown[] {
  const rng = new SeededRandom(seed)
  const raw = REPORT_CATEGORIES.map((category) => ({ category, count: rng.int(20, 800) }))
  const total = raw.reduce((sum, r) => sum + r.count, 0)
  return raw.map((r) => ({
    ...r,
    percentage: Math.round((r.count / total) * 1000) / 10,
  }))
}

export function generateSearchResults(query: string): SearchResult[] {
  if (!query.trim()) return []
  const rng = new SeededRandom(`search-${query}`)
  const count = rng.int(3, 8)
  return Array.from({ length: count }, (_, i) => {
    const kind = rng.pick([...ENTITY_KINDS, "report"] as const)
    const id =
      kind === "transaction"
        ? rng.txHash()
        : kind === "report"
          ? `RPT-${rng.int(1000, 9999)}`
          : rng.stellarPublicKey()
    const hrefBase =
      kind === "account"
        ? "/accounts"
        : kind === "asset"
          ? "/assets"
          : kind === "issuer"
            ? "/issuers"
            : kind === "transaction"
              ? "/transactions"
              : "/reports"
    return {
      kind,
      id,
      label: kind === "asset" ? rng.pick(ASSET_CODES) : `${query} match ${i + 1}`,
      subtitle: kind,
      riskLevel: rng.pick(["low", "medium", "high", "critical"] as const),
      href: `${hrefBase}/${id}`,
    }
  })
}

export function paginate<T>(items: T[], page: number, pageSize: number): Paginated<T> {
  const start = (page - 1) * pageSize
  const pageItems = items.slice(start, start + pageSize)
  return {
    items: pageItems,
    total: items.length,
    page,
    pageSize,
    hasNextPage: start + pageSize < items.length,
  }
}
