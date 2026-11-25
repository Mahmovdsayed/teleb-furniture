import { api, readResponse, requestOptions, withBody } from "@teleb/api-client"
import type { Banner } from "@teleb/types/banner"
import { deleteImageApi } from "./upload"
import { CreateBannerInput, UpdateBannerInput } from "@teleb/validations/banner"

export const getBanners = async (): Promise<Banner[]> => {
  const body = await readResponse(api.v1.banner.get.$get(undefined, requestOptions()))
  if (body.success === false) throw new Error(body.message || "Failed to fetch banners")
  return body.data ?? []
}

export const deleteBanner = async (id: string, locale: string, publicIds?: string[]): Promise<any> => {
  if (publicIds && publicIds.length > 0) await Promise.allSettled(publicIds.filter(Boolean).map((publicId) => deleteImageApi(publicId)))
  const body = await readResponse(api.v1.banner.delete[":id"].$delete({ param: { id: String(id) } }, requestOptions({ locale, method: "DELETE" })))
  if (body.success === false) throw new Error(body.message || "Failed to delete banner")
  return body
}

export const addBanner = async (payload: CreateBannerInput, locale: string) => {
  const body = await readResponse(api.v1.banner.create.$post({ json: payload }, requestOptions({ locale, method: "POST" })))
  if (body.success === false) throw new Error(body.message || "Failed to add banner")
  return body
}

export const getBannerById = async (id: string): Promise<Banner | null> => {
  const body = await readResponse(api.v1.banner.get[":id"].$get({ param: { id: String(id) } }, requestOptions()))

  if (body.success === false) {
    if ("code" in body && body.code === "BANNER_NOT_FOUND") return null
    throw new Error(body.message || "Failed to fetch banner")
  }

  return body.data ?? null
}

export const updateBanner = async (payload: UpdateBannerInput, locale: string, id: string): Promise<any> => {
  const body = await readResponse(api.v1.banner.update[":id"].$patch(withBody({ param: { id: String(id) } }, payload), requestOptions({ locale, method: "PATCH" })))
  if (body.success === false) throw new Error(body.message || "Failed to update banner")
  return body
}
