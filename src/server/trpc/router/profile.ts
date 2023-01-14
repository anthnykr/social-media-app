import { z } from "zod"
import { router, protectedProcedure } from "../trpc"

export const profileRouter = router({
  profileInfo: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx

    const userId = session.user.id

    const profileInfo = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        profile: true,
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

      return prisma.profile.update({
        where: {
          id: userId,
        },
        data: {
          bio: newBio,
        },
      })
    }),

  // updateAvatar: protectedProcedure
})
