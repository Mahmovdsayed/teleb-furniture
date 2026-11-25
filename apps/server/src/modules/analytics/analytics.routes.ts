import { Hono } from "hono"
import type { AppEnv } from "../../types/app"
import { getAnalyticsController } from "./analytics.controller"
import { cacheMiddleware } from "../../middleware/cache"

const analyticsRoutes = new Hono<AppEnv>().get("/all", cacheMiddleware({ keyPrefix: "Analytics" }), getAnalyticsController)

export default analyticsRoutes
