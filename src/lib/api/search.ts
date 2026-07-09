import { apiFetch, mockDelay } from "./client"
import { isMockMode } from "@/config/env"
import { generateSearchResults } from "@/mocks/generators"
import type { SearchResult } from "@/types/domain"

export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return []

  if (isMockMode) {
    await mockDelay(160)
    return generateSearchResults(query)
  }

  return apiFetch<SearchResult[]>("/search", { params: { q: query } })
}
