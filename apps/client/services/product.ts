import { api, compactQuery, readResponse, requestOptions } from "@teleb/api-client"
import type { GetProductsParams, Product, SearchProductsParams } from "@teleb/types/product"

export const searchProducts = async (params: SearchProductsParams): Promise<{ products: Product[]; total: number }> => {
  const body = await readResponse(
    api.v1.products.search.$get(
      {
        query: compactQuery({
          q: params.q.trim(),
          page: params.page,
          limit: params.limit,
          lang: params.lang,
        }),
      },
      requestOptions({ locale: params.lang })
    )
  )

  if (body.success === false) throw new Error(body.message || "Failed to search products")
  

  return {
    products: body.data ?? [],
    total: body.total ?? 0,
  }
}

export const getProducts = async (params: GetProductsParams = {}): Promise<{ products: Product[]; total: number }> => {
  const body = await readResponse(
    api.v1.products.$get(
      {
        query: compactQuery({
          page: params.page,
          limit: params.limit,
          collectionId: params.collectionId,
          offerId: params.offerId,
          status: params.status,
          bestSeller: params.bestSeller,
          sort: params.sort,
          order: params.order,
          lang: params.lang,
        }),
      },
      requestOptions({ locale: params.lang })
    )
  )

  if (body.success === false) throw new Error(body.message || "Failed to fetch products")
  

  return {
    products: body.data ?? [],
    total: body.total ?? 0,
  }
}

export const getProductById = async (id: string | number, lang?: "ar" | "en"): Promise<Product | null> => {
  if (typeof id === "string" && !/^\d+$/.test(id.trim())) return getProductBySlug(id, lang)
  const body = await readResponse(api.v1.products[":id"].$get({ param: { id: String(id) } }, requestOptions({ locale: lang })))

  if (body.success === false) {
    if ("data" in body && body.data) throw new Error(body.message || "Failed to fetch product")
    return null
  }

  return body.data ?? null
}

export const getProductBySlug = async (slug: string, lang?: "ar" | "en"): Promise<Product | null> => {
  const decodedSlug = decodeURIComponent(slug).trim()
  const body = await readResponse(api.v1.products.slug[":slug"].$get({ param: { slug: encodeURIComponent(decodedSlug) } }, requestOptions({ locale: lang })))

  if (body.success === false) {
    if ("data" in body && body.data) throw new Error(body.message || "Failed to fetch product")
    return null
  }

  const product = body.data ?? null
  if (product?.id && product.collectionId === undefined) {
    try {
      const fullProduct = await getProductById(product.id, lang)
      if (fullProduct) {
        return {
          ...fullProduct,
          ...product,
          collectionId: fullProduct.collectionId ?? product.collectionId,
          offerId: fullProduct.offerId ?? product.offerId,
          createdAt: fullProduct.createdAt ?? product.createdAt,
          updatedAt: fullProduct.updatedAt ?? product.updatedAt,
        }
      }
    } catch {}
  }

  return product
}

export const getProductByIdOrSlug = async (idOrSlug: string | number, lang?: "ar" | "en"): Promise<Product | null> => {
  const str = String(idOrSlug).trim()
  if (/^\d+$/.test(str)) return getProductById(str, lang)
  return getProductBySlug(str, lang)
}
