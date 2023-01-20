import { z } from "zod"
import { router, protectedProcedure } from "../trpc"

export const friendRouter = router({
  // addFriend: protectedProcedure.input().mutation(),
})
