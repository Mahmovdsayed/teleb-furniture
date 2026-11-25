import { z } from "zod"

export const collectionSchema = z.object({
  arName: z.string().trim().min(1).max(100),
  enName: z.string().trim().min(1).max(100),
  icon: z.string().trim().min(1).max(50),
})

export const createCollectionSchema = z.compile(collectionSchema)

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>

/** Shared update contract (the server's chain order is canonical). */
export const updateCollectionSchema = z
  .compile(collectionSchema.partial())
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    error: "At least one field must be provided",
  })

export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>
