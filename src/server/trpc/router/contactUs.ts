import { contactUsSchema } from "../../../types/contactUs.schema"
import { router, protectedProcedure } from "../trpc"

export const contactUsRouter = router({
  submitMessage: protectedProcedure
    .input(contactUsSchema)
    .mutation(async ({ ctx, input }) => {
      const { firstName, lastName, email, message } = input

      const contactUs = await ctx.prisma.contactUs.create({
        data: {
          firstName,
          lastName,
          email,
          message,
        },
      })

      return contactUs
    }),
})
