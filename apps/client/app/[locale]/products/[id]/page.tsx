import { Suspense } from "react"
import type { Metadata } from "next"
import { cacheLife } from "next/cache"
import { notFound, permanentRedirect } from "next/navigation"

import { PageTransition } from "@teleb/ui/components/page-transition"
import { ProductDetailContent } from "@/components/pages/ProductDetail/ProductDetailContent"
import { ProductDetailSkeleton } from "@/components/skeleton"

import { getProductById, getProductBySlug } from "@/services/product"
import { ApiClientError as ApiRequestError } from "@teleb/api-client"
import { getCachedCollections, getCachedRelatedProducts } from "@/lib/cached-data"
import { absoluteUrl, productPath } from "@/lib/seo/site"
import type { Product } from "@teleb/types/product";

interface Props {
  params: Promise<{
    locale: "ar" | "en"
    id: string
  }>
}

const NUMERIC_ID = /^\d+$/

function safeDecode(segment: string) {
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

async function getProduct(segment: string, locale: "ar" | "en"): Promise<Product | null> {
  "use cache"

  cacheLife("hours")

  try {
    const product = NUMERIC_ID.test(segment)
      ? await getProductById(segment, locale)
      : await getProductBySlug(safeDecode(segment), locale)

    return product ?? null
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) return null

    console.error("Product lookup failed:", segment, locale, error)
    throw error
  }
}

function requestedUrl(locale: string, id: string) {
  return absoluteUrl(`/${locale}/products/${encodeURIComponent(safeDecode(id))}`)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params

  try {
    const product = await getProduct(id, locale)

    if (!product) {
      return {
        title: locale === "ar" ? "المنتج غير موجود" : "Product Not Found",
        alternates: { canonical: requestedUrl(locale, id) },
        robots: { index: false, follow: true },
      }
    }

    const translation =
      product.translations?.find((tr) => tr.locale === locale) || product.translations?.[0]

    const title = translation?.metaTitle || `${translation?.name || product.slug}`

    const description =
      translation?.metaDescription ||
      translation?.smallDescription ||
      translation?.description ||
      (locale === "ar" ? "أثاث منزلي عصري فاخر" : "Luxury modern furniture")

    const mainImage = product.images?.find((img) => img.isMain)?.url || product.images?.[0]?.url

    const path = productPath(product)
    const canonical = absoluteUrl(`/${locale}${path}`)

    return {
      title,
      description,
      keywords: translation?.metaKeywords ?? undefined,
      alternates: {
        canonical,
        languages: {
          en: absoluteUrl(`/en${path}`),
          ar: absoluteUrl(`/ar${path}`),
          "x-default": absoluteUrl(`/en${path}`),
        },
      },
      openGraph: {
        title,
        description,
        type: "article",
        url: canonical,
        locale: locale === "ar" ? "ar_EG" : "en_US",
        images: mainImage ? [{ url: mainImage, alt: translation?.name }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: mainImage ? [mainImage] : undefined,
      },
    }
  } catch {
    return {
      title: locale === "ar" ? "تفاصيل المنتج" : "Product Details",
    }
  }
}

async function ProductDetailLoader({ params }: { params: Props["params"] }) {
  const { locale, id } = await params
  const product = await getProduct(id, locale)

  if (!product) notFound()

  const canonicalPath = `/${locale}${productPath(product)}`
  if (canonicalPath !== `/${locale}/products/${safeDecode(id)}`) {
    permanentRedirect(canonicalPath)
  }

  const collectionId = product.collectionId != null ? Number(product.collectionId) : undefined

  const [collections, relatedProducts] = await Promise.all([
    getCachedCollections(),
    collectionId
      ? getCachedRelatedProducts(locale, collectionId, product.id)
      : Promise.resolve<Product[]>([]),
  ])

  return (
    <ProductDetailContent
      initialProduct={product}
      initialCollections={collections}
      initialRelatedProducts={relatedProducts}
      productId={id}
    />
  )
}

export default function ProductDetailPage({ params }: Props) {
  return (
    <PageTransition>
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailLoader params={params} />
      </Suspense>
    </PageTransition>
  )
}
