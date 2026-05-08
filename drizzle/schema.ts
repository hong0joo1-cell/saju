import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 사주 분석 결과 저장 테이블
 * 사용자가 입력한 생년월일시와 분석 결과를 저장
 */
export const sajuAnalysis = mysqlTable("saju_analysis", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  // 입력 정보
  name: varchar("name", { length: 100 }).notNull(), // 분석 대상자 이름
  birthYear: int("birthYear").notNull(),
  birthMonth: int("birthMonth").notNull(),
  birthDay: int("birthDay").notNull(),
  birthHour: int("birthHour").notNull(),
  birthMinute: int("birthMinute").default(0).notNull(),
  gender: mysqlEnum("gender", ["M", "F"]).notNull(),
  // 사주팔자 (년월일시 천간지지)
  yearStem: varchar("yearStem", { length: 1 }).notNull(),
  yearBranch: varchar("yearBranch", { length: 1 }).notNull(),
  monthStem: varchar("monthStem", { length: 1 }).notNull(),
  monthBranch: varchar("monthBranch", { length: 1 }).notNull(),
  dayStem: varchar("dayStem", { length: 1 }).notNull(),
  dayBranch: varchar("dayBranch", { length: 1 }).notNull(),
  timeStem: varchar("timeStem", { length: 1 }).notNull(),
  timeBranch: varchar("timeBranch", { length: 1 }).notNull(),
  // 오행 분석
  woodStrength: int("woodStrength"),
  fireStrength: int("fireStrength"),
  earthStrength: int("earthStrength"),
  metalStrength: int("metalStrength"),
  waterStrength: int("waterStrength"),
  // 십신 분석 (JSON 형식으로 저장)
  tenStemsAnalysis: json("tenStemsAnalysis"),
  // 대운 정보
  majorPeriodStartAge: int("majorPeriodStartAge"),
  majorPeriodStem: varchar("majorPeriodStem", { length: 1 }),
  majorPeriodBranch: varchar("majorPeriodBranch", { length: 1 }),
  // 메타데이터
  title: varchar("title", { length: 200 }), // 사용자가 지정한 제목
  memo: text("memo"), // 사용자 메모
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SajuAnalysis = typeof sajuAnalysis.$inferSelect;
export type InsertSajuAnalysis = typeof sajuAnalysis.$inferInsert;

/**
 * 궁합 분석 결과 저장 테이블
 */
export const compatibilityAnalysis = mysqlTable("compatibility_analysis", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  // 첫 번째 사주
  firstSajuId: int("firstSajuId"),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  firstGender: mysqlEnum("firstGender", ["M", "F"]).notNull(),
  firstDayStem: varchar("firstDayStem", { length: 1 }).notNull(),
  firstDayBranch: varchar("firstDayBranch", { length: 1 }).notNull(),
  // 두 번째 사주
  secondSajuId: int("secondSajuId"),
  secondName: varchar("secondName", { length: 100 }).notNull(),
  secondGender: mysqlEnum("secondGender", ["M", "F"]).notNull(),
  secondDayStem: varchar("secondDayStem", { length: 1 }).notNull(),
  secondDayBranch: varchar("secondDayBranch", { length: 1 }).notNull(),
  // 궁합 분석 결과
  compatibilityScore: int("compatibilityScore").notNull(), // 0-100
  analysis: text("analysis"), // AI 생성 해설
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CompatibilityAnalysis = typeof compatibilityAnalysis.$inferSelect;
export type InsertCompatibilityAnalysis = typeof compatibilityAnalysis.$inferInsert;

/**
 * AI 채팅 상담 기록 테이블
 */
export const chatHistory = mysqlTable("chat_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  sajuId: int("sajuId"), // 관련 사주 분석 ID
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatHistory = typeof chatHistory.$inferSelect;
export type InsertChatHistory = typeof chatHistory.$inferInsert;