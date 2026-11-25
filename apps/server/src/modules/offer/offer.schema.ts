import type { z } from "zod"
import { paramValidationSchema } from "../../validation/global/param.validation"

export const offerParamSchema = paramValidationSchema
export type OfferParamInput = z.infer<typeof offerParamSchema>
