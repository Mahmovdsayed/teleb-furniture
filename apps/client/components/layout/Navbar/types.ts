import type { Collection } from "@teleb/types/collection";
import type { Product } from "@teleb/types/product";

export type { Collection } from "@teleb/types/collection"
export type { Product } from "@teleb/types/product"

export interface SearchResultsProps {
  isSearching: boolean
  hasResults: boolean
  searchQuery: string
  products: Product[]
  collections: Collection[]
  isAr: boolean
  onProductClick: (id: number, slug?: string) => void
  onCollectionClick: (collection: Collection) => void
  onViewMore: () => void
}
