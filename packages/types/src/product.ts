import type { ApiResponse, ListResponse } from "./api"
import type { Locale, ProductSortField, ProductStatus, SortOrder } from "./common"

export type ProductTranslation = {
  id: number
  productId: number
  locale: Locale
  name: string
  description: string | null
  smallDescription: string | null
  materials: { name: string }[] | null
  features: { name: string }[] | null
  height: string | null
  width: string | null
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string[] | null
  tags: string[]
}

export type ProductImage = {
  id: number
  productId: number
  url: string
  publicId: string
  order: number
  isMain: boolean
}

export type ProductVariant = {
  id: number
  productId: number
  size: string | null
  weight: string | null
  isAvailable: boolean
}

export type Product = {
  id: number
  collectionId?: number
  offerId?: number | null
  slug: string
  status: ProductStatus
  isBestSeller: boolean
  isCustomizable: boolean
  warranty?: number
  weight?: string | null
  createdAt: string | Date
  updatedAt: string | Date
  translations: ProductTranslation[]
  images: ProductImage[]
  variants?: ProductVariant[]
}

export type ProductResponse = Product
export type ProductListResponse = ListResponse<Product>
export type SingleProductResponse = ApiResponse<Product>
export type GetProductByIdResponse = ApiResponse<Product>
export type GetProductsResponse = ListResponse<Product>
export type SearchProductsResponse = ListResponse<Product>

export type ProductsResult = {
  data: Product[]
  total: number
}

export type SearchProductsParams = {
  q: string
  page?: number
  limit?: number
  lang?: Locale
}

export type ProductQueryInput = {
  page?: number
  limit?: number
  collectionId?: number
  offerId?: number
  status?: ProductStatus
  bestSeller?: boolean
  sort?: ProductSortField
  order?: SortOrder
  lang?: Locale
  q?: string
}

export type GetProductsParams = ProductQueryInput

export type GetProductsOptions = ProductQueryInput & {
  page: number
  limit: number
}

export type SearchProductOptions = {
  q: string
  page: number
  limit: number
}

export interface CreateProductTranslation {
  name: string
  description?: string
  smallDescription?: string
  materials?: {
    name: string
  }[]
  features?: {
    name: string
  }[]
  height?: string | null
  width?: string | null
  tags?: string[]
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
}

export type UpdateProductTranslation = Partial<CreateProductTranslation>

export interface CreateProductVariant {
  size?: string
  weight?: string | null
  isAvailable?: boolean
}

export type UpdateProductVariant = Partial<CreateProductVariant>

export interface CreateProduct {
  collectionId: number
  offerId?: number | null
  slug: string
  status?: ProductStatus
  isBestSeller?: boolean
  isCustomizable?: boolean
  warranty?: number
  weight?: string | null
  translations: {
    ar: CreateProductTranslation
    en: CreateProductTranslation
  }
  variants?: CreateProductVariant[]
}

export interface UpdateProduct {
  collectionId?: number
  offerId?: number | null
  slug?: string
  status?: ProductStatus
  isBestSeller?: boolean
  isCustomizable?: boolean
  warranty?: number
  weight?: string | null
  translations?: {
    ar?: UpdateProductTranslation
    en?: UpdateProductTranslation
  }
  variants?: CreateProductVariant[]
}

export type CreateProductPayload = CreateProduct
export type UpdateProductPayload = UpdateProduct

export interface CreateProductImage {
  url: string
  publicId: string
  order?: number
  isMain?: boolean
}

export interface UpdateProductImage {
  url?: string
  publicId?: string
  order?: number
  isMain?: boolean
}

export type CreateProductImagePayload = CreateProductImage
