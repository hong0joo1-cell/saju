import { useEffect, useState } from "react";

interface TaeguqLoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export default function TaeguqLoading({ message = "분석 중입니다...", fullScreen = false }: TaeguqLoadingProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 2) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const containerClass = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
    : "flex flex-col items-center justify-center py-12";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-6">
        {/* 태극 로딩 애니메이션 */}
        <div className="relative w-32 h-32">
          {/* 외부 원 */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 200 200"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {/* 태극 원 */}
            <circle cx="100" cy="100" r="95" fill="none" stroke="#D4A853" strokeWidth="2" opacity="0.3" />
            
            {/* 태극 상단 (빨강) */}
            <path
              d="M 100 5 A 95 95 0 0 1 100 100 A 47.5 47.5 0 0 1 100 5"
              fill="#D4A853"
              opacity="0.8"
            />
            
            {/* 태극 하단 (파랑) */}
            <path
              d="M 100 100 A 95 95 0 0 1 100 195 A 47.5 47.5 0 0 1 100 100"
              fill="#C8A96E"
              opacity="0.6"
            />

            {/* 태극 점 */}
            <circle cx="100" cy="52.5" r="4" fill="#C8A96E" />
            <circle cx="100" cy="147.5" r="4" fill="#D4A853" />
          </svg>

          {/* 중앙 텍스트 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground">명리 분석</div>
            </div>
          </div>
        </div>

        {/* 로딩 텍스트 */}
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">{message}</p>
          <div className="flex gap-1 justify-center">
            <div
              className="w-2 h-2 rounded-full bg-primary"
              style={{
                animation: "bounce 1.4s infinite",
                animationDelay: "0s",
              }}
            />
            <div
              className="w-2 h-2 rounded-full bg-primary"
              style={{
                animation: "bounce 1.4s infinite",
                animationDelay: "0.2s",
              }}
            />
            <div
              className="w-2 h-2 rounded-full bg-primary"
              style={{
                animation: "bounce 1.4s infinite",
                animationDelay: "0.4s",
              }}
            />
          </div>
        </div>

        {/* 전통 문양 장식 */}
        <div className="mt-6 flex gap-8 opacity-50">
          {/* 좌측 문양 */}
          <svg width="40" height="40" viewBox="0 0 40 40" className="text-primary">
            <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M 20 2 L 28 20 L 20 38 L 12 20 Z" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="20" cy="20" r="3" fill="currentColor" />
          </svg>

          {/* 중앙 문양 */}
          <svg width="40" height="40" viewBox="0 0 40 40" className="text-primary">
            <rect x="5" y="5" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1" />
            <line x1="5" y1="20" x2="35" y2="20" stroke="currentColor" strokeWidth="1" />
            <line x1="20" y1="5" x2="20" y2="35" stroke="currentColor" strokeWidth="1" />
            <circle cx="20" cy="20" r="2" fill="currentColor" />
          </svg>

          {/* 우측 문양 */}
          <svg width="40" height="40" viewBox="0 0 40 40" className="text-primary">
            <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M 20 2 L 28 20 L 20 38 L 12 20 Z" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="20" cy="20" r="3" fill="currentColor" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          40% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
