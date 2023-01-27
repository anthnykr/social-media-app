import { z } from "zod"
import { postSchema } from "../../../components/CreatePost"

import { router, protectedProcedure } from "../trpc"

export const postRouter = router({
  create: protectedProcedure
    .input(postSchema)
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx
      const { text } = input

      const authorId = session.user.id

      return await prisma.post.create({
        data: {
          text,
          authorId,
        },
      })
    }),

  newsfeed: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(100).default(5),
        who: z
          .object({
            id: z.string().optional(),
          })
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx
      const { cursor, limit, who } = input

      const userId = session.user.id

      const posts = await prisma.post.findMany({
        take: limit + 1,
        where: {
          author: who,
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          author: {
            select: {
              name: true,
              image: true,
              id: true,
              email: true,
            },
          },

          likes: {
            where: {
              userId,
            },
            select: {
              userId: true,
            },
          },

          _count: {
            select: {
              likes: true,
            },
          },
        },
      })

      let nextCursor: typeof cursor | undefined = undefined

      if (posts.length > limit) {
        const nextItem = posts.pop() as typeof posts[number]
        nextCursor = nextItem.id
      }

      return {
        posts,
        nextCursor,
      }
    }),

  like: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx
      const { postId } = input

      const userId = session.user.id

      return await prisma.like.create({
        data: {
          postId,
          userId,
        },
      })
    }),

  unlike: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx
      const { postId } = input

      const userId = session.user.id

      return await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      })
    }),
})
