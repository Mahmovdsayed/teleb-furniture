import z from "zod"
import { paramValidationSchema } from "../../validation/global/param.validation"
export const bannerParamSchema = paramValidationSchema

export const bannerImageParamSchema = z.compile(
  z.object({
    id: z.coerce.number().int().positive(),
    imageId: z.coerce.number().int().min(0),
  })
)

export type BannerParamInput = z.infer<typeof bannerParamSchema>
export type BannerImageParamInput = z.infer<typeof bannerImageParamSchema>
