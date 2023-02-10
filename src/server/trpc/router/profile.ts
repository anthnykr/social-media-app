import {
  profileInfoSchema,
  updateAvatarSchema,
  updateBioSchema,
} from "../../../types/profile.schema"
import { uploadAvatarSchema } from "../../../types/upload.schema"
import { router, protectedProcedure } from "../trpc"
import S3 from "aws-sdk/clients/s3"
import { TRPCError } from "@trpc/server"

const s3 = new S3({
  region: process.env.UPLOAD_REGION,
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  signatureVersion: "v4",
})

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
}

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

  getSignedUrl: protectedProcedure
    .input(uploadAvatarSchema)
    .mutation(async ({ input }) => {
      const { name, type } = input

      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: name,
        Expires: 60,
        ContentType: type,
      }

      const url = await s3.getSignedUrlPromise("putObject", params)
      return url
    }),

  getNumFriends: protectedProcedure
    .input(profileInfoSchema)
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx
      const { userId } = input

      try {
        const numFriends = await prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            _count: {
              select: {
                friends: true,
                friendsRelation: true,
              },
            },
          },
        })

        if (!numFriends) throw new Error("User not found")
        return numFriends._count.friends + numFriends._count.friendsRelation
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        })
      }
    }),
})
