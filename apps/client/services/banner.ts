import { api, readResponse, requestOptions } from "@teleb/api-client"
import type { Banner } from "@teleb/types/banner"

export const getBanners = async (): Promise<Banner[]> => {
  const body = await readResponse(api.v1.banner.get.$get(undefined, requestOptions()))
  if (body.success === false) throw new Error(body.message || "Failed to fetch banners")
  return body.data ?? []
}
