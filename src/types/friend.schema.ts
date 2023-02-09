import { z } from "zod"

export const addFriendSchema = z.object({
  receiverId: z.string(),
})

export const acceptFriendSchema = z.object({
  requestId: z.string(),
  senderId: z.string(),
})

export const declineFriendSchema = z.object({
  requestId: z.string(),
})

export const profileIdSchema = z.object({
  profileId: z.string(),
})

export type addFriendInput = z.infer<typeof addFriendSchema>

export type acceptFriendInput = z.infer<typeof acceptFriendSchema>

export type declineFriendInput = z.infer<typeof declineFriendSchema>

export type profileIdInput = z.infer<typeof profileIdSchema>
