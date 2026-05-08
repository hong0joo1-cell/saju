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

export default function Compatibility() {
  const [formData, setFormData] = useState({
    firstName: "",
    firstYear: new Date().getFullYear() - 30,
    firstMonth: 1,
    firstDay: 1,
    firstHour: 12,
    firstGender: "M" as "M" | "F",
    secondName: "",
    secondYear: new Date().getFullYear() - 28,
    secondMonth: 1,
    secondDay: 1,
    secondHour: 12,
    secondGender: "F" as "M" | "F",
  });

  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const compatibilityMutation = trpc.saju.compatibility.useQuery(
    {
      firstName: formData.firstName,
      firstYear: formData.firstYear,
      firstMonth: formData.firstMonth,
      firstDay: formData.firstDay,
      firstHour: formData.firstHour,
      firstGender: formData.firstGender,
      secondName: formData.secondName,
      secondYear: formData.secondYear,
      secondMonth: formData.secondMonth,
      secondDay: formData.secondDay,
      secondHour: formData.secondHour,
      secondGender: formData.secondGender,
    },
    {
      enabled: false,
    }
  );

  const handleAnalyze = async () => {
    if (!formData.firstName || !formData.secondName) {
      alert("Please enter both names");
      return;
    }

    setIsLoading(true);
    try {
      const data = await compatibilityMutation.refetch();
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

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getCompatibilityMessage = (score: number) => {
    if (score >= 80) return "Excellent Compatibility";
    if (score >= 60) return "Good Compatibility";
    if (score >= 40) return "Moderate Compatibility";
    return "Challenging Compatibility";
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

      {isLoading && <TaeguqLoading message="두 분의 궁합을 분석 중입니다..." fullScreen={true} />}

      <div className="container py-12">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">궁합 분석</h1>
            <p className="text-lg text-muted-foreground">Compare two birth charts for relationship compatibility</p>
          </div>

          {/* Input Form */}
          <Card className="bg-card border border-border rounded-lg p-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* First Person */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground border-b border-border pb-4">First Person</h2>

                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-foreground font-medium">
                    Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="bg-input border border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstYear" className="text-foreground font-medium">
                    Birth Year
                  </Label>
                  <Input
                    id="firstYear"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.firstYear}
                    onChange={(e) => handleInputChange("firstYear", parseInt(e.target.value))}
                    className="bg-input border border-border"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">Month</Label>
                    <Select value={formData.firstMonth.toString()} onValueChange={(v) => handleInputChange("firstMonth", parseInt(v))}>
                      <SelectTrigger className="bg-input border border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                          <SelectItem key={m} value={m.toString()}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">Day</Label>
                    <Select value={formData.firstDay.toString()} onValueChange={(v) => handleInputChange("firstDay", parseInt(v))}>
                      <SelectTrigger className="bg-input border border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                          <SelectItem key={d} value={d.toString()}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">Hour</Label>
                    <Select value={formData.firstHour.toString()} onValueChange={(v) => handleInputChange("firstHour", parseInt(v))}>
                      <SelectTrigger className="bg-input border border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                          <SelectItem key={h} value={h.toString()}>
                            {h.toString().padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Gender</Label>
                  <Select value={formData.firstGender} onValueChange={(v) => handleInputChange("firstGender", v)}>
                    <SelectTrigger className="bg-input border border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Second Person */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground border-b border-border pb-4">Second Person</h2>

                <div className="space-y-2">
                  <Label htmlFor="secondName" className="text-foreground font-medium">
                    Name
                  </Label>
                  <Input
                    id="secondName"
                    type="text"
                    placeholder="Enter name"
                    value={formData.secondName}
                    onChange={(e) => handleInputChange("secondName", e.target.value)}
                    className="bg-input border border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondYear" className="text-foreground font-medium">
                    Birth Year
                  </Label>
                  <Input
                    id="secondYear"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.secondYear}
                    onChange={(e) => handleInputChange("secondYear", parseInt(e.target.value))}
                    className="bg-input border border-border"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">Month</Label>
                    <Select value={formData.secondMonth.toString()} onValueChange={(v) => handleInputChange("secondMonth", parseInt(v))}>
                      <SelectTrigger className="bg-input border border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                          <SelectItem key={m} value={m.toString()}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">Day</Label>
                    <Select value={formData.secondDay.toString()} onValueChange={(v) => handleInputChange("secondDay", parseInt(v))}>
                      <SelectTrigger className="bg-input border border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                          <SelectItem key={d} value={d.toString()}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">Hour</Label>
                    <Select value={formData.secondHour.toString()} onValueChange={(v) => handleInputChange("secondHour", parseInt(v))}>
                      <SelectTrigger className="bg-input border border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                          <SelectItem key={h} value={h.toString()}>
                            {h.toString().padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Gender</Label>
                  <Select value={formData.secondGender} onValueChange={(v) => handleInputChange("secondGender", v)}>
                    <SelectTrigger className="bg-input border border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                "Check Compatibility"
              )}
            </Button>
          </Card>

          {/* Results */}
          {result && (
            <div className="space-y-8 animate-fade-in">
              {/* Compatibility Score */}
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-8">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-foreground">Compatibility Score</h2>
                  <div className={`text-6xl font-bold ${getCompatibilityColor(result.compatibilityScore)}`}>
                    {result.compatibilityScore}%
                  </div>
                  <p className="text-lg text-foreground font-semibold">{getCompatibilityMessage(result.compatibilityScore)}</p>
                </div>
              </Card>

              {/* Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* First Person Saju */}
                <Card className="bg-card border border-border rounded-lg p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-6">{result.firstName}</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: "Year", stem: result.firstSaju.yearStem, branch: result.firstSaju.yearBranch },
                        { label: "Month", stem: result.firstSaju.monthStem, branch: result.firstSaju.monthBranch },
                        { label: "Day", stem: result.firstSaju.dayStem, branch: result.firstSaju.dayBranch },
                        { label: "Hour", stem: result.firstSaju.timeStem, branch: result.firstSaju.timeBranch },
                      ].map((pillar, idx) => (
                        <div key={idx} className="bg-secondary/10 border border-secondary/20 rounded p-2 text-center text-sm">
                          <div className="text-xs text-muted-foreground mb-1">{pillar.label}</div>
                          <div className="font-bold text-primary">{pillar.stem}</div>
                          <div className="font-bold text-secondary">{pillar.branch}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Second Person Saju */}
                <Card className="bg-card border border-border rounded-lg p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-6">{result.secondName}</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: "Year", stem: result.secondSaju.yearStem, branch: result.secondSaju.yearBranch },
                        { label: "Month", stem: result.secondSaju.monthStem, branch: result.secondSaju.monthBranch },
                        { label: "Day", stem: result.secondSaju.dayStem, branch: result.secondSaju.dayBranch },
                        { label: "Hour", stem: result.secondSaju.timeStem, branch: result.secondSaju.timeBranch },
                      ].map((pillar, idx) => (
                        <div key={idx} className="bg-secondary/10 border border-secondary/20 rounded p-2 text-center text-sm">
                          <div className="text-xs text-muted-foreground mb-1">{pillar.label}</div>
                          <div className="font-bold text-primary">{pillar.stem}</div>
                          <div className="font-bold text-secondary">{pillar.branch}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

              {/* Share Card */}
              <ShareCard
                type="compatibility"
                data={{
                  firstName: result.firstName,
                  firstSaju: `${result.firstSaju.yearStem}${result.firstSaju.yearBranch} ${result.firstSaju.monthStem}${result.firstSaju.monthBranch} ${result.firstSaju.dayStem}${result.firstSaju.dayBranch} ${result.firstSaju.timeStem}${result.firstSaju.timeBranch}`,
                  secondName: result.secondName,
                  secondSaju: `${result.secondSaju.yearStem}${result.secondSaju.yearBranch} ${result.secondSaju.monthStem}${result.secondSaju.monthBranch} ${result.secondSaju.dayStem}${result.secondSaju.dayBranch} ${result.secondSaju.timeStem}${result.secondSaju.timeBranch}`,
                  compatibilityScore: result.compatibilityScore,
                  compatibility: getCompatibilityMessage(result.compatibilityScore),
                }}
                title="궁합 분석 결과"
              />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
