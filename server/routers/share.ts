import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { generateShareCard, generateCompatibilityCard, generateFortunCard } from "../utils/shareCardGenerator";
import { TRPCError } from "@trpc/server";

export const shareRouter = router({
  /**
   * 사주 분석 카드 이미지 생성 (SNS 공유용)
   */
  generateSajuCard: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
        yearStem: z.string(),
        yearBranch: z.string(),
        monthStem: z.string(),
        monthBranch: z.string(),
        dayStem: z.string(),
        dayBranch: z.string(),
        timeStem: z.string(),
        timeBranch: z.string(),
        dayMaster: z.string(),
        elementBalance: z.number().min(0).max(100),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const imageUrl = await generateShareCard(input);
        return {
          success: true,
          imageUrl,
        };
      } catch (error) {
        console.error("Error generating saju card:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "카드 생성 중 오류가 발생했습니다.",
        });
      }
    }),

  /**
   * 호환성 분석 카드 이미지 생성 (SNS 공유용)
   */
  generateCompatibilityCard: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        firstSaju: z.string(),
        secondName: z.string(),
        secondSaju: z.string(),
        compatibilityScore: z.number().min(0).max(100),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const imageUrl = await generateCompatibilityCard(
          input.firstName,
          input.firstSaju,
          input.secondName,
          input.secondSaju,
          input.compatibilityScore
        );
        return {
          success: true,
          imageUrl,
        };
      } catch (error) {
        console.error("Error generating compatibility card:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "호환성 카드 생성 중 오류가 발생했습니다.",
        });
      }
    }),

  /**
   * 운세 분석 카드 이미지 생성 (SNS 공유용)
   */
  generateFortuneCard: publicProcedure
    .input(
      z.object({
        analysisType: z.enum(["personality", "health", "wealth", "career", "relationship", "family"]),
        dayMaster: z.string(),
        summary: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const imageUrl = await generateFortunCard(input.analysisType, input.dayMaster, input.summary);
        return {
          success: true,
          imageUrl,
        };
      } catch (error) {
        console.error("Error generating fortune card:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "운세 카드 생성 중 오류가 발생했습니다.",
        });
      }
    }),
});
