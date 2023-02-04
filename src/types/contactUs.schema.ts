import { z } from "zod"

export const contactUsSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  message: z.string(),
})

export type contactUs = z.infer<typeof contactUsSchema>
