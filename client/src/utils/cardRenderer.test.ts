import { describe, it, expect, beforeEach } from "vitest";
import { renderSajuCard, renderCompatibilityCard, SajuCardData, CompatibilityCardData } from "./cardRenderer";

describe("cardRenderer", () => {
  describe("renderSajuCard", () => {
    it("should generate a valid blob for saju card", async () => {
      const mockData: SajuCardData = {
        name: "Test User",
        birthDate: "1990년 1월 15일 12시",
        yearStem: "庚",
        yearBranch: "午",
        monthStem: "丙",
        monthBranch: "寅",
        dayStem: "甲",
        dayBranch: "子",
        timeStem: "甲",
        timeBranch: "午",
        dayMaster: "甲木",
        woodStrength: 30,
        fireStrength: 25,
        earthStrength: 20,
        metalStrength: 15,
        waterStrength: 10,
      };

      const blob = await renderSajuCard(mockData);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe("image/png");
      expect(blob.size).toBeGreaterThan(0);
    });

    it("should handle missing name gracefully", async () => {
      const mockData: SajuCardData = {
        birthDate: "1990년 1월 15일 12시",
        yearStem: "庚",
        yearBranch: "午",
        monthStem: "丙",
        monthBranch: "寅",
        dayStem: "甲",
        dayBranch: "子",
        timeStem: "甲",
        timeBranch: "午",
        dayMaster: "甲木",
        woodStrength: 30,
        fireStrength: 25,
        earthStrength: 20,
        metalStrength: 15,
        waterStrength: 10,
      };

      const blob = await renderSajuCard(mockData);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.size).toBeGreaterThan(0);
    });

    it("should handle all element strengths", async () => {
      const mockData: SajuCardData = {
        name: "Balance Test",
        birthDate: "1995년 6월 20일 18시",
        yearStem: "乙",
        yearBranch: "未",
        monthStem: "己",
        monthBranch: "未",
        dayStem: "丙",
        dayBranch: "午",
        timeStem: "丙",
        timeBranch: "申",
        dayMaster: "丙火",
        woodStrength: 20,
        fireStrength: 30,
        earthStrength: 25,
        metalStrength: 15,
        waterStrength: 10,
      };

      const blob = await renderSajuCard(mockData);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.size).toBeGreaterThan(0);
    });
  });

  describe("renderCompatibilityCard", () => {
    it("should generate a valid blob for compatibility card", async () => {
      const mockData: CompatibilityCardData = {
        firstName: "Alice",
        firstSaju: "庚午 丙寅 甲子 甲午",
        secondName: "Bob",
        secondSaju: "乙未 己未 丙午 丙申",
        compatibilityScore: 75,
        compatibility: "Good Compatibility",
      };

      const blob = await renderCompatibilityCard(mockData);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe("image/png");
      expect(blob.size).toBeGreaterThan(0);
    });

    it("should handle high compatibility score", async () => {
      const mockData: CompatibilityCardData = {
        firstName: "John",
        firstSaju: "甲子 甲子 甲子 甲子",
        secondName: "Jane",
        secondSaju: "甲子 甲子 甲子 甲子",
        compatibilityScore: 95,
        compatibility: "Excellent Compatibility",
      };

      const blob = await renderCompatibilityCard(mockData);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.size).toBeGreaterThan(0);
    });

    it("should handle low compatibility score", async () => {
      const mockData: CompatibilityCardData = {
        firstName: "Tom",
        firstSaju: "甲子 甲子 甲子 甲子",
        secondName: "Jerry",
        secondSaju: "庚午 丙寅 甲子 甲午",
        compatibilityScore: 25,
        compatibility: "Challenging Compatibility",
      };

      const blob = await renderCompatibilityCard(mockData);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.size).toBeGreaterThan(0);
    });

    it("should handle medium compatibility score", async () => {
      const mockData: CompatibilityCardData = {
        firstName: "Person A",
        firstSaju: "甲子 甲子 甲子 甲子",
        secondName: "Person B",
        secondSaju: "乙丑 乙丑 乙丑 乙丑",
        compatibilityScore: 50,
        compatibility: "Moderate Compatibility",
      };

      const blob = await renderCompatibilityCard(mockData);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.size).toBeGreaterThan(0);
    });
  });

  describe("edge cases", () => {
    it("should handle special characters in names", async () => {
      const mockData: SajuCardData = {
        name: "김철수 (金鐵水)",
        birthDate: "1985년 12월 25일 09시",
        yearStem: "乙",
        yearBranch: "丑",
        monthStem: "辛",
        monthBranch: "亥",
        dayStem: "甲",
        dayBranch: "寅",
        timeStem: "甲",
        timeBranch: "巳",
        dayMaster: "甲木",
        woodStrength: 40,
        fireStrength: 20,
        earthStrength: 15,
        metalStrength: 15,
        waterStrength: 10,
      };

      const blob = await renderSajuCard(mockData);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.size).toBeGreaterThan(0);
    });

    it("should handle zero element strengths", async () => {
      const mockData: SajuCardData = {
        name: "Zero Test",
        birthDate: "2000년 1월 1일 00시",
        yearStem: "龍",
        yearBranch: "辰",
        monthStem: "甲",
        monthBranch: "寅",
        dayStem: "甲",
        dayBranch: "子",
        timeStem: "甲",
        timeBranch: "子",
        dayMaster: "甲木",
        woodStrength: 0,
        fireStrength: 0,
        earthStrength: 0,
        metalStrength: 0,
        waterStrength: 0,
      };

      const blob = await renderSajuCard(mockData);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.size).toBeGreaterThan(0);
    });

    it("should handle maximum element strengths", async () => {
      const mockData: SajuCardData = {
        name: "Max Test",
        birthDate: "1999년 12月 31日 23時",
        yearStem: "癸",
        yearBranch: "卯",
        monthStem: "癸",
        monthBranch: "亥",
        dayStem: "癸",
        dayBranch: "卯",
        timeStem: "癸",
        timeBranch: "亥",
        dayMaster: "癸水",
        woodStrength: 100,
        fireStrength: 100,
        earthStrength: 100,
        metalStrength: 100,
        waterStrength: 100,
      };

      const blob = await renderSajuCard(mockData);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.size).toBeGreaterThan(0);
    });
  });
});
