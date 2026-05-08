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

interface YearlyFortuneData {
  year: number;
  age: number;
  dayMaster: string;
  majorPeriod: string;
  minorPeriod: string;
  monthlyFortune: string;
  overallFortune: string;
  fortuneScore: number;
  recommendations: string[];
}

export default function YearlyFortune() {
  const [formData, setFormData] = useState({
    year: new Date().getFullYear() - 30,
    month: 1,
    day: 1,
    hour: 12,
    gender: "M" as "M" | "F",
    targetYear: new Date().getFullYear(),
  });

  const [results, setResults] = useState<YearlyFortuneData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      // 현재 연도부터 5년간의 운세 분석
      const fortuneData: YearlyFortuneData[] = [];

      for (let i = 0; i < 5; i++) {
        const year = formData.targetYear + i;
        const age = year - formData.year;

        // 간단한 운세 점수 계산 (실제로는 복잡한 명리학 계산)
        const fortuneScore = Math.floor(Math.random() * 40 + 60);

        fortuneData.push({
          year,
          age,
          dayMaster: "甲",
          majorPeriod: `대운 ${Math.floor(age / 10) * 10}년`,
          minorPeriod: `세운 ${year % 12}`,
          monthlyFortune: "월운 분석",
          overallFortune: `${year}년 운세`,
          fortuneScore,
          recommendations: [
            "이 시기에 중요한 결정은 신중하게",
            "건강 관리에 주의",
            "인간관계를 소중히 여기기",
            "새로운 도전에 적극적",
          ],
        });
      }

      setResults(fortuneData);
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

  const getFortuneColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
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

      {isLoading && <TaeguqLoading message="나이별 운세를 분석 중입니다..." fullScreen={true} />}

      <div className="container py-12">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">나이별 운세 분석</h1>
            <p className="text-lg text-muted-foreground">Discover your fortune for the next 5 years</p>
          </div>

          {/* Input Form */}
          <Card className="bg-card border border-border rounded-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Birth Date */}
              <div className="space-y-2">
                <Label className="text-foreground font-medium">Birth Year</Label>
                <Input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", parseInt(e.target.value))}
                  className="bg-input border border-border"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Birth Month</Label>
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

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Birth Day</Label>
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

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Birth Hour</Label>
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

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Gender</Label>
                <Select value={formData.gender} onValueChange={(v) => handleInputChange("gender", v)}>
                  <SelectTrigger className="bg-input border border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Start Year</Label>
                <Input
                  type="number"
                  min={new Date().getFullYear()}
                  value={formData.targetYear}
                  onChange={(e) => handleInputChange("targetYear", parseInt(e.target.value))}
                  className="bg-input border border-border"
                />
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
                  Analyzing...
                </>
              ) : (
                "Analyze 5-Year Fortune"
              )}
            </Button>
          </Card>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-6 animate-fade-in">
              {results.map((fortune, idx) => (
                <Card key={idx} className="bg-card border border-border rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Year Info */}
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-4">{fortune.year} (Age {fortune.age})</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-secondary/10 border border-secondary/20 rounded">
                          <span className="text-muted-foreground">Major Period</span>
                          <span className="font-semibold text-foreground">{fortune.majorPeriod}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-secondary/10 border border-secondary/20 rounded">
                          <span className="text-muted-foreground">Minor Period</span>
                          <span className="font-semibold text-foreground">{fortune.minorPeriod}</span>
                        </div>
                      </div>
                    </div>

                    {/* Fortune Score */}
                    <div className="flex flex-col justify-between">
                      <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-2">Fortune Score</div>
                        <div className={`text-4xl font-bold ${getFortuneColor(fortune.fortuneScore)}`}>
                          {fortune.fortuneScore}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          {fortune.fortuneScore >= 80
                            ? "Excellent"
                            : fortune.fortuneScore >= 70
                              ? "Good"
                              : fortune.fortuneScore >= 60
                                ? "Moderate"
                                : "Challenging"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="text-sm font-semibold text-foreground mb-3">Recommendations</h4>
                    <ul className="space-y-2">
                      {fortune.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <span className="text-primary font-bold">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}

              {/* Share Card for First Year */}
              {results.length > 0 && (
                <ShareCard
                  type="saju"
                  data={{
                    birthDate: `${formData.year}년 ${formData.month}월 ${formData.day}일 ${formData.hour}시`,
                    yearStem: "甲",
                    yearBranch: "子",
                    monthStem: "丙",
                    monthBranch: "寅",
                    dayStem: "甲",
                    dayBranch: "子",
                    timeStem: "甲",
                    timeBranch: "午",
                    dayMaster: `${results[0].dayMaster} (${results[0].year})`,
                    woodStrength: results[0].fortuneScore,
                    fireStrength: results[0].fortuneScore,
                    earthStrength: results[0].fortuneScore,
                    metalStrength: results[0].fortuneScore,
                    waterStrength: results[0].fortuneScore,
                  }}
                  title={`${results[0].year}년 운세 분석`}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
