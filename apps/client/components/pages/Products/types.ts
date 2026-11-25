export type SortOption = "newest" | "oldest" | "name_asc" | "name_desc"

export interface ProductFiltersState {
  search: string
  collectionId: number | null
  bestSeller: boolean
  status: "active" | "all"
  sort: SortOption
  page: number
}

export const DEFAULT_PAGE_SIZE = 12

export interface ListingFilters {
  page: number
  limit: number
  collectionId?: number
  bestSeller?: boolean
  status?: "active" | "inactive"
  sort?: "createdAt" | "name"
  order?: "asc" | "desc"
  search?: string
}

export function buildListingQuery(filters: ListingFilters): string {
  const params = new URLSearchParams()

  if (filters.search) params.set("search", filters.search)
  if (filters.collectionId) params.set("collectionId", String(filters.collectionId))
  if (filters.bestSeller !== undefined) params.set("bestSeller", String(filters.bestSeller))
  if (filters.status) params.set("status", filters.status)
  if (filters.sort) params.set("sort", filters.sort)
  if (filters.order) params.set("order", filters.order)
  if (filters.page > 1) params.set("page", String(filters.page))

  return params.toString()
}
