import { z } from "zod"

export const uploadAvatarSchema = z.object({
  name: z.string(),
  type: z.string(),
})

export type uploadAvatarInput = z.infer<typeof uploadAvatarSchema>
