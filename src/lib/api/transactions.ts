import { apiFetch, mockDelay } from "./client"
import { isMockMode } from "@/config/env"
import { mockTransactions } from "@/mocks/db"
import { generateTransaction, paginate } from "@/mocks/generators"
import { SeededRandom } from "@/mocks/seed"
import type { Paginated, Transaction } from "@/types/domain"

export interface ListTransactionsParams {
  page?: number
  pageSize?: number
  query?: string
  flaggedOnly?: boolean
  sort?: "createdAt" | "riskScore" | "amount"
}

export async function getTransactions(
  params: ListTransactionsParams = {}
): Promise<Paginated<Transaction>> {
  const { page = 1, pageSize = 25, query, flaggedOnly, sort = "createdAt" } = params

  if (isMockMode) {
    await mockDelay()
    let items = [...mockTransactions]
    if (query) {
      const q = query.toLowerCase()
      items = items.filter(
        (t) =>
          t.hash.toLowerCase().includes(q) || t.sourceAccount.toLowerCase().includes(q)
      )
    }
    if (flaggedOnly) items = items.filter((t) => t.flagged)
    items.sort((a, b) => {
      if (sort === "riskScore") return b.riskScore.value - a.riskScore.value
      if (sort === "amount") return Number(b.amount ?? 0) - Number(a.amount ?? 0)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    return paginate(items, page, pageSize)
  }

  return apiFetch<Paginated<Transaction>>("/transactions", {
    params: { page, pageSize, query, flaggedOnly, sort },
  })
}

/** Deterministic per-account transaction history for the account detail page's Transactions tab. */
export async function getAccountTransactions(accountId: string): Promise<Transaction[]> {
  if (isMockMode) {
    await mockDelay(180)
    const rng = new SeededRandom(`account-txs-${accountId}`)
    const count = rng.int(2, 8)
    return Array.from({ length: count }, (_, i) => {
      const tx = generateTransaction(`account-tx-${accountId}-${i}`)
      return { ...tx, sourceAccount: accountId }
    })
  }
  return apiFetch<Transaction[]>("/transactions", {
    params: { sourceAccount: accountId },
  })
}

export async function getTransaction(hash: string): Promise<Transaction | undefined> {
  if (isMockMode) {
    await mockDelay()
    return mockTransactions.find((t) => t.hash === hash) ?? mockTransactions[0]
  }
  return apiFetch<Transaction>(`/transactions/${hash}`)
}
