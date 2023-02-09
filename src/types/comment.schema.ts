import { z } from "zod"

export const commentSchema = z.object({
  comment: z
    .string({
      required_error: "Comment text is required",
    })
    .min(1)
    .max(300),
})

export const createCommentSchema = z.object({
  postId: z.string(),
  comment: z
    .string({
      required_error: "Comment text is required",
    })
    .min(1)
    .max(300),
})

export const getCommentsSchema = z.object({
  postId: z.string(),
})

export type commentInput = z.infer<typeof commentSchema>

export type createCommentInput = z.infer<typeof createCommentSchema>

export type getCommentsInput = z.infer<typeof getCommentsSchema>
