import { useQuery } from "@tanstack/react-query"
import {
  getAsset,
  getAssets,
  getAssetTimeline,
  type ListAssetsParams,
} from "@/lib/api/assets"
import { queryKeys } from "@/lib/api/query-keys"

export function useAssets(params: ListAssetsParams = {}) {
  return useQuery({
    queryKey: queryKeys.assets.list(params),
    queryFn: () => getAssets(params),
    placeholderData: (previous) => previous,
  })
}

export function useAsset(id: string) {
  return useQuery({
    queryKey: queryKeys.assets.detail(id),
    queryFn: () => getAsset(id),
    enabled: Boolean(id),
  })
}

export function useAssetTimeline(id: string) {
  return useQuery({
    queryKey: queryKeys.assets.timeline(id),
    queryFn: () => getAssetTimeline(id),
    enabled: Boolean(id),
  })
}
