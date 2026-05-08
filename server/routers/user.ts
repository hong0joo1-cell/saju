import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const userRouter = router({
  /**
   * 사용자 프로필 조회 (로그인 필수)
   */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "데이터베이스 연결 실패" });

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      if (!user || user.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "사용자를 찾을 수 없습니다.",
        });
      }

      return user[0];
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      console.error("Get profile error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "프로필 조회 중 오류가 발생했습니다.",
      });
    }
  }),

  /**
   * 사용자 프로필 업데이트 (로그인 필수)
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100).optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "데이터베이스 연결 실패" });

        // 업데이트할 필드만 준비
        const updateData: any = {};
        if (input.name !== undefined) {
          updateData.name = input.name;
        }
        if (input.email !== undefined) {
          updateData.email = input.email;
        }

        // 업데이트할 필드가 없으면 에러
        if (Object.keys(updateData).length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "업데이트할 필드가 없습니다.",
          });
        }

        const result = await db
          .update(users)
          .set(updateData)
          .where(eq(users.id, ctx.user.id));

        if (!result) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "프로필 업데이트에 실패했습니다.",
          });
        }

        // 업데이트된 사용자 정보 반환
        const updatedUser = await db
          .select()
          .from(users)
          .where(eq(users.id, ctx.user.id))
          .limit(1);

        if (!updatedUser || updatedUser.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "업데이트된 사용자를 찾을 수 없습니다.",
          });
        }

        return {
          success: true,
          user: updatedUser[0],
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Update profile error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "프로필 업데이트 중 오류가 발생했습니다.",
        });
      }
    }),
});
