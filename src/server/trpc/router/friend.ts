import {
  acceptFriendSchema,
  addFriendSchema,
  declineFriendSchema,
  profileIdSchema,
} from "../../../types/friend.schema"
import { router, protectedProcedure } from "../trpc"

export const friendRouter = router({
  addFriend: protectedProcedure
    .input(addFriendSchema)
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
    .input(acceptFriendSchema)
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx
      const { requestId, senderId } = input

      const userId = session.user.id

      await prisma.friendRequest.delete({
        where: {
          id: requestId,
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
    .input(declineFriendSchema)
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx
      const { requestId } = input

      return await prisma.friendRequest.delete({
        where: {
          id: requestId,
        },
      })
    }),

  deleteFriend: protectedProcedure
    .input(profileIdSchema)
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx
      const { profileId } = input

      const userId = session.user.id

      return await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          friends: {
            disconnect: {
              id: profileId,
            },
          },
          friendsRelation: {
            disconnect: {
              id: profileId,
            },
          },
        },
      })
    }),

  getFriends: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx

    const userId = session.user.id

    const userFriends = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        friends: true,
        friendsRelation: true,
      },
    })

    const friendList = userFriends?.friends.map((friend) => friend.id)
    const friendRelationList = userFriends?.friendsRelation.map(
      (friend) => friend.id
    )

    return { friendList, friendRelationList, userFriends }
  }),

  getFriendRequests: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx

    const userId = session.user.id

    const receivedRequests = await prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
      },
      select: {
        id: true,
        sender: true,
      },
    })

    const requestsList = receivedRequests?.map((request) => {
      return {
        id: request.id,
        senderId: request.sender.id,
        senderName: request.sender.name,
        senderAvatar: request.sender.image,
      }
    })
    return requestsList
  }),

  checkIfRequestSent: protectedProcedure
    .input(profileIdSchema)
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx
      const { profileId } = input

      const userId = session.user.id

      const sentRequests = await prisma.friendRequest.findMany({
        where: {
          senderId: userId,
          receiverId: profileId,
        },
        select: {
          id: true,
          receiver: {
            select: {
              id: true,
            },
          },
        },
      })

      const reqHasBeenSent = sentRequests?.length > 0
      return reqHasBeenSent
    }),

  checkIfRequestReceived: protectedProcedure
    .input(profileIdSchema)
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx
      const { profileId } = input

      const userId = session.user.id

      const receivedRequests = await prisma.friendRequest.findMany({
        where: {
          receiverId: userId,
          senderId: profileId,
        },
        select: {
          id: true,
          sender: {
            select: {
              id: true,
            },
          },
        },
      })

      const reqHasBeenReceived = receivedRequests?.length > 0
      const reqId = receivedRequests?.map((request) => request.id)[0]

      return { reqHasBeenReceived, reqId }
    }),
})
