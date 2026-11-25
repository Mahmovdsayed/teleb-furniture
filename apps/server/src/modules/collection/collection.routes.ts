import { createCollectionSchema, updateCollectionSchema } from "@teleb/validations/collection"
import { Hono } from "hono"
import type { AppEnv } from "../../types/app"
import { requireAuth } from "../../middleware/auth"
import { zValidate } from "../../middleware/validate"

import { createCollectionController, deleteCollectionController, getCollectionById, getCollections, updateCollectionController } from "./collection.controller"
import { paramValidationSchema } from "../../validation/global/param.validation"
import { cacheMiddleware } from "../../middleware/cache"
import { adminRateLimiter } from "../../middleware/rate-limit"

const collectionsRoutes = new Hono<AppEnv>()
  .post("/create", requireAuth(), adminRateLimiter(), zValidate("json", createCollectionSchema), createCollectionController)
  .patch("/update/:id", requireAuth(), adminRateLimiter(), zValidate("param", paramValidationSchema), zValidate("json", updateCollectionSchema), updateCollectionController)
  .delete("/delete/:id", requireAuth(), adminRateLimiter(), zValidate("param", paramValidationSchema), deleteCollectionController)
  .get("/get", cacheMiddleware({ keyPrefix: "Collections" }), getCollections)
  .get("/get/:id", cacheMiddleware({ keyPrefix: "Collections" }), zValidate("param", paramValidationSchema), getCollectionById)

export default collectionsRoutes
