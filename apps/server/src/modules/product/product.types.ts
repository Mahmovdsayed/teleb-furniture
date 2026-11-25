import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { productTable } from "../../database/schemas";
import type { CreateProduct, CreateProductImage, CreateProductTranslation, CreateProductVariant, GetProductsOptions, ProductImage, ProductResponse, ProductTranslation, ProductVariant, SearchProductOptions, UpdateProduct, UpdateProductImage, UpdateProductTranslation, UpdateProductVariant } from "@teleb/types/product";

export type Product = InferSelectModel<typeof productTable>
export type NewProduct = InferInsertModel<typeof productTable>

export type {
  CreateProduct,
  CreateProductImage,
  CreateProductTranslation,
  CreateProductVariant,
  GetProductsOptions,
  ProductImage,
  ProductResponse,
  ProductTranslation,
  ProductVariant,
  SearchProductOptions,
  UpdateProduct,
  UpdateProductImage,
  UpdateProductTranslation,
  UpdateProductVariant,
}

export interface ProductWithRelations extends Product {
  translations: ProductTranslation[]
  images: ProductImage[]
  variants: ProductVariant[]
}

export interface IProductService {
  getAll(options: GetProductsOptions, local: string): Promise<{ data: ProductResponse[]; total: number }>
  search(options: SearchProductOptions, locale: import("@teleb/types/common").Locale): Promise<{ data: ProductResponse[]; total: number }>
  getById(id: number, locale?: string): Promise<ProductResponse | null>
  getBySlug(slug: string, locale: import("@teleb/types/common").Locale): Promise<ProductResponse | null>
  create(data: CreateProduct, userId: number): Promise<ProductResponse>
  update(id: number, data: UpdateProduct): Promise<ProductResponse>
  delete(id: number): Promise<void>
  updateStatus(id: number, status: "active" | "inactive"): Promise<ProductResponse>
  updateBestSeller(id: number, value: boolean): Promise<ProductResponse>
  addImage(productId: number, data: CreateProductImage): Promise<ProductImage>
  updateImage(productId: number, imageId: number, data: UpdateProductImage): Promise<ProductImage>
  deleteImage(productId: number, imageId: number): Promise<void>
  setMainImage(productId: number, imageId: number): Promise<ProductImage>
  reorderImages(productId: number, imageIds: number[]): Promise<void>
  addVariant(productId: number, data: CreateProductVariant): Promise<ProductVariant>
  updateVariant(productId: number, variantId: number, data: UpdateProductVariant): Promise<ProductVariant>
  deleteVariant(productId: number, variantId: number): Promise<void>
}
