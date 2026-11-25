import type { ApiResponse, ListResponse } from "./api"
import type { OfferSortField, SortOrder } from "./common"

export type Offer = {
  id: number
  arName: string
  arDescription: string
  arBannerText: string
  enName: string
  enDescription: string
  enBannerText: string
  percentage: string
  startDate: string | Date
  endDate: string | Date
  isActive: boolean
  showBanner: boolean
  bannerBackgroundColor: string
  bannerTextColor: string
  createdBy: number
  createdAt: string | Date
  updatedAt: string | Date
}

export type OfferResponse = ListResponse<Offer>
export type SingleOfferResponse = ApiResponse<Offer>

export type OffersResult = {
  data: Offer[]
  total: number
}

export type OfferPayload = Omit<Offer, "id" | "createdAt" | "updatedAt">

export type OfferQueryInput = {
  page?: number | undefined
  limit?: number | undefined
  isActive?: boolean | undefined
  showBanner?: boolean | undefined
  sort?: OfferSortField | undefined
  order?: SortOrder | undefined
}

export type GetOffersOptions = OfferQueryInput & {
  page: number
  limit: number
}

export interface CreateOffer {
  arName: string
  arDescription?: string | undefined
  arBannerText?: string | undefined
  enName: string
  enDescription?: string | undefined
  enBannerText?: string | undefined
  percentage: string
  startDate: Date
  endDate: Date
  isActive?: boolean | undefined
  showBanner?: boolean | undefined
  bannerBackgroundColor?: string | undefined
  bannerTextColor?: string | undefined
}

export interface UpdateOffer {
  arName?: string | undefined
  arDescription?: string | undefined
  arBannerText?: string | undefined
  enName?: string | undefined
  enDescription?: string | undefined
  enBannerText?: string | undefined
  percentage?: string | undefined
  startDate?: Date | undefined
  endDate?: Date | undefined
  isActive?: boolean | undefined
  showBanner?: boolean | undefined
  bannerBackgroundColor?: string | undefined
  bannerTextColor?: string | undefined
}

export type CreateOfferPayload = CreateOffer
export type UpdateOfferPayload = UpdateOffer

export type UpdateOfferStatusPayload = {
  value?: boolean | undefined
  isActive?: boolean | undefined
}

export type UpdateOfferShowBannerPayload = {
  value?: boolean | undefined
  showBanner?: boolean | undefined
}
