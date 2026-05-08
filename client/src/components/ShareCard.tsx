import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Share2, MessageCircle, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { renderSajuCard, renderCompatibilityCard, downloadImage, SajuCardData, CompatibilityCardData } from "@/utils/cardRenderer";

interface ShareCardProps {
  type: "saju" | "compatibility";
  data: SajuCardData | CompatibilityCardData;
  title: string;
}

export default function ShareCard({ type, data, title }: ShareCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      let blob: Blob;

      if (type === "saju") {
        blob = await renderSajuCard(data as SajuCardData);
      } else {
        blob = await renderCompatibilityCard(data as CompatibilityCardData);
      }

      const filename = `${type}-${new Date().toISOString().split("T")[0]}.png`;
      downloadImage(blob, filename);
      toast.success("이미지가 다운로드되었습니다!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("이미지 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKakaoShare = async () => {
    setIsGenerating(true);
    try {
      let blob: Blob;

      if (type === "saju") {
        blob = await renderSajuCard(data as SajuCardData);
      } else {
        blob = await renderCompatibilityCard(data as CompatibilityCardData);
      }

      // 카카오톡 SDK 초기화 및 공유
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.VITE_KAKAO_APP_ID || "");
      }

      if (window.Kakao) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Image = reader.result as string;

          window.Kakao.Link.sendDefault({
            objectType: "feed",
            content: {
              title: title,
              description: `내 ${type === "saju" ? "사주" : "궁합"} 분석 결과를 확인하세요!`,
              imageUrl: base64Image,
              link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
              },
            },
            buttons: [
              {
                title: "웹에서 보기",
                link: {
                  mobileWebUrl: window.location.href,
                  webUrl: window.location.href,
                },
              },
            ],
          });

          toast.success("카카오톡으로 공유되었습니다!");
        };
        reader.readAsDataURL(blob);
      }
    } catch (error) {
      console.error("Error sharing to Kakao:", error);
      toast.error("카카오톡 공유 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      const shareUrl = window.location.href;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("링크가 복사되었습니다!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("링크 복사 실패");
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        let blob: Blob;

        if (type === "saju") {
          blob = await renderSajuCard(data as SajuCardData);
        } else {
          blob = await renderCompatibilityCard(data as CompatibilityCardData);
        }

        const file = new File([blob], `${type}-analysis.png`, { type: "image/png" });

        await navigator.share({
          title: title,
          text: `내 ${type === "saju" ? "사주" : "궁합"} 분석 결과를 확인하세요!`,
          files: [file],
        });

        toast.success("공유되었습니다!");
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    }
  };

  return (
    <Card className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">공유하기</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* 다운로드 */}
        <Button
          onClick={handleDownload}
          disabled={isGenerating}
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4 border border-border hover:bg-secondary/10"
        >
          <Download className="h-5 w-5" />
          <span className="text-xs text-center">이미지 다운로드</span>
        </Button>

        {/* 카카오톡 공유 */}
        <Button
          onClick={handleKakaoShare}
          disabled={isGenerating}
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4 border border-border hover:bg-yellow-500/10"
        >
          <MessageCircle className="h-5 w-5 text-yellow-500" />
          <span className="text-xs text-center">카카오톡</span>
        </Button>

        {/* 링크 복사 */}
        <Button
          onClick={handleCopyLink}
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4 border border-border hover:bg-secondary/10"
        >
          {copied ? (
            <>
              <Check className="h-5 w-5 text-green-500" />
              <span className="text-xs text-center">복사됨</span>
            </>
          ) : (
            <>
              <Copy className="h-5 w-5" />
              <span className="text-xs text-center">링크 복사</span>
            </>
          )}
        </Button>

        {/* 기타 공유 */}
        {typeof navigator !== "undefined" && "share" in navigator && (
          <Button
            onClick={handleNativeShare}
            disabled={isGenerating}
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 border border-border hover:bg-secondary/10"
          >            <Share2 className="h-5 w-5" />
            <span className="text-xs text-center">더 많은 옵션</span>
          </Button>
        )}
      </div>

      {/* 공유 팁 */}
      <div className="mt-6 p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 <strong>팁:</strong> 이미지 카드를 다운로드하여 SNS에 직접 업로드하거나, 카카오톡으로 친구에게 공유할 수 있습니다.
        </p>
      </div>
    </Card>
  );
}

// Kakao 타입 선언
declare global {
  interface Window {
    Kakao: {
      init: (appId: string) => void;
      isInitialized: () => boolean;
      Link: {
        sendDefault: (config: any) => void;
      };
    };
  }
}
