import { Suspense } from "react"

import Banner from "@/components/ui/Banner"
import CollectionsCarousel from "./CollectionsCarousel"
import BestSellers from "./BestSellers"
import ExploreProducts from "./ExploreProducts"
import {
  BannerSkeleton,
  BestSellersSkeleton,
  CollectionsSkeleton,
} from "@/components/skeleton"
import type { Banner as BannerType } from "@teleb/types/banner"
import { Collection } from "@teleb/types/collection"
import { Product } from "@teleb/types/product"


interface HomePageProps {
  banners?: BannerType[]
  collections?: Collection[]
  bestSellers?: Product[]
  exploreProducts?: Product[]
}

export default function HomePage({
  banners,
  collections,
  bestSellers,
  exploreProducts,
}: HomePageProps) {
  return (
    <>
      <section className="w-full">
        <Suspense fallback={<BannerSkeleton />}>
          <Banner initialBanners={banners} />
        </Suspense>
      </section>

      <Suspense fallback={<CollectionsSkeleton />}>
        <CollectionsCarousel collections={collections} />
      </Suspense>

      <Suspense fallback={<BestSellersSkeleton />}>
        <BestSellers initialProducts={bestSellers} />
      </Suspense>

      <ExploreProducts initialProducts={exploreProducts} />
    </>
  )
}
