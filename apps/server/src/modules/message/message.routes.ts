import { createMessageSchema } from "@teleb/validations/message"
import { Hono } from "hono"
import type { AppEnv } from "../../types/app"
import { requireAuth } from "../../middleware/auth"
import { adminRateLimiter, messageRateLimiter } from "../../middleware/rate-limit"
import { zValidate } from "../../middleware/validate"
import { paramValidationSchema } from "../../validation/global/param.validation"
import { messageQuerySchema } from "./message.schema"
import { createMessageController, deleteMessageController, getAllMessagesController, getMessageByIdController, markMessageAsViewedController } from "./message.controller"
import { cacheMiddleware } from "../../middleware/cache"

const messageRoutes = new Hono<AppEnv>()
  .post("/create", messageRateLimiter(), zValidate("json", createMessageSchema), createMessageController)
  .get("/get", cacheMiddleware({ keyPrefix: "Messages" }), requireAuth(), adminRateLimiter(), zValidate("query", messageQuerySchema), getAllMessagesController)
  .get("/get/:id", cacheMiddleware({ keyPrefix: "Messages" }), requireAuth(), adminRateLimiter(), zValidate("param", paramValidationSchema), getMessageByIdController)
  .patch("/update/:id/view", requireAuth(), adminRateLimiter(), zValidate("param", paramValidationSchema), markMessageAsViewedController)
  .delete("/delete/:id", requireAuth(), adminRateLimiter(), zValidate("param", paramValidationSchema), deleteMessageController)

export default messageRoutes
