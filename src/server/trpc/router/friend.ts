import { z } from "zod"
import { router, protectedProcedure } from "../trpc"

export const friendRouter = router({
  addFriend: protectedProcedure
    .input(
      z.object({
        receiverId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx
      const { receiverId } = input

      const userId = session.user.id

      return await prisma.friendRequest.create({
        data: {
          senderId: userId,
          receiverId,
        },
      })
    }),

  acceptFriend: protectedProcedure
    .input(
      z.object({
        requestId: z.string(),
        senderId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx
      const { requestId, senderId } = input

      const userId = session.user.id

      await prisma.friendRequest.update({
        where: {
          id: requestId,
        },
        data: {
          accepted: true,
        },
      })

      return await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          friends: {
            connect: {
              id: senderId,
            },
          },
        },
      })
    }),

  declineFriend: protectedProcedure
    .input(
      z.object({
        requestId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx
      const { requestId } = input

      return await prisma.friendRequest.delete({
        where: {
          id: requestId,
        },
      })
    }),

  checkFriendship: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx

    const userId = session.user.id

    const friendList = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        friends: true,
      },
    })

    return friendList
  }),
})
