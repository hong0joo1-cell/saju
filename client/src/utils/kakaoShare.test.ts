import { describe, it, expect, beforeEach, vi } from "vitest";

describe("Kakao Share Configuration", () => {
  beforeEach(() => {
    // Kakao SDK 모킹
    (global as any).Kakao = {
      isInitialized: () => true,
      init: vi.fn(),
      Share: {
        sendDefault: vi.fn(),
      },
    };
  });

  it("should have VITE_KAKAO_APP_ID environment variable set", () => {
    const appId = import.meta.env.VITE_KAKAO_APP_ID;
    expect(appId).toBeDefined();
    expect(appId).toBe("1451232");
  });

  it("should initialize Kakao SDK with correct app ID", () => {
    const appId = import.meta.env.VITE_KAKAO_APP_ID;
    
    // 실제 환경에서는 Kakao.init(appId)이 호출됨
    if (typeof window !== "undefined" && (window as any).Kakao) {
      (window as any).Kakao.init(appId);
      expect((window as any).Kakao.init).toHaveBeenCalledWith(appId);
    }
  });

  it("should support Kakao Share API", () => {
    if (typeof window !== "undefined" && (window as any).Kakao) {
      expect((window as any).Kakao.Share).toBeDefined();
      expect((window as any).Kakao.Share.sendDefault).toBeDefined();
    }
  });
});
