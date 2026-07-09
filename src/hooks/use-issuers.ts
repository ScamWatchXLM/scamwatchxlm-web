import { useQuery } from "@tanstack/react-query"
import {
  getIssuer,
  getIssuerAssets,
  getIssuers,
  getIssuerTimeline,
  type ListIssuersParams,
} from "@/lib/api/issuers"
import { queryKeys } from "@/lib/api/query-keys"
import type { Issuer } from "@/types/domain"

export function useIssuers(params: ListIssuersParams = {}) {
  return useQuery({
    queryKey: queryKeys.issuers.list(params),
    queryFn: () => getIssuers(params),
    placeholderData: (previous) => previous,
  })
}

export function useIssuer(id: string) {
  return useQuery({
    queryKey: queryKeys.issuers.detail(id),
    queryFn: () => getIssuer(id),
    enabled: Boolean(id),
  })
}

export function useIssuerAssets(issuer?: Issuer) {
  return useQuery({
    queryKey: queryKeys.issuers.assets(issuer?.id ?? ""),
    queryFn: () => getIssuerAssets(issuer as Issuer),
    enabled: Boolean(issuer),
  })
}

export function useIssuerTimeline(id: string) {
  return useQuery({
    queryKey: queryKeys.issuers.timeline(id),
    queryFn: () => getIssuerTimeline(id),
    enabled: Boolean(id),
  })
}
