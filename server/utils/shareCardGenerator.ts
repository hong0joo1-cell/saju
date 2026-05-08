import { generateImage } from "../_core/imageGeneration";

interface ShareCardData {
  name?: string;
  yearStem: string;
  yearBranch: string;
  monthStem: string;
  monthBranch: string;
  dayStem: string;
  dayBranch: string;
  timeStem: string;
  timeBranch: string;
  dayMaster: string;
  elementBalance: number;
}

/**
 * SNS 공유용 사주 분석 카드 이미지 생성
 */
export async function generateShareCard(data: ShareCardData): Promise<string> {
  const prompt = `Create a beautiful, elegant Korean fortune-telling (Saju) analysis card for social media sharing. 

Design specifications:
- Background: White with subtle golden/earth tone (#D4A853) accents
- Style: Traditional Korean aesthetic with modern elegance
- Layout: Portrait orientation, optimized for Instagram/SNS

Content to display:
- Title: "Premium Saju Analysis" in elegant Korean style
- Name: ${data.name || "Your Saju"}
- Four Pillars of Destiny (사주팔자):
  * Year (年): ${data.yearStem}${data.yearBranch}
  * Month (月): ${data.monthStem}${data.monthBranch}
  * Day (日): ${data.dayStem}${data.dayBranch}
  * Hour (時): ${data.timeStem}${data.timeBranch}
- Day Master (日干): ${data.dayMaster}
- Element Balance Score: ${data.elementBalance}/100
- Footer: "Discover Your True Destiny - Premium Saju"

Design elements:
- Use golden/earth tones (#D4A853, #C8A96E) for accents
- Include subtle decorative elements (traditional Korean patterns)
- Clear, readable typography with Korean serif fonts
- Professional, premium appearance
- Include a mystical element (like a subtle glow or celestial theme)

Make it visually stunning and suitable for sharing on social media.`;

  try {
    const result = await generateImage({
      prompt,
    });

    return result.url || "https://via.placeholder.com/1200x630?text=Saju+Analysis";
  } catch (error) {
    console.error("Error generating share card:", error);
    throw error;
  }
}

/**
 * 호환성 분석 카드 이미지 생성
 */
export async function generateCompatibilityCard(
  firstName: string,
  firstSaju: string,
  secondName: string,
  secondSaju: string,
  compatibilityScore: number
): Promise<string> {
  const prompt = `Create a beautiful, elegant Korean compatibility analysis card for social media sharing.

Design specifications:
- Background: White with subtle golden/earth tone (#D4A853) accents
- Style: Traditional Korean aesthetic with modern elegance
- Layout: Portrait orientation, optimized for Instagram/SNS

Content to display:
- Title: "Saju Compatibility Analysis" in elegant Korean style
- Two names: "${firstName}" and "${secondName}"
- Their Saju (Four Pillars): ${firstSaju} & ${secondSaju}
- Compatibility Score: ${compatibilityScore}%
- Score interpretation: ${
    compatibilityScore >= 80
      ? "Excellent Compatibility"
      : compatibilityScore >= 60
        ? "Good Compatibility"
        : compatibilityScore >= 40
          ? "Moderate Compatibility"
          : "Challenging Compatibility"
  }
- Footer: "Check Your Compatibility - Premium Saju"

Design elements:
- Use golden/earth tones (#D4A853, #C8A96E) for accents
- Include two complementary celestial symbols or elements
- Show the compatibility score prominently with a visual indicator
- Professional, premium appearance
- Include subtle decorative elements

Make it visually stunning and suitable for sharing on social media.`;

  try {
    const result = await generateImage({
      prompt,
    });

    return result.url || "https://via.placeholder.com/1200x630?text=Saju+Analysis";
  } catch (error) {
    console.error("Error generating compatibility card:", error);
    throw error;
  }
}

/**
 * 운세 분석 카드 이미지 생성
 */
export async function generateFortunCard(
  analysisType: "personality" | "health" | "wealth" | "career" | "relationship" | "family",
  dayMaster: string,
  summary: string
): Promise<string> {
  const typeLabels = {
    personality: "Personality Analysis",
    health: "Health Fortune",
    wealth: "Wealth Fortune",
    career: "Career Prospects",
    relationship: "Relationship Fortune",
    family: "Family Fortune",
  };

  const prompt = `Create a beautiful, elegant Korean fortune analysis card for social media sharing.

Design specifications:
- Background: White with subtle golden/earth tone (#D4A853) accents
- Style: Traditional Korean aesthetic with modern elegance
- Layout: Portrait orientation, optimized for Instagram/SNS

Content to display:
- Title: "${typeLabels[analysisType]}" in elegant Korean style
- Day Master: ${dayMaster}
- Summary: ${summary.substring(0, 100)}...
- Footer: "Your Fortune Awaits - Premium Saju"

Design elements:
- Use golden/earth tones (#D4A853, #C8A96E) for accents
- Include relevant symbolic elements for the analysis type
- Professional, premium appearance
- Subtle decorative elements

Make it visually stunning and suitable for sharing on social media.`;

  try {
    const result = await generateImage({
      prompt,
    });

    return result.url || "https://via.placeholder.com/1200x630?text=Saju+Analysis";
  } catch (error) {
    console.error("Error generating fortune card:", error);
    throw error;
  }
}
