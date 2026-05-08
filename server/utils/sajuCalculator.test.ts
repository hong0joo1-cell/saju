import { describe, it, expect } from "vitest";
import { calculateSaju, analyzeSaju, calculateElementBalance, calculateCompatibility } from "./sajuCalculator";

describe("Saju Calculator", () => {
  describe("calculateSaju", () => {
    it("should calculate saju for a given birth date and time", () => {
      const result = calculateSaju(1990, 5, 15, 14, 30, "M");

      expect(result).toHaveProperty("yearStem");
      expect(result).toHaveProperty("yearBranch");
      expect(result).toHaveProperty("monthStem");
      expect(result).toHaveProperty("monthBranch");
      expect(result).toHaveProperty("dayStem");
      expect(result).toHaveProperty("dayBranch");
      expect(result).toHaveProperty("timeStem");
      expect(result).toHaveProperty("timeBranch");
      expect(result).toHaveProperty("dayMaster");
      expect(result).toHaveProperty("age");
      expect(result).toHaveProperty("majorPeriodStartAge");
      expect(result).toHaveProperty("majorPeriodStem");
      expect(result).toHaveProperty("majorPeriodBranch");
    });

    it("should calculate age correctly", () => {
      const currentYear = new Date().getFullYear();
      const result = calculateSaju(1990, 5, 15, 14, 30, "M");

      expect(result.age).toBe(currentYear - 1990);
    });

    it("should have valid stem and branch characters", () => {
      const result = calculateSaju(2000, 1, 1, 0, 0, "M");

      // Check that stems and branches are single characters (Chinese characters)
      expect(result.yearStem).toHaveLength(1);
      expect(result.yearBranch).toHaveLength(1);
      expect(result.monthStem).toHaveLength(1);
      expect(result.monthBranch).toHaveLength(1);
      expect(result.dayStem).toHaveLength(1);
      expect(result.dayBranch).toHaveLength(1);
      expect(result.timeStem).toHaveLength(1);
      expect(result.timeBranch).toHaveLength(1);
    });
  });

  describe("analyzeSaju", () => {
    it("should provide element strengths", () => {
      const result = analyzeSaju(1990, 5, 15, 14, 30, "M");

      expect(result.elements).toHaveProperty("wood");
      expect(result.elements).toHaveProperty("fire");
      expect(result.elements).toHaveProperty("earth");
      expect(result.elements).toHaveProperty("metal");
      expect(result.elements).toHaveProperty("water");

      // All elements should have positive values
      expect(result.elements.wood).toBeGreaterThanOrEqual(0);
      expect(result.elements.fire).toBeGreaterThanOrEqual(0);
      expect(result.elements.earth).toBeGreaterThanOrEqual(0);
      expect(result.elements.metal).toBeGreaterThanOrEqual(0);
      expect(result.elements.water).toBeGreaterThanOrEqual(0);
    });

    it("should provide ten stems analysis", () => {
      const result = analyzeSaju(1990, 5, 15, 14, 30, "M");

      expect(result.tenStems).toHaveProperty("비견");
      expect(result.tenStems).toHaveProperty("겁재");
      expect(result.tenStems).toHaveProperty("식신");
      expect(result.tenStems).toHaveProperty("상관");
      expect(result.tenStems).toHaveProperty("편재");
      expect(result.tenStems).toHaveProperty("정재");
      expect(result.tenStems).toHaveProperty("편관");
      expect(result.tenStems).toHaveProperty("정관");
      expect(result.tenStems).toHaveProperty("편인");
      expect(result.tenStems).toHaveProperty("정인");
    });
  });

  describe("calculateElementBalance", () => {
    it("should return a balance score between 0 and 100", () => {
      const elements = {
        wood: 5,
        fire: 5,
        earth: 5,
        metal: 5,
        water: 5,
      };

      const balance = calculateElementBalance(elements);

      expect(balance).toBeGreaterThanOrEqual(0);
      expect(balance).toBeLessThanOrEqual(100);
    });

    it("should return higher score for balanced elements", () => {
      const balanced = {
        wood: 5,
        fire: 5,
        earth: 5,
        metal: 5,
        water: 5,
      };

      const unbalanced = {
        wood: 10,
        fire: 1,
        earth: 1,
        metal: 1,
        water: 1,
      };

      const balancedScore = calculateElementBalance(balanced);
      const unbalancedScore = calculateElementBalance(unbalanced);

      expect(balancedScore).toBeGreaterThan(unbalancedScore);
    });
  });

  describe("calculateCompatibility", () => {
    it("should return a compatibility score between 0 and 100", () => {
      const saju1 = calculateSaju(1990, 5, 15, 14, 30, "M");
      const saju2 = calculateSaju(1992, 8, 20, 10, 0, "F");

      const score = calculateCompatibility(saju1, saju2, "M", "F");

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("should consider gender in compatibility", () => {
      const saju1 = calculateSaju(1990, 5, 15, 14, 30, "M");
      const saju2 = calculateSaju(1992, 8, 20, 10, 0, "F");

      const maleFemalScore = calculateCompatibility(saju1, saju2, "M", "F");
      const maleMaleScore = calculateCompatibility(saju1, saju2, "M", "M");

      // Opposite gender should have higher compatibility
      expect(maleFemalScore).toBeGreaterThan(maleMaleScore);
    });

    it("should handle large age differences", () => {
      const saju1 = calculateSaju(1950, 5, 15, 14, 30, "M");
      const saju2 = calculateSaju(2000, 8, 20, 10, 0, "F");

      const score = calculateCompatibility(saju1, saju2, "M", "F");

      // Should still be valid score
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe("Edge cases", () => {
    it("should handle leap year dates", () => {
      const result = calculateSaju(2000, 2, 29, 12, 0, "M");

      expect(result).toHaveProperty("dayStem");
      expect(result).toHaveProperty("dayBranch");
    });

    it("should handle year boundaries", () => {
      const result1 = calculateSaju(1900, 1, 1, 0, 0, "M");
      const result2 = calculateSaju(2100, 12, 31, 23, 59, "F");

      expect(result1).toHaveProperty("yearStem");
      expect(result2).toHaveProperty("yearStem");
    });

    it("should handle different genders", () => {
      const resultM = calculateSaju(1990, 5, 15, 14, 30, "M");
      const resultF = calculateSaju(1990, 5, 15, 14, 30, "F");

      // Major period should be different for different genders
      expect(resultM.majorPeriodStartAge).not.toBe(resultF.majorPeriodStartAge);
    });
  });
});
