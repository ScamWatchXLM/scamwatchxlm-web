import { useQuery } from "@tanstack/react-query"
import {
  getAccount,
  getAccounts,
  getAccountTimeline,
  type ListAccountsParams,
} from "@/lib/api/accounts"
import { queryKeys } from "@/lib/api/query-keys"

export function useAccounts(params: ListAccountsParams = {}) {
  return useQuery({
    queryKey: queryKeys.accounts.list(params),
    queryFn: () => getAccounts(params),
    placeholderData: (previous) => previous,
  })
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: queryKeys.accounts.detail(id),
    queryFn: () => getAccount(id),
    enabled: Boolean(id),
  })
}

export function useAccountTimeline(id: string) {
  return useQuery({
    queryKey: queryKeys.accounts.timeline(id),
    queryFn: () => getAccountTimeline(id),
    enabled: Boolean(id),
  })
}
