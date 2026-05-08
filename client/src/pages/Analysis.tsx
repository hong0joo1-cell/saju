import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import ShareCard from "@/components/ShareCard";
import TaeguqLoading from "@/components/TaeguqLoading";

export default function Analysis() {
  const [formData, setFormData] = useState({
    year: new Date().getFullYear() - 30,
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
    gender: "M" as "M" | "F",
  });

  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeMutation = trpc.saju.analyze.useQuery(
    {
      year: formData.year,
      month: formData.month,
      day: formData.day,
      hour: formData.hour,
      minute: formData.minute,
      gender: formData.gender,
    },
    {
      enabled: false,
    }
  );

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const data = await analyzeMutation.refetch();
      if (data.data) {
        setResult(data.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663439226279/SJANsuSgqFWKCWZtrknY4M/sajuramen_logo_square_icon_v2-FyuupuUx8JidDngSegQEfL.webp" alt="사주라면" className="h-10 w-10" />
            <div>
              <div className="text-lg font-bold text-primary">사주라면</div>
              <div className="text-xs text-muted-foreground">sajuramen</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              홈
            </a>
          </div>
        </div>
      </nav>

      {isLoading && <TaeguqLoading message="당신의 사주를 분석 중입니다..." fullScreen={true} />}

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">사주 분석</h1>
            <p className="text-lg text-muted-foreground">생년월일시를 입력하여 상세한 분석을 받으세요</p>
          </div>

          {/* Input Form */}
          <Card className="bg-card border border-border rounded-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 년주 */}
              <div className="space-y-2">
                <Label htmlFor="year" className="text-foreground font-medium">
                  출생 년도
                </Label>
                <Input
                  id="year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", parseInt(e.target.value))}
                  className="bg-input border border-border"
                />
              </div>

              {/* 월주 */}
              <div className="space-y-2">
                <Label htmlFor="month" className="text-foreground font-medium">
                  출생 월
                </Label>
                <Select value={formData.month.toString()} onValueChange={(v) => handleInputChange("month", parseInt(v))}>
                  <SelectTrigger className="bg-input border border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <SelectItem key={m} value={m.toString()}>
                        {m}月
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 일주 */}
              <div className="space-y-2">
                <Label htmlFor="day" className="text-foreground font-medium">
                  출생 일
                </Label>
                <Select value={formData.day.toString()} onValueChange={(v) => handleInputChange("day", parseInt(v))}>
                  <SelectTrigger className="bg-input border border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                      <SelectItem key={d} value={d.toString()}>
                        {d}日
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 시주 */}
              <div className="space-y-2">
                <Label htmlFor="hour" className="text-foreground font-medium">
                  출생 시간
                </Label>
                <Select value={formData.hour.toString()} onValueChange={(v) => handleInputChange("hour", parseInt(v))}>
                  <SelectTrigger className="bg-input border border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                      <SelectItem key={h} value={h.toString()}>
                        {h.toString().padStart(2, "0")}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 성별 */}
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-foreground font-medium">
                  성별
                </Label>
                <Select value={formData.gender} onValueChange={(v) => handleInputChange("gender", v)}>
                  <SelectTrigger className="bg-input border border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">남성</SelectItem>
                    <SelectItem value="F">여성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Analyze Button */}
            <Button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  분석 중...
                </>
              ) : (
                "내 사주 분석하기"
              )}
            </Button>
          </Card>

          {/* Results */}
          {result && (
            <div className="space-y-8 animate-fade-in">
              {/* Four Pillars */}
              <Card className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">나의 사주팔자 (四柱)</h2>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: "년주", stem: result.saju.yearStem, branch: result.saju.yearBranch },
                    { label: "월주", stem: result.saju.monthStem, branch: result.saju.monthBranch },
                    { label: "일주", stem: result.saju.dayStem, branch: result.saju.dayBranch },
                    { label: "시주", stem: result.saju.timeStem, branch: result.saju.timeBranch },
                  ].map((pillar, idx) => (
                    <div key={idx} className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 text-center">
                      <div className="text-xs text-muted-foreground mb-2">{pillar.label}</div>
                      <div className="text-2xl font-bold text-primary">{pillar.stem}</div>
                      <div className="text-2xl font-bold text-secondary">{pillar.branch}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* 오행 */}
              <Card className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">오행 Balance</h2>
                <div className="grid grid-cols-5 gap-4">
                  {[
                    { name: "Wood", value: result.elements.wood, color: "bg-green-100" },
                    { name: "Fire", value: result.elements.fire, color: "bg-red-100" },
                    { name: "Earth", value: result.elements.earth, color: "bg-yellow-100" },
                    { name: "Metal", value: result.elements.metal, color: "bg-gray-100" },
                    { name: "Water", value: result.elements.water, color: "bg-blue-100" },
                  ].map((element, idx) => (
                    <div key={idx} className={`${element.color} border border-border rounded-lg p-4 text-center`}>
                      <div className="text-sm font-medium text-foreground mb-2">{element.name}</div>
                      <div className="text-3xl font-bold text-primary">{element.value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Balance Score:</span> {result.elementBalance}/100
                  </p>
                </div>
              </Card>

              {/* 대운 */}
              <Card className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">대운 (大運)</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
                    <span className="text-foreground font-medium">Starting Age</span>
                    <span className="text-2xl font-bold text-primary">{result.saju.majorPeriodStartAge}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
                    <span className="text-foreground font-medium">대운 Pillar</span>
                    <div className="text-2xl font-bold">
                      <span className="text-primary">{result.saju.majorPeriodStem}</span>
                      <span className="text-secondary ml-2">{result.saju.majorPeriodBranch}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 일주 Master */}
              <Card className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">일주 Master (日干)</h2>
                <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg">
                  <div className="text-6xl font-bold text-primary mb-4">{result.saju.dayMaster}</div>
                  <p className="text-muted-foreground">Your core personality and essence</p>
                </div>

              {/* Share Card */}
              <ShareCard
                type="saju"
                data={{
                  birthDate: `${formData.year}년 ${formData.month}월 ${formData.day}일 ${formData.hour}시`,
                  yearStem: result.saju.yearStem,
                  yearBranch: result.saju.yearBranch,
                  monthStem: result.saju.monthStem,
                  monthBranch: result.saju.monthBranch,
                  dayStem: result.saju.dayStem,
                  dayBranch: result.saju.dayBranch,
                  timeStem: result.saju.timeStem,
                  timeBranch: result.saju.timeBranch,
                  dayMaster: result.saju.dayMaster,
                  woodStrength: result.elements.wood || 0,
                  fireStrength: result.elements.fire || 0,
                  earthStrength: result.elements.earth || 0,
                  metalStrength: result.elements.metal || 0,
                  waterStrength: result.elements.water || 0,
                }}
                title="내 사주 분석 결과"
              />
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
