import { z } from "zod"
import { router, protectedProcedure } from "../trpc"

export const profileRouter = router({
  profileInfo: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx
      const { userId } = input

      const profileInfo = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          name: true,
          image: true,
          bio: true,
        },
      })

      return profileInfo
    }),

  updateBio: protectedProcedure
    .input(
      z.object({
        newBio: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx
      const { newBio } = input

      const userId = session.user.id

      return await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          bio: newBio,
        },
      })
    }),

  updateAvatar: protectedProcedure
    .input(
      z.object({
        newAvatar: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx
      const { newAvatar } = input

      const userId = session.user.id

      return await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          image: newAvatar,
        },
      })
    }),
})
