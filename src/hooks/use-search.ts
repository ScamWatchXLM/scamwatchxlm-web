import { useQuery } from "@tanstack/react-query"
import { globalSearch } from "@/lib/api/search"
import { queryKeys } from "@/lib/api/query-keys"
import { useDebouncedValue } from "@/hooks/use-debounced-value"

export function useGlobalSearch(query: string) {
  const debounced = useDebouncedValue(query, 300)

  return useQuery({
    queryKey: queryKeys.search.query(debounced),
    queryFn: () => globalSearch(debounced),
    enabled: debounced.trim().length > 1,
  })
}
