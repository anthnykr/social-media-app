import { z } from "zod"

export const profileInfoSchema = z.object({
  userId: z.string(),
})

export const updateBioSchema = z.object({
  newBio: z.string(),
})

export const updateAvatarSchema = z.object({
  fileName: z.string(),
})

export type profileInfoInput = z.infer<typeof profileInfoSchema>

export type updateBioInput = z.infer<typeof updateBioSchema>

export type updateAvatarInput = z.infer<typeof updateAvatarSchema>
