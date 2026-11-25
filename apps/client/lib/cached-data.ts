import { cacheLife } from "next/cache"
import { getBanners } from "@/services/banner"
import { getCollections } from "@/services/collection"
import { getProducts, searchProducts } from "@/services/product"
import type { ListingFilters } from "@/components/pages/Products/types"
import { GetProductsParams, Product } from "@teleb/types/product"
import { Collection } from "@teleb/types/collection"
import { Banner } from "@teleb/types/banner"

export interface ProductList {
  products: Product[]
  total: number
}

const EMPTY_LIST: ProductList = { products: [], total: 0 }

export async function getCachedCollections(): Promise<Collection[]> {
  "use cache"
  cacheLife("days")

  try {
    return await getCollections()
  } catch (error) {
    console.error("Failed to load collections:", error)
    return []
  }
}

export async function getCachedBanners(): Promise<Banner[]> {
  "use cache"
  cacheLife("hours")

  try {
    return await getBanners()
  } catch (error) {
    console.error("Failed to load banners:", error)
    return []
  }
}

export async function getCachedProductList(params: GetProductsParams): Promise<ProductList> {
  "use cache"
  cacheLife("hours")

  try {
    return await getProducts(params)
  } catch (error) {
    console.error("Failed to load products:", params, error)
    return EMPTY_LIST
  }
}

export async function getCachedBestSellers(locale: "ar" | "en", limit = 10): Promise<Product[]> {
  const { products } = await getCachedProductList({
    bestSeller: true,
    status: "active",
    limit,
    lang: locale,
  })

  return products
}

export async function getCachedExploreProducts(locale: "ar" | "en", limit = 8): Promise<Product[]> {
  const { products } = await getCachedProductList({
    bestSeller: false,
    status: "active",
    limit,
    lang: locale,
  })

  return products
}

export async function getCachedRelatedProducts(locale: "ar" | "en", collectionId: number, excludeProductId: number, limit = 4): Promise<Product[]> {
  const { products } = await getCachedProductList({
    collectionId,
    status: "active",
    limit: limit + 1,
    lang: locale,
  })

  return products.filter((product) => product.id !== excludeProductId).slice(0, limit)
}

export async function getCachedListing(locale: "ar" | "en", filters: ListingFilters): Promise<ProductList> {
  const { search, collectionId, bestSeller, status, sort, order, page, limit } = filters

  if (search) {
    const found = await getCachedSearchListing(search, page, limit, locale)
    let products = found.products

    if (collectionId) {
      products = products.filter((product) => product.collectionId === collectionId)
    }
    if (bestSeller !== undefined) {
      products = products.filter((product) => Boolean(product.isBestSeller) === bestSeller)
    }
    if (status === "active") {
      products = products.filter((product) => product.status === "active")
    }

    return { products, total: found.total ?? products.length }
  }

  return getCachedProductList({
    page,
    limit,
    collectionId,
    status,
    bestSeller,
    sort,
    order,
    lang: locale,
  })
}

async function getCachedSearchListing(query: string, page: number, limit: number, locale: "ar" | "en"): Promise<ProductList> {
  "use cache"
  cacheLife("hours")

  try {
    return await searchProducts({ q: query, page, limit, lang: locale })
  } catch (error) {
    console.error("Failed to search products:", query, error)
    return EMPTY_LIST
  }
}
