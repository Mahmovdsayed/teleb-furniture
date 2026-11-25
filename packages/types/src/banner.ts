import type { ApiResponse, ListResponse } from "./api"

export interface BannerImage {
  url: string
  publicId: string
  order: number
}

export type Banner = {
  id: number
  title: string
  images: BannerImage[]
  userId: number
  createdAt: string | Date
  updatedAt: string | Date
}

export type BannerResponse = ListResponse<Banner>
export type SingleBannerResponse = ApiResponse<Banner>

export interface CreateBanner {
  title: string
  images?: BannerImage[] | undefined
}

export interface UpdateBanner {
  title?: string | undefined
  images?: BannerImage[] | undefined
}

export interface AddBannerImage {
  url: string
  publicId: string
}

export interface UpdateBannerImage {
  url?: string | undefined
  publicId?: string | undefined
}
