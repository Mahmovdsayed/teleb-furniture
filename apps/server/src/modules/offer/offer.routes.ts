import { createOfferSchema, offerQuerySchema, updateOfferSchema, updateOfferShowBannerSchema, updateOfferStatusSchema } from "@teleb/validations/offer"
import { Hono } from "hono"
import type { AppEnv } from "../../types/app"
import { requireAuth } from "../../middleware/auth"
import { adminRateLimiter } from "../../middleware/rate-limit"
import { cacheMiddleware } from "../../middleware/cache"
import { zValidate } from "../../middleware/validate"
import { paramValidationSchema } from "../../validation/global/param.validation"

import {
  createOfferController,
  deleteOfferController,
  getAllOffersController,
  getCurrentBannerOfferController,
  getOfferByIdController,
  updateOfferController,
  updateOfferShowBannerController,
  updateOfferStatusController,
} from "./offer.controller"

const offerRoutes = new Hono<AppEnv>()
  .get("/get", cacheMiddleware({ keyPrefix: "Offers" }), zValidate("query", offerQuerySchema), getAllOffersController)
  .get("/banner", cacheMiddleware({ keyPrefix: "Offers" }), getCurrentBannerOfferController)
  .get("/get/:id", cacheMiddleware({ keyPrefix: "Offers" }), zValidate("param", paramValidationSchema), getOfferByIdController)
  .post("/create", requireAuth(), adminRateLimiter(), zValidate("json", createOfferSchema), createOfferController)
  .patch(
    "/update/:id/status",
    requireAuth(),
    adminRateLimiter(),
    zValidate("param", paramValidationSchema),
    zValidate("json", updateOfferStatusSchema),
    updateOfferStatusController
  )
  .patch(
    "/update/:id/show-banner",
    requireAuth(),
    adminRateLimiter(),
    zValidate("param", paramValidationSchema),
    zValidate("json", updateOfferShowBannerSchema),
    updateOfferShowBannerController
  )
  .patch("/update/:id", requireAuth(), adminRateLimiter(), zValidate("param", paramValidationSchema), zValidate("json", updateOfferSchema), updateOfferController)
  .delete("/delete/:id", requireAuth(), adminRateLimiter(), zValidate("param", paramValidationSchema), deleteOfferController)

export default offerRoutes
