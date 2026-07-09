import { useQuery } from "@tanstack/react-query"
import {
  getAccountTransactions,
  getTransaction,
  getTransactions,
  type ListTransactionsParams,
} from "@/lib/api/transactions"
import { queryKeys } from "@/lib/api/query-keys"

export function useTransactions(params: ListTransactionsParams = {}) {
  return useQuery({
    queryKey: queryKeys.transactions.list(params),
    queryFn: () => getTransactions(params),
    placeholderData: (previous) => previous,
  })
}

export function useTransaction(hash: string) {
  return useQuery({
    queryKey: queryKeys.transactions.detail(hash),
    queryFn: () => getTransaction(hash),
    enabled: Boolean(hash),
  })
}

export function useAccountTransactions(accountId: string) {
  return useQuery({
    queryKey: queryKeys.transactions.byAccount(accountId),
    queryFn: () => getAccountTransactions(accountId),
    enabled: Boolean(accountId),
  })
}
