import type { ApiResponse } from "./api"

export type AnalyticsOverview = {
  collections: {
    total: number
  }
  offers: {
    total: number
    currentlyActive: number
  }
  products: {
    total: number
    active: number
  }
  messages: {
    total: number
    unread: number
    highPriority: number
  }
  generatedAt: string
}

export type AnalyticsData = AnalyticsOverview
export type AnalyticsResponse = ApiResponse<AnalyticsOverview>
