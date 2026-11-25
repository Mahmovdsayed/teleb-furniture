export type Locale = "en" | "ar"
export type MessagePriority = "low" | "medium" | "high"
export type ProductStatus = "active" | "inactive"
export type SortOrder = "asc" | "desc"
export type ProductSortField = "createdAt" | "name"
export type MessageSortField = "createdAt" | "fullName" | "email" | "subject" | "isViewed" | "priority"
export type OfferSortField = "createdAt" | "startDate" | "endDate" | "percentage"

export type PaginatedResult<T> = {
  data: T[]
  total: number
}
