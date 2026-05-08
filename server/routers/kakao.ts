import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";

export const kakaoRouter = router({
  /**
   * 카카오톡 공유 링크 생성
   * 사주 분석 결과를 카카오톡으로 공유할 수 있는 링크를 생성합니다.
   */
  generateShareLink: publicProcedure
    .input(
      z.object({
        title: z.string().min(1).max(100),
        description: z.string().min(1).max(500),
        imageUrl: z.string().url(),
        redirectUrl: z.string().url(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // 카카오톡 공유 메타데이터 생성
        const shareData = {
          title: input.title,
          description: input.description,
          imageUrl: input.imageUrl,
          redirectUrl: input.redirectUrl,
          timestamp: new Date().toISOString(),
        };

        // 공유 링크 생성 (실제로는 카카오 API를 통해 생성)
        const shareLink = `${input.redirectUrl}?share=${Buffer.from(JSON.stringify(shareData)).toString("base64")}`;

        return {
          success: true,
          shareLink,
          shareData,
        };
      } catch (error) {
        console.error("Error generating share link:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "공유 링크 생성 중 오류가 발생했습니다.",
        });
      }
    }),

  /**
   * 카카오톡 공유 로그 기록
   */
  logShare: publicProcedure
    .input(
      z.object({
        type: z.enum(["saju", "compatibility", "fortune"]),
        title: z.string(),
        platform: z.enum(["kakao", "facebook", "twitter", "link"]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // 공유 로그 기록 (분석용)
        console.log(`[Share] Type: ${input.type}, Title: ${input.title}, Platform: ${input.platform}`);

        return {
          success: true,
          message: "공유가 기록되었습니다.",
        };
      } catch (error) {
        console.error("Error logging share:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "공유 기록 중 오류가 발생했습니다.",
        });
      }
    }),

  /**
   * 카카오톡 공유 버튼 설정 정보 조회
   */
  getShareConfig: publicProcedure.query(async () => {
    return {
      kakaoAppId: process.env.KAKAO_APP_ID || "",
      kakaoJSKey: process.env.KAKAO_JS_KEY || "",
      shareTemplateId: process.env.KAKAO_SHARE_TEMPLATE_ID || "",
      platforms: ["kakao", "facebook", "twitter", "link"],
    };
  }),
});
