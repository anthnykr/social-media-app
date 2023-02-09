import { z } from "zod"

export const postSchema = z.object({
  text: z
    .string({
      required_error: "Post text is required",
    })
    .min(1)
    .max(2000),
})

export const postIdSchema = z.object({
  postId: z.string(),
})

export const newsFeedSchema = z.object({
  cursor: z.string().nullish(),
  limit: z.number().min(1).max(100).default(5),
  who: z
    .object({
      id: z.string().optional(),
    })
    .optional(),
})

export type postInput = z.infer<typeof postSchema>

export type postIdInput = z.infer<typeof postIdSchema>

export type newsFeedInput = z.infer<typeof newsFeedSchema>
