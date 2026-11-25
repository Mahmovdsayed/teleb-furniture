import z from "zod"
import { paramValidationSchema } from "../../validation/global/param.validation"

export const messageParamSchema = paramValidationSchema

export const messageQuerySchema = z.compile(
  z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    isViewed: z
      .union([z.boolean(), z.enum(["true", "false"])])
      .transform((v) => v === true || v === "true")
      .optional(),
    search: z.string().trim().optional(),
    sort: z.enum(["createdAt", "fullName", "email", "subject", "isViewed", "priority"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
  })
)

export type MessageParamInput = z.infer<typeof messageParamSchema>
export type MessageQueryInput = z.infer<typeof messageQuerySchema>
