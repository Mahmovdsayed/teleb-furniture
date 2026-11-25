"use client"

import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@teleb/ui/components/input"

import { CollectionPills } from "./CollectionPills"
import { ProductsSortSelect } from "./ProductsSortSelect"
import { ProductsFilterSidebar } from "./ProductsFilterSidebar"
import { ProductsFilterDrawer } from "./ProductsFilterDrawer"
import { ProductsGrid } from "./ProductsGrid"
import {
  DEFAULT_PAGE_SIZE,
  buildListingQuery,
  type ListingFilters,
  type SortOption,
} from "./types"
import { Product } from "@teleb/types/product"
import { Collection } from "@teleb/types/collection"

interface ProductsContentProps {
  products: Product[]
  total: number
  collections: Collection[]
  filters: ListingFilters
}

export function ProductsContent({
  products,
  total,
  collections,
  filters,
}: ProductsContentProps) {
  const t = useTranslations("productsPage")
  const locale = useLocale()
  const isRtl = locale === "ar"

  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const [searchInput, setSearchInput] = useState(filters.search ?? "")

  useEffect(() => {
    setSearchInput(filters.search ?? "")
  }, [filters.search])

  const currentSort: SortOption = useMemo(() => {
    if (filters.sort === "name") {
      return filters.order === "desc" ? "name_desc" : "name_asc"
    }
    if (filters.sort === "createdAt" && filters.order === "asc") {
      return "oldest"
    }
    return "newest"
  }, [filters.sort, filters.order])

  const navigate = useCallback(
    (updates: Partial<ListingFilters>) => {
      const next: ListingFilters = { ...filters, ...updates, page: 1, limit: DEFAULT_PAGE_SIZE }
      const query = buildListingQuery(next)

      startTransition(() => {
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: true })
      })
    },
    [filters, pathname, router]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchInput.trim()
      if (trimmed !== (filters.search ?? "")) {
        navigate({ search: trimmed ? trimmed : undefined })
      }
    }, 350)

    return () => clearTimeout(timer)
  }, [searchInput, filters.search, navigate])

  const handlePageChange = (page: number) => {
    const query = buildListingQuery({ ...filters, page, limit: DEFAULT_PAGE_SIZE })

    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: true })
    })
  }

  const handleSortChange = (option: SortOption) => {
    switch (option) {
      case "oldest":
        navigate({ sort: "createdAt", order: "asc" })
        break
      case "name_asc":
        navigate({ sort: "name", order: "asc" })
        break
      case "name_desc":
        navigate({ sort: "name", order: "desc" })
        break
      case "newest":
      default:
        navigate({ sort: "createdAt", order: "desc" })
        break
    }
  }

  const handleSelectCollection = (id: number | null) => {
    navigate({ collectionId: id ?? undefined })
  }

  const handleToggleBestSeller = () => {
    navigate({ bestSeller: filters.bestSeller === undefined ? true : undefined })
  }

  const handleToggleStatus = () => {
    navigate({ status: filters.status === "active" ? undefined : "active" })
  }

  const handleResetFilters = () => {
    setSearchInput("")
    startTransition(() => {
      router.push(pathname, { scroll: false })
    })
  }

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.collectionId) count++
    if (filters.bestSeller !== undefined) count++
    if (filters.status === "active") count++
    if (filters.search) count++
    return count
  }, [filters])

  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PAGE_SIZE))

  return (
    <>
      <CollectionPills
        collections={collections}
        selectedId={filters.collectionId ?? null}
        onSelect={handleSelectCollection}
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute inset-s-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-10 ps-9 pe-9 text-xs rounded-xl bg-card border-border/80 shadow-2xs focus-visible:ring-primary/20"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("")
                navigate({ search: undefined })
              }}
              className="absolute inset-e-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2.5">
          <div className="lg:hidden">
            <ProductsFilterDrawer
              collections={collections}
              selectedCollectionId={filters.collectionId ?? null}
              onSelectCollection={handleSelectCollection}
              bestSeller={filters.bestSeller === true}
              onToggleBestSeller={handleToggleBestSeller}
              status={filters.status === "active" ? "active" : "all"}
              onToggleStatus={handleToggleStatus}
              activeFiltersCount={activeFiltersCount}
              onResetFilters={handleResetFilters}
            />
          </div>

          <ProductsSortSelect
            value={currentSort}
            onChange={handleSortChange}
            className="rounded-xl h-10 border-border/80 bg-card shadow-2xs"
          />
        </div>
      </div>

      <div className="flex items-start gap-8">
        <ProductsFilterSidebar
          collections={collections}
          selectedCollectionId={filters.collectionId ?? null}
          onSelectCollection={handleSelectCollection}
          bestSeller={filters.bestSeller === true}
          onToggleBestSeller={handleToggleBestSeller}
          status={filters.status === "active" ? "active" : "all"}
          onToggleStatus={handleToggleStatus}
          activeFiltersCount={activeFiltersCount}
          onResetFilters={handleResetFilters}
        />

        <div
          className={cn("flex-1 min-w-0 space-y-4", isPending && "opacity-60 transition-opacity")}
          aria-busy={isPending}
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground pb-1">
            <span>{t("resultsFound", { count: total })}</span>
          </div>

          <ProductsGrid
            products={products}
            isLoading={false}
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onResetFilters={handleResetFilters}
            isRtl={isRtl}
          />
        </div>
      </div>
    </>
  )
}
