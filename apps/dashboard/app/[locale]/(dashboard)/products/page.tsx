import ProductPage from "@/components/pages/products/ProductPage";
import ProductSkeleton from "@teleb/ui/components/product-skeleton";
import { Suspense } from "react";

export const instant = false;

const Page = () => {
  return (
    <main>
      <Suspense fallback={<ProductSkeleton />}>
        <ProductPage />
      </Suspense>
    </main>
  );
};

export default Page;