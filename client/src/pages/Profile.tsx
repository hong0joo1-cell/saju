import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2, LogOut, ArrowLeft, Check, X } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

interface UserProfile {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Profile() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  
  const getProfileQuery = trpc.user.getProfile.useQuery(undefined, {
    enabled: isAuthenticated && !authLoading,
  });
  
  const updateProfileMutation = trpc.user.updateProfile.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate("/");
      return;
    }

    if (getProfileQuery.data) {
      const userData = getProfileQuery.data;
      const userName = (userData.name as string | null) ?? "";
      setProfile({
        id: userData.id,
        email: userData.email || "",
        name: userName,
        createdAt: userData.createdAt as Date,
        updatedAt: userData.updatedAt as Date,
      });
      setEditName(userName);
      setIsLoading(false);
    }
  }, [getProfileQuery.data, isAuthenticated, authLoading, navigate]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile || !editName.trim()) return;

    setSaveStatus("saving");
    try {
      const result = await updateProfileMutation.mutateAsync({
        name: editName.trim(),
      });

      if (result.success && result.user) {
        const updatedUser = result.user;
        const userName = (updatedUser.name as string | null) ?? "";
        setProfile({
          id: updatedUser.id,
          email: updatedUser.email || "",
          name: userName,
          createdAt: updatedUser.createdAt as Date,
          updatedAt: updatedUser.updatedAt as Date,
        });
        setIsEditing(false);
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 2000);
      }
    } catch (error) {
      console.error("Save profile error:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
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
            <a href="/history" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              기록
            </a>
          </div>
        </div>
      </nav>

      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Button>

          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">내 프로필</h1>
            <p className="text-lg text-muted-foreground">계정 정보를 확인하고 관리하세요</p>
          </div>

          {/* Status Messages */}
          {saveStatus === "success" && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-700">
              <Check className="h-5 w-5" />
              프로필이 저장되었습니다.
            </div>
          )}
          {saveStatus === "error" && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-700">
              <X className="h-5 w-5" />
              프로필 저장 중 오류가 발생했습니다.
            </div>
          )}

          {/* Profile Card */}
          <Card className="bg-card border border-border rounded-lg p-8 mb-8">
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  이메일
                </label>
                <div className="p-3 bg-secondary/10 rounded border border-border text-foreground">
                  {profile.email}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  이름
                </label>
                {isEditing ? (
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="이름을 입력하세요"
                    className="bg-input border border-border"
                    disabled={saveStatus === "saving"}
                  />
                ) : (
                  <div className="p-3 bg-secondary/10 rounded border border-border text-foreground">
                    {profile.name || "미설정"}
                  </div>
                )}
              </div>

              {/* Member Since */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  가입일
                </label>
                <div className="p-3 bg-secondary/10 rounded border border-border text-foreground">
                  {new Date(profile.createdAt).toLocaleDateString('ko-KR')}
                </div>
              </div>

              {/* Last Updated */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  마지막 수정일
                </label>
                <div className="p-3 bg-secondary/10 rounded border border-border text-foreground">
                  {new Date(profile.updatedAt).toLocaleDateString('ko-KR')}
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSaveProfile}
                  disabled={saveStatus === "saving" || !editName.trim()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                >
                  {saveStatus === "saving" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      저장 중...
                    </>
                  ) : (
                    "저장"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditName(profile.name || "");
                    setSaveStatus("idle");
                  }}
                  disabled={saveStatus === "saving"}
                  className="border border-border px-8"
                >
                  취소
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="border border-border px-8"
              >
                수정
              </Button>
            )}
          </div>

          {/* Logout Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">계정 관리</h2>
            <Button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {logoutMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  로그아웃 중...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  로그아웃
                </>
              )}
            </Button>
          </div>

          {/* Account Info */}
          <div className="mt-8 p-4 bg-secondary/5 rounded border border-border">
            <p className="text-xs text-muted-foreground">
              <strong>계정 정보:</strong> 이 페이지에서는 기본 프로필 정보를 관리합니다. 
              이름을 수정하면 자동으로 저장됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
