import { router } from "../trpc";
import { authRouter } from "./auth";
import { postRouter } from "./post";
import { profileRouter } from "./profile";

export const appRouter = router({
  post: postRouter,
  profile: profileRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
