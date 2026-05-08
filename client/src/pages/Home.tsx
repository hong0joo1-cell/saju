import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663439226279/SJANsuSgqFWKCWZtrknY4M/sajuramen_logo_square_icon_v2-FyuupuUx8JidDngSegQEfL.webp" alt="사주라면" className="h-10 w-10" />
            <div>
              <div className="text-xl font-bold text-primary">사주라면</div>
              <div className="text-xs text-muted-foreground">sajuramen</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/analysis" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              분석
            </Link>
            <Link href="/compatibility" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              궁합
            </Link>
            <Link href="/consultation" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              상담
            </Link>
            <Link href="/yearly-fortune" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              운세
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/history" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  히스토리
                </Link>
                <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  프로필
                </Link>
              </>
            ) : (
              <a href={getLoginUrl()} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                로그인
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                당신의<br />
                <span className="text-primary">진정한 운명</span>을 찾아보세요
              </h1>
              <p className="text-lg text-muted-foreground mt-4">
                한국 전통 명리학과 현대 AI 기술의 만남.<br />
                생년월일시를 입력하고 전문가 수준의 사주 분석을 받아보세요.
              </p>
            </div>
            <div className="flex gap-4 pt-4">
              <Link href="/analysis">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base">
                  무료 분석 시작하기
                </Button>
              </Link>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 px-8 py-6 text-base">
                자세히 알아보기
              </Button>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="w-full aspect-square bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl flex items-center justify-center border border-primary/20">
              <div className="text-center space-y-4">
                <div className="text-6xl">🔮</div>
                <div className="text-sm text-muted-foreground">당신의 운명 지도</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary/5 border-y border-border py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">주요 기능</h2>
            <p className="text-lg text-muted-foreground">전문가 수준의 사주 분석과 운세 예측</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "📊",
                title: "4대 사주 분석",
                description: "사주팔자, 대운, 세운, 월운의 종합 분석.",
              },
              {
                icon: "🎯",
                title: "오행 시각화",
                description: "레이더 차트로 표현하는 오행 강약 분석.",
              },
              {
                icon: "💬",
                title: "AI 전문가 상담",
                description: "명리학 전문가 AI와의 실시간 채팅 상담.",
              },
              {
                icon: "💑",
                title: "궁합 분석",
                description: "두 사람의 사주를 비교하여 궁합 점수 제공.",
              },
              {
                icon: "📅",
                title: "나이별 운세",
                description: "현재 나이 기준의 연도별 운세 예측.",
              },
              {
                icon: "📸",
                title: "결과 공유",
                description: "아름다운 카드를 생성하여 SNS에 공유.",
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-12 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">오늘 당신의 운명을 발견하세요</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            생년월일시를 입력하기만 하면 전문가 수준의 사주 분석을 받을 수 있습니다.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/analysis">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base">
                무료 분석 시작하기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/5 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">명품 사주</h3>
              <p className="text-sm text-muted-foreground">당신의 운명 분석</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground text-sm">메뉴</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">분석</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">궁합</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">운세</a></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground text-sm">정보</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">이용약관</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">개인정보</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">문의</a></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground text-sm">연락처</h4>
              <p className="text-sm text-muted-foreground">support@premium-saju.com</p>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 명품 사주 분석. 모든 권리 보유.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
