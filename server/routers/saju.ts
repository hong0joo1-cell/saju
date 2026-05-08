import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { calculateSaju, analyzeSaju, calculateElementBalance, calculateCompatibility } from "../utils/sajuCalculator";
import { saveSajuAnalysis, getSajuAnalysisByUserId, getSajuAnalysisById, saveCompatibilityAnalysis, getCompatibilityAnalysisByUserId } from "../db";
import { TRPCError } from "@trpc/server";
import { sajuAnalysis } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { getDb } from "../db";

export const sajuRouter = router({
  /**
   * 사주 분석 계산 (공개 API)
   * 생년월일시를 입력받아 사주팔자와 분석 결과를 반환
   */
  analyze: publicProcedure
    .input(
      z.object({
        year: z.number().int().min(1900).max(2100),
        month: z.number().int().min(1).max(12),
        day: z.number().int().min(1).max(31),
        hour: z.number().int().min(0).max(23),
        minute: z.number().int().min(0).max(59).optional().default(0),
        gender: z.enum(["M", "F"]).optional().default("M"),
      })
    )
    .query(({ input }) => {
      try {
        const saju = calculateSaju(input.year, input.month, input.day, input.hour, input.minute, input.gender);
        const analysis = analyzeSaju(input.year, input.month, input.day, input.hour, input.minute, input.gender);
        const elementBalance = calculateElementBalance(analysis.elements);

        return {
          saju,
          elements: analysis.elements,
          elementBalance,
          tenStems: analysis.tenStems,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "사주 계산 중 오류가 발생했습니다.",
        });
      }
    }),

  /**
   * 사주 분석 결과 저장 (로그인 필수)
   */
  save: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        year: z.number().int().min(1900).max(2100),
        month: z.number().int().min(1).max(12),
        day: z.number().int().min(1).max(31),
        hour: z.number().int().min(0).max(23),
        minute: z.number().int().min(0).max(59).optional().default(0),
        gender: z.enum(["M", "F"]).optional().default("M"),
        yearStem: z.string(),
        yearBranch: z.string(),
        monthStem: z.string(),
        monthBranch: z.string(),
        dayStem: z.string(),
        dayBranch: z.string(),
        timeStem: z.string(),
        timeBranch: z.string(),
        dayMaster: z.string(),
        woodStrength: z.number(),
        fireStrength: z.number(),
        earthStrength: z.number(),
        metalStrength: z.number(),
        waterStrength: z.number(),
        analysis: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await saveSajuAnalysis({
          userId: ctx.user.id,
          name: input.name,
          birthYear: input.year,
          birthMonth: input.month,
          birthDay: input.day,
          birthHour: input.hour,
          birthMinute: input.minute,
          gender: input.gender,
          yearStem: input.yearStem,
          yearBranch: input.yearBranch,
          monthStem: input.monthStem,
          monthBranch: input.monthBranch,
          dayStem: input.dayStem,
          dayBranch: input.dayBranch,
          timeStem: input.timeStem,
          timeBranch: input.timeBranch,
          woodStrength: input.woodStrength,
          fireStrength: input.fireStrength,
          earthStrength: input.earthStrength,
          metalStrength: input.metalStrength,
          waterStrength: input.waterStrength,
          memo: input.analysis,
        });
        return result;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "사주 분석 결과 저장 중 오류가 발생했습니다.",
        });
      }
    }),

  /**
   * 사주 분석 히스토리 조회
   */
  getHistory: protectedProcedure.query(async ({ ctx }) => {
    try {
      const history = await getSajuAnalysisByUserId(ctx.user.id);
      return history;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "사주 분석 히스토리 조회 중 오류가 발생했습니다.",
      });
    }
  }),

  /**
   * 특정 사주 분석 결과 조회
   */
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const result = await getSajuAnalysisById(input.id);
        if (!result || result.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "사주 분석 결과를 찾을 수 없습니다.",
          });
        }
        return result;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "사주 분석 결과 조회 중 오류가 발생했습니다.",
        });
      }
    }),

  /**
   * 궁합 분석 계산 (공개 API)
   */
  compatibility: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        firstYear: z.number().int().min(1900).max(2100),
        firstMonth: z.number().int().min(1).max(12),
        firstDay: z.number().int().min(1).max(31),
        firstHour: z.number().int().min(0).max(23),
        firstGender: z.enum(["M", "F"]).optional().default("M"),
        secondName: z.string(),
        secondYear: z.number().int().min(1900).max(2100),
        secondMonth: z.number().int().min(1).max(12),
        secondDay: z.number().int().min(1).max(31),
        secondHour: z.number().int().min(0).max(23),
        secondGender: z.enum(["M", "F"]).optional().default("M"),
      })
    )
    .query(({ input }) => {
      try {
        const firstSaju = calculateSaju(input.firstYear, input.firstMonth, input.firstDay, input.firstHour, 0, input.firstGender);
        const secondSaju = calculateSaju(input.secondYear, input.secondMonth, input.secondDay, input.secondHour, 0, input.secondGender);

        const compatibilityScore = calculateCompatibility(firstSaju, secondSaju, input.firstGender, input.secondGender);

        return {
          firstName: input.firstName,
          firstSaju,
          secondName: input.secondName,
          secondSaju,
          compatibilityScore,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "궁합 분석 중 오류가 발생했습니다.",
        });
      }
    }),

  /**
   * 궁합 분석 결과 저장
   */
  saveCompatibility: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        firstYear: z.number(),
        firstMonth: z.number(),
        firstDay: z.number(),
        firstHour: z.number(),
        firstGender: z.enum(["M", "F"]),
        secondName: z.string(),
        secondYear: z.number(),
        secondMonth: z.number(),
        secondDay: z.number(),
        secondHour: z.number(),
        secondGender: z.enum(["M", "F"]),
        compatibilityScore: z.number(),
        analysis: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await saveCompatibilityAnalysis({
        userId: ctx.user.id,
        firstName: input.firstName,
        firstGender: input.firstGender,
        firstDayStem: "甲",
        firstDayBranch: "子",
        secondName: input.secondName,
        secondGender: input.secondGender,
        secondDayStem: "甲",
        secondDayBranch: "子",
        compatibilityScore: input.compatibilityScore,
        analysis: input.analysis,
      });
        return result;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "궁합 분석 결과 저장 중 오류가 발생했습니다.",
        });
      }
    }),

  /**
   * 궁합 분석 히스토리 조회
   */
  getCompatibilityHistory: protectedProcedure.query(async ({ ctx }) => {
    try {
      const history = await getCompatibilityAnalysisByUserId(ctx.user.id);
      return history;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "궁합 분석 히스토리 조회 중 오류가 발생했습니다.",
      });
    }
  }),

  /**
   * 사주 분석 결과 삭제
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const record = await db
          .select()
          .from(sajuAnalysis)
          .where(eq(sajuAnalysis.id, input.id))
          .limit(1);

        if (!record.length || record[0].userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "이 기록을 삭제할 권한이 없습니다.",
          });
        }

        await db.delete(sajuAnalysis).where(eq(sajuAnalysis.id, input.id));

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "사주 분석 결과 삭제 중 오류가 발생했습니다.",
        });
      }
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "데이터베이스 연결 실패" });

    return db
      .select()
      .from(sajuAnalysis)
      .where(eq(sajuAnalysis.userId, ctx.user.id))
      .orderBy(desc(sajuAnalysis.createdAt));
  }),
});
