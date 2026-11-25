import { addBannerImageSchema, createBannerSchema, reorderBannerImagesSchema, updateBannerImageSchema, updateBannerSchema } from "@teleb/validations/banner"
import { Hono } from "hono"
import type { AppEnv } from "../../types/app"
import { requireAuth } from "../../middleware/auth"
import { adminRateLimiter } from "../../middleware/rate-limit"
import { cacheMiddleware } from "../../middleware/cache"
import { zValidate } from "../../middleware/validate"
import { paramValidationSchema } from "../../validation/global/param.validation"
import { bannerImageParamSchema } from "./banner.schema"
import {
  addBannerImageController,
  createBannerController,
  deleteBannerController,
  deleteBannerImageController,
  getAllBannersController,
  getBannerByIdController,
  reorderBannerImagesController,
  updateBannerController,
  updateBannerImageController,
} from "./banner.controller"

const bannerRoutes = new Hono<AppEnv>()
  .get("/get", cacheMiddleware({ keyPrefix: "Banners" }), getAllBannersController)
  .get("/get/:id", cacheMiddleware({ keyPrefix: "Banners" }), zValidate("param", paramValidationSchema), getBannerByIdController)
  .post("/create", requireAuth(), adminRateLimiter(), zValidate("json", createBannerSchema), createBannerController)
  .patch("/update/:id", requireAuth(), adminRateLimiter(), zValidate("param", paramValidationSchema), zValidate("json", updateBannerSchema), updateBannerController)
  .delete("/delete/:id", requireAuth(), adminRateLimiter(), zValidate("param", paramValidationSchema), deleteBannerController)
  .post("/:id/images", requireAuth(), adminRateLimiter(), zValidate("param", paramValidationSchema), zValidate("json", addBannerImageSchema), addBannerImageController)
  .patch(
    "/:id/images/reorder",
    requireAuth(),
    adminRateLimiter(),
    zValidate("param", paramValidationSchema),
    zValidate("json", reorderBannerImagesSchema),
    reorderBannerImagesController
  )
  .patch(
    "/:id/images/:imageId",
    requireAuth(),
    adminRateLimiter(),
    zValidate("param", bannerImageParamSchema),
    zValidate("json", updateBannerImageSchema),
    updateBannerImageController
  )
  .delete("/:id/images/:imageId", requireAuth(), adminRateLimiter(), zValidate("param", bannerImageParamSchema), deleteBannerImageController)

export default bannerRoutes
