import {
  profileInfoSchema,
  updateAvatarSchema,
  updateBioSchema,
} from "../../../types/profile.schema"
import { router, protectedProcedure } from "../trpc"

export const profileRouter = router({
  profileInfo: protectedProcedure
    .input(profileInfoSchema)
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx
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
    .input(updateBioSchema)
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
    .input(updateAvatarSchema)
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
