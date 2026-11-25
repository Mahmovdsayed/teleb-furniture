import { api, compactQuery, readResponse, requestOptions, withBody } from "@teleb/api-client"
import type { Offer, OfferQueryInput, OffersResult } from "@teleb/types/offer"
import type { CreateOfferFormValues, UpdateOfferFormValues } from "@teleb/validations/offer"

export const getOffers = async (query: OfferQueryInput, locale: string): Promise<OffersResult> => {
  const body = await readResponse(api.v1.offer.get.$get({ query: compactQuery(query) }, requestOptions({ locale })))
  if (body.success === false) throw new Error(body.message || "Failed to fetch offers")

  return {
    data: body.data ?? [],
    total: body.total ?? body.data?.length ?? 0,
  }
}

export const deleteOffer = async (id: string, locale: string): Promise<any> => {
  const body = await readResponse(api.v1.offer.delete[":id"].$delete({ param: { id: String(id) } }, requestOptions({ locale, method: "DELETE" })))
  if (body.success === false) throw new Error(body.message || "Failed to delete offer")
  return body
}

export const addOffer = async (payload: CreateOfferFormValues, locale: string): Promise<any> => {
  const body = await readResponse(api.v1.offer.create.$post({ json: payload }, requestOptions({ locale, method: "POST" })))
  if (body.success === false) throw new Error(body.message || "Failed to add offer")
  return body
}

export const getOfferById = async (id: string): Promise<Offer | null> => {
  const body = await readResponse(api.v1.offer.get[":id"].$get({ param: { id: String(id) } }, requestOptions()))
  if (body.success === false) {
    if ("code" in body && body.code === "OFFER_NOT_FOUND") return null
    throw new Error(body.message || "Failed to fetch offer")
  }

  return body.data ?? null
}

export const updateOffer = async (payload: UpdateOfferFormValues, locale: string, id: string): Promise<any> => {
  const body = await readResponse(api.v1.offer.update[":id"].$patch(withBody({ param: { id: String(id) } }, payload), requestOptions({ locale, method: "PATCH" })))
  if (body.success === false) throw new Error(body.message || "Failed to update offer")
  return body
}
