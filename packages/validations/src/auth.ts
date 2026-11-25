import z from "zod"

export const signUpSchema = z.compile(
  z.object({
    name: z.string().min(1).max(20),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(1),
  })
)

export const signInSchema = z.compile(
  z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(1),
  })
)

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>

export const loginSchema = z.compile(
  z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })
)

export type LoginFormValues = z.infer<typeof loginSchema>
