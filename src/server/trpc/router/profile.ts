import { router, protectedProcedure } from "../trpc";

export const profileRouter = router({
  profileInfo: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;

    const userId = session.user.id;

    const profileInfo = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        profile: true,
      },
    });

    return profileInfo;
  }),
});
