import type { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { offerTable } from "../../database/schemas"
import type { Offer as OfferEntity } from "@teleb/types/offer"

export type Offer = InferSelectModel<typeof offerTable>
export type NewOffer = InferInsertModel<typeof offerTable>

export type OfferResponse = OfferEntity

export interface IOfferService {
  getAll(options: import("@teleb/types/offer").GetOffersOptions): Promise<{
    data: OfferResponse[]
    total: number
  }>
  getById(id: number): Promise<OfferResponse>
  getCurrentBannerOffer(): Promise<OfferResponse | null>
  create(data: import("@teleb/types/offer").CreateOffer, userId: number): Promise<OfferResponse>
  update(id: number, data: import("@teleb/types/offer").UpdateOffer): Promise<OfferResponse>
  delete(id: number): Promise<void>
  updateStatus(id: number, value: boolean): Promise<OfferResponse>
  updateShowBanner(id: number, value: boolean): Promise<OfferResponse>
}
