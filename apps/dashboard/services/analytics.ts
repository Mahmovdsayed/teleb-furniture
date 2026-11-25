import { api, readResponse, requestOptions } from "@teleb/api-client"
import type { AnalyticsData } from "@teleb/types/analytics"

export const getAnalytics = async (): Promise<AnalyticsData> => {
  const body = await readResponse(api.v1.analytics.all.$get(undefined, requestOptions()))
  if (body.success === false) throw new Error(body.message || "Failed to fetch analytics")
  if (!body.data) throw new Error("Failed to fetch analytics")
  return body.data
}
