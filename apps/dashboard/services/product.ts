import { api, compactQuery, readResponse, requestOptions, withBody } from "@teleb/api-client"
import type { CreateProductImagePayload, CreateProductPayload, Product, ProductQueryInput, ProductsResult, UpdateProductPayload } from "@teleb/types/product"
import { deleteImageApi } from "./upload"

export const getProducts = async (query: ProductQueryInput = {}, locale?: string): Promise<ProductsResult> => {
  const filters = compactQuery({
    page: query.page,
    limit: query.limit,
    collectionId: query.collectionId,
    offerId: query.offerId,
    status: query.status,
    bestSeller: query.bestSeller,
    sort: query.sort,
    order: query.order,
    lang: query.lang,
  })

  const body = query.q
    ? await readResponse(api.v1.products.search.$get({ query: { ...filters, q: query.q } }, requestOptions({ locale })))
    : await readResponse(api.v1.products.$get({ query: filters }, requestOptions({ locale })))
  if (body.success === false) throw new Error(body.message || "Failed to fetch products")

  return {
    data: body.data ?? [],
    total: body.total ?? 0,
  }
}

export const getProductById = async (id: string | number, locale?: string): Promise<Product | null> => {
  const body = await readResponse(api.v1.products[":id"].$get({ param: { id: String(id) } }, requestOptions({ locale })))

  if (body.success === false) {
    if ("code" in body && body.code === "PRODUCT_NOT_FOUND") return null
    throw new Error(body.message || "Failed to fetch product")
  }

  return body.data ?? null
}

export const createProduct = async (payload: CreateProductPayload, locale?: string): Promise<Product> => {
  const body = await readResponse(api.v1.products.create.$post({ json: payload }, requestOptions({ locale, method: "POST" })))

  if (body.success === false || !body.data) {
    const message = ("message" in body && body.message) || "Failed to create product"
    throw new Error(message)
  }

  return body.data
}

export const updateProduct = async (id: string | number, payload: UpdateProductPayload, locale?: string): Promise<Product> => {
  const body = await readResponse(api.v1.products.update[":id"].$patch(withBody({ param: { id: String(id) } }, payload), requestOptions({ locale, method: "PATCH" })))

  if (body.success === false || !body.data) {
    const message = ("message" in body && body.message) || "Failed to update product"
    throw new Error(message)
  }

  return body.data
}

export const deleteProduct = async (id: string | number, locale?: string, publicIds?: string[]): Promise<void> => {
  if (publicIds && publicIds.length > 0) await Promise.allSettled(publicIds.filter(Boolean).map((publicId) => deleteImageApi(publicId)))
  const body = await readResponse(api.v1.products.delete[":id"].$delete({ param: { id: String(id) } }, requestOptions({ locale, method: "DELETE" })))
  if (body.success === false) throw new Error(body.message || "Failed to delete product")
}

export const addProductImages = async (productId: string | number, images: CreateProductImagePayload[], locale?: string): Promise<any> => {
  if (images.length === 0) return []
  const body = await readResponse(api.v1.products.images[":id"].$post(withBody({ param: { id: String(productId) } }, { images }), requestOptions({ locale, method: "POST" })))
  if (body.success === false) throw new Error(body.message || "Failed to add product images")
  return body.data
}

export const deleteProductImage = async (productId: string | number, imageId: string | number, locale?: string): Promise<void> => {
  const body = await readResponse(api.v1.products.images.delete[":id"][":imageId"].$delete({ param: { id: String(productId), imageId: String(imageId) } }, requestOptions({ locale, method: "DELETE" })))
  if (body.success === false) throw new Error(body.message || "Failed to delete image")
}

export const updateProductStatus = async (id: string | number, status: "active" | "inactive", locale?: string): Promise<Product> => {
  const body = await readResponse(api.v1.products.status[":id"].$patch(withBody({ param: { id: String(id) } }, { status }), requestOptions({ locale, method: "PATCH" })))

  if (body.success === false || !body.data) {
    const message = ("message" in body && body.message) || "Failed to update product status"
    throw new Error(message)
  }

  return body.data
}

export const updateProductBestSeller = async (id: string | number, value: boolean, locale?: string): Promise<Product> => {
  const body = await readResponse(api.v1.products["best-seller"][":id"].$patch(withBody({ param: { id: String(id) } }, { value }), requestOptions({ locale, method: "PATCH" })))

  if (body.success === false || !body.data) {
    const message = ("message" in body && body.message) || "Failed to update best seller status"
    throw new Error(message)
  }

  return body.data
}
