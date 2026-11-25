import type { Metadata } from "next"
import HomePage from "@/components/pages/Home/HomePage"
import { PageTransition } from "@teleb/ui/components/page-transition"
import {
  getCachedBanners,
  getCachedBestSellers,
  getCachedCollections,
  getCachedExploreProducts,
} from "@/lib/cached-data"
import { SITE_URL } from "@/lib/seo/site"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const canonical = `${SITE_URL}/${locale}`

  return {
    alternates: {
      canonical,
      languages: {
        en: `${SITE_URL}/en`,
        ar: `${SITE_URL}/ar`,
        "x-default": `${SITE_URL}/en`,
      },
    },
  }
}

const homeHeading: Record<"en" | "ar", string> = {
  en: "Teleb Furniture — premium, handcrafted furniture in Egypt",
  ar: "طلب للأثاث — أثاث فاخر مصنوع بحرفية في مصر",
}

export default async function HomeRoute({ params }: Props) {
  const { locale } = await params
  const lang = locale === "ar" ? "ar" : "en"

  const [banners, collections, bestSellers, exploreProducts] = await Promise.all([
    getCachedBanners(),
    getCachedCollections(),
    getCachedBestSellers(lang),
    getCachedExploreProducts(lang),
  ])

  return (
    <PageTransition>
      <h1 className="sr-only">{homeHeading[lang]}</h1>
      <HomePage
        banners={banners}
        collections={collections}
        bestSellers={bestSellers}
        exploreProducts={exploreProducts}
      />
    </PageTransition>
  )
}
