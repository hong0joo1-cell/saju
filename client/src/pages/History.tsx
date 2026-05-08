import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2, Trash2, Share2, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

interface SajuRecord {
  id: number;
  userId: number;
  name?: string;
  birthYear: number | null;
  birthMonth: number | null;
  birthDay: number | null;
  birthHour: number | null;
  birthMinute: number | null;
  gender: "M" | "F";
  yearStem: string;
  yearBranch: string;
  monthStem: string;
  monthBranch: string;
  dayStem: string;
  dayBranch: string;
  timeStem: string;
  timeBranch: string;
  dayMaster?: string;
  woodStrength: number | null;
  fireStrength: number | null;
  earthStrength: number | null;
  metalStrength: number | null;
  waterStrength: number | null;
  analysis?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function History() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [records, setRecords] = useState<SajuRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const getSajuHistoryQuery = trpc.saju.get.useQuery(undefined, {
    enabled: isAuthenticated && !authLoading,
  });

  const deleteSajuMutation = trpc.saju.delete.useMutation();

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate("/");
      return;
    }

    if (getSajuHistoryQuery.data) {
      setRecords(getSajuHistoryQuery.data);
      setIsLoading(false);
    }
  }, [getSajuHistoryQuery.data, isAuthenticated, authLoading, navigate]);

  const handleDelete = async (id: number) => {
    if (confirm("이 기록을 삭제하시겠습니까?")) {
      try {
        await deleteSajuMutation.mutateAsync({ id });
        setRecords(records.filter((r) => r.id !== id));
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };

  const handleShare = async (record: SajuRecord) => {
    // SNS 공유 기능 구현
    const shareText = `내 사주: ${record.yearStem}${record.yearBranch} ${record.monthStem}${record.monthBranch} ${record.dayStem}${record.dayBranch} ${record.timeStem}${record.timeBranch}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Premium Saju 분석",
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      // 클립보드에 복사
      await navigator.clipboard.writeText(shareText);
      alert("사주 정보가 클립보드에 복사되었습니다.");
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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
            <a href="/analysis" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              분석
            </a>
          </div>
        </div>
      </nav>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">내 사주 분석 기록</h1>
            <p className="text-lg text-muted-foreground">저장된 사주 분석 결과를 확인하고 관리하세요</p>
          </div>

          {/* Records List */}
          {records.length === 0 ? (
            <Card className="bg-card border border-border rounded-lg p-12 text-center">
              <p className="text-muted-foreground mb-6">아직 저장된 사주 분석이 없습니다.</p>
              <Button 
                onClick={() => navigate("/analysis")} 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                첫 분석 시작하기
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <Card 
                  key={record.id} 
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow hover:border-primary/50"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Saju Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {record.yearStem}
                        {record.yearBranch} {record.monthStem}
                        {record.monthBranch} {record.dayStem}
                        {record.dayBranch} {record.timeStem}
                        {record.timeBranch}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        일주천간: <span className="font-semibold text-foreground">{record.dayMaster}</span>
                      </p>

                      {/* Element Balance */}
                      <div className="grid grid-cols-5 gap-2 text-xs">
                        <div className="text-center p-2 bg-green-500/10 rounded border border-green-500/20">
                          <div className="font-semibold text-foreground">木</div>
                          <div className="text-muted-foreground">{record.woodStrength}</div>
                        </div>
                        <div className="text-center p-2 bg-red-500/10 rounded border border-red-500/20">
                          <div className="font-semibold text-foreground">火</div>
                          <div className="text-muted-foreground">{record.fireStrength}</div>
                        </div>
                        <div className="text-center p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                          <div className="font-semibold text-foreground">土</div>
                          <div className="text-muted-foreground">{record.earthStrength}</div>
                        </div>
                        <div className="text-center p-2 bg-gray-500/10 rounded border border-gray-500/20">
                          <div className="font-semibold text-foreground">金</div>
                          <div className="text-muted-foreground">{record.metalStrength}</div>
                        </div>
                        <div className="text-center p-2 bg-blue-500/10 rounded border border-blue-500/20">
                          <div className="font-semibold text-foreground">水</div>
                          <div className="text-muted-foreground">{record.waterStrength}</div>
                        </div>
                      </div>

                      {/* Date */}
                      <p className="text-xs text-muted-foreground mt-4">
                        저장일: {new Date(record.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 md:flex-row">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(record)}
                        className="border border-border hover:bg-primary/10 text-foreground"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        공유
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(record.id)}
                        className="border border-border text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        삭제
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
