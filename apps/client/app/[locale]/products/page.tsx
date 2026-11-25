import { Suspense } from "react"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { PageTransition } from "@teleb/ui/components/page-transition"
import { ProductsContent } from "@/components/pages/Products/ProductsContent"
import { ProductCardSkeleton } from "@/components/skeleton"
import {
  DEFAULT_PAGE_SIZE,
  buildListingQuery,
  type ListingFilters,
} from "@/components/pages/Products/types"
import { getCachedCollections, getCachedListing } from "@/lib/cached-data"
import { SITE_URL } from "@/lib/seo/site"
import { getProductsFilterSchema } from "@teleb/validations/storefront"

type SearchParamsInput = Record<string, string | string[] | undefined>

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParamsInput>
}

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value

function parseListingFilters(raw: SearchParamsInput): ListingFilters {
  const result = getProductsFilterSchema.safeParse({
    page: first(raw.page),
    collectionId: first(raw.collectionId),
    bestSeller: first(raw.bestSeller),
    status: first(raw.status),
    sort: first(raw.sort),
    order: first(raw.order),
    search: first(raw.search),
  })

  const parsed: Partial<ListingFilters> = result.success
    ? (result.data as Partial<ListingFilters>)
    : {}

  return {
    page: parsed.page && parsed.page > 0 ? parsed.page : 1,
    limit: DEFAULT_PAGE_SIZE,
    collectionId: parsed.collectionId,
    bestSeller: parsed.bestSeller,
    status: parsed.status,
    sort: parsed.sort,
    order: parsed.order,
    search: parsed.search || undefined,
  }
}

const hasFacets = (filters: ListingFilters) =>
  Boolean(
    filters.search ||
    filters.collectionId ||
    filters.bestSeller !== undefined ||
    filters.status ||
    filters.sort ||
    filters.order
  )

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params
  const filters = parseListingFilters(await searchParams)
  const t = await getTranslations({ locale, namespace: "productsPage" })

  const enUrl = `${SITE_URL}/en/products`
  const arUrl = `${SITE_URL}/ar/products`
  const faceted = hasFacets(filters)
  const query = buildListingQuery(filters)
  const canonical = `${SITE_URL}/${locale}/products${query ? `?${query}` : ""}`

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical,
      ...(faceted
        ? {}
        : {
          languages: {
            en: enUrl,
            ar: arUrl,
            "x-default": enUrl,
          },
        }),
    },
    ...(faceted ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: t("title"),
      description: t("subtitle"),
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "website",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("subtitle"),
    },
  }
}

async function ProductsListing({
  locale,
  searchParams,
}: {
  locale: "ar" | "en"
  searchParams: Promise<SearchParamsInput>
}) {
  const filters = parseListingFilters(await searchParams)

  const [listing, collections] = await Promise.all([
    getCachedListing(locale, filters),
    getCachedCollections(),
  ])

  return (
    <ProductsContent
      products={listing.products}
      total={listing.total}
      collections={collections}
      filters={filters}
    />
  )
}

function ProductsListingSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "productsPage" })
  const lang = locale === "ar" ? "ar" : "en"

  return (
    <PageTransition>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6 md:space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <p className="max-w-3xl text-xs md:text-sm text-muted-foreground leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <Suspense fallback={<ProductsListingSkeleton />}>
          <ProductsListing locale={lang} searchParams={searchParams} />
        </Suspense>
      </div>
    </PageTransition>
  )
}
