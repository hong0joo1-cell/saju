import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { sajuRouter } from "./routers/saju";
import { consultationRouter } from "./routers/consultation";
import { shareRouter } from "./routers/share";
import { kakaoRouter } from "./routers/kakao";
import { userRouter } from "./routers/user";

export const appRouter = router({
  system: systemRouter,
  saju: sajuRouter,
  consultation: consultationRouter,
  share: shareRouter,
  kakao: kakaoRouter,
  user: userRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
