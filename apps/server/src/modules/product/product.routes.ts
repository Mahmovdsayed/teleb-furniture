import { createProductSchema, updateProductSchema, productParamSchema, productSlugParamSchema, productQuerySchema, searchProductQuerySchema, updateStatusSchema, updateBestSellerSchema, createProductImageSchema, updateProductImageSchema, imageParamSchema, setMainImageSchema, reorderImagesSchema, createProductVariantSchema, updateProductVariantSchema, variantParamSchema } from "@teleb/validations/product";
import { Hono } from "hono";
import type { AppEnv } from "../../types/app";
import { requireAuth } from "../../middleware/auth";
import { zValidate } from "../../middleware/validate";
import { adminRateLimiter } from "../../middleware/rate-limit";
import { cacheMiddleware } from "../../middleware/cache";

import { getAllProductsController, searchProductsController, getProductByIdController, getProductBySlugController, createProductController, updateProductController, deleteProductController, updateProductStatusController, updateProductBestSellerController, addProductImageController, updateProductImageController, deleteProductImageController, setMainImageController, reorderImagesController, addProductVariantController, updateProductVariantController, deleteProductVariantController } from "./product.controller";

const productRoutes = new Hono<AppEnv>()
  .get("/", cacheMiddleware({ keyPrefix: "Products" }), zValidate("query", productQuerySchema), getAllProductsController)
  .get("/search", zValidate("query", searchProductQuerySchema), searchProductsController)
  .get("/slug/:slug", cacheMiddleware({ keyPrefix: "Products" }), zValidate("param", productSlugParamSchema), getProductBySlugController)
  .get("/:id", cacheMiddleware({ keyPrefix: "Products" }), zValidate("param", productParamSchema), getProductByIdController)
  .post("/create", requireAuth(), adminRateLimiter(), zValidate("json", createProductSchema), createProductController)
  .patch("/update/:id", requireAuth(), adminRateLimiter(), zValidate("param", productParamSchema), zValidate("json", updateProductSchema), updateProductController)
  .delete("/delete/:id", requireAuth(), adminRateLimiter(), zValidate("param", productParamSchema), deleteProductController)
  .patch("/status/:id", requireAuth(), adminRateLimiter(), zValidate("param", productParamSchema), zValidate("json", updateStatusSchema), updateProductStatusController)
  .patch(
    "/best-seller/:id",
    requireAuth(),
    adminRateLimiter(),
    zValidate("param", productParamSchema),
    zValidate("json", updateBestSellerSchema),
    updateProductBestSellerController
  )
  .post("/images/:id", requireAuth(), adminRateLimiter(), zValidate("param", productParamSchema), zValidate("json", createProductImageSchema), addProductImageController)
  .patch("/images/main/:id", requireAuth(), adminRateLimiter(), zValidate("param", productParamSchema), zValidate("json", setMainImageSchema), setMainImageController)
  .patch("/images/reorder/:id", requireAuth(), adminRateLimiter(), zValidate("param", productParamSchema), zValidate("json", reorderImagesSchema), reorderImagesController)
  .patch(
    "/images/update/:id/:imageId",
    requireAuth(),
    adminRateLimiter(),
    zValidate("param", imageParamSchema),
    zValidate("json", updateProductImageSchema),
    updateProductImageController
  )
  .delete("/images/delete/:id/:imageId", requireAuth(), adminRateLimiter(), zValidate("param", imageParamSchema), deleteProductImageController)
  .post("/variants/:id", requireAuth(), adminRateLimiter(), zValidate("param", productParamSchema), zValidate("json", createProductVariantSchema), addProductVariantController)
  .patch(
    "/variants/update/:id/:variantId",
    requireAuth(),
    adminRateLimiter(),
    zValidate("param", variantParamSchema),
    zValidate("json", updateProductVariantSchema),
    updateProductVariantController
  )
  .delete("/variants/delete/:id/:variantId", requireAuth(), adminRateLimiter(), zValidate("param", variantParamSchema), deleteProductVariantController)

export default productRoutes
