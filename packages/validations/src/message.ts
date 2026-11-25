import z from "zod"

export const EGYPTIAN_PHONE_REGEX = /^(?:\+20[\s-]?(?:0)?|0020[\s-]?(?:0)?|0)?1[0125](?:[\s-]?[0-9]){8}$/

export const createMessageSchema = z.compile(
  z.object({
    fullName: z.string().trim().min(2).max(100),
    email: z.string().trim().email(),
    phone: z.string().trim().max(30).regex(EGYPTIAN_PHONE_REGEX),
    subject: z.string().trim().min(2).max(200),
    message: z.string().trim().min(5).max(5000),
  })
)

export type CreateMessageInput = z.infer<typeof createMessageSchema>
