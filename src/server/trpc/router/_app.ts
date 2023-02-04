import { router } from "../trpc"
import { authRouter } from "./auth"
import { contactUsRouter } from "./contactUs"
import { friendRouter } from "./friend"
import { postRouter } from "./post"
import { profileRouter } from "./profile"

export const appRouter = router({
  post: postRouter,
  profile: profileRouter,
  auth: authRouter,
  friend: friendRouter,
  contactUs: contactUsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
