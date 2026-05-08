import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { saveChatMessage, getChatHistoryBySajuId } from "../db";
import { TRPCError } from "@trpc/server";

export const consultationRouter = router({
  /**
   * AI 명리학 전문가 상담 (스트리밍)
   */
  askExpert: publicProcedure
    .input(
      z.object({
        question: z.string().min(1).max(1000),
        context: z.object({
          yearStem: z.string(),
          yearBranch: z.string(),
          monthStem: z.string(),
          monthBranch: z.string(),
          dayStem: z.string(),
          dayBranch: z.string(),
          timeStem: z.string(),
          timeBranch: z.string(),
          woodStrength: z.number(),
          fireStrength: z.number(),
          earthStrength: z.number(),
          metalStrength: z.number(),
          waterStrength: z.number(),
        }).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const systemPrompt = `당신은 한국 전통 명리학의 최고 전문가입니다. 사주(사주팔자) 분석에 대한 깊은 지식을 가지고 있습니다.

사용자의 질문에 답변할 때:
1. 제공된 천간과 지지를 중심으로 분석하기
2. 오행 균형 분석하기
3. 사주 분석을 기반으로 실질적인 삶의 조언 제공하기
4. 도전을 존중하면서도 진실한 대답하기
5. 한국 명리학 용어를 적절히 사용하기
6. 실질적이고 실용적인 인사이트 제공하기

항상 전문가다운 태도로 답변하세요.`;

        const contextInfo = input.context
          ? `
사용자의 사주 정보:
- 년주: ${input.context.yearStem}${input.context.yearBranch}
- 월주: ${input.context.monthStem}${input.context.monthBranch}
- 일주: ${input.context.dayStem}${input.context.dayBranch}
- 시주: ${input.context.timeStem}${input.context.timeBranch}

오행 강약:
- 목(木): ${input.context.woodStrength}
- 화(火): ${input.context.fireStrength}
- 토(土): ${input.context.earthStrength}
- 금(金): ${input.context.metalStrength}
- 수(水): ${input.context.waterStrength}
`
          : "";

        const userMessage = `${contextInfo}\n사용자 질문: ${input.question}`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
        });

        const content = response.choices[0]?.message?.content || "";

        return {
          response: content,
          success: true,
        };
      } catch (error) {
        console.error("LLM consultation error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "상담 중 오류가 발생했습니다. 다시 시도해주세요.",
        });
      }
    }),

  /**
   * 채팅 히스토리 저장 (로그인 필수)
   */
  saveChatHistory: protectedProcedure
    .input(
      z.object({
        sajuId: z.number().int().optional(),
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result: any = await saveChatMessage({
          userId: ctx.user.id,
          sajuId: input.sajuId,
          role: input.role,
          content: input.content,
        });

        return {
          success: true,
          messageId: result.id,
        };
      } catch (error) {
        console.error("Save chat history error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "채팅 저장 중 오류가 발생했습니다.",
        });
      }
    }),

  /**
   * 채팅 히스토리 조회
   */
  getChatHistory: protectedProcedure
    .input(z.object({ sajuId: z.number().int() }))
    .query(async ({ input }) => {
      try {
        const history = await getChatHistoryBySajuId(input.sajuId);
        return history;
      } catch (error) {
        console.error("Get chat history error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "채팅 히스토리 조회 중 오류가 발생했습니다.",
        });
      }
    }),
});
