import { signInSchema } from "@teleb/validations/auth"
import { Hono } from "hono"
import { zValidate } from "../../middleware/validate"

import { logOutController, signInController } from "./auth.controller"
import type { AppEnv } from "../../types/app"
import { authRateLimiter, loginRateLimiter } from "../../middleware/rate-limit"

const authRoutes = new Hono<AppEnv>()
  // .post("/register", zValidate("json", signUpSchema), signUpController)
  .post("/login", loginRateLimiter(), zValidate("json", signInSchema), signInController)
  .post("/logout", authRateLimiter(), logOutController)

export default authRoutes
