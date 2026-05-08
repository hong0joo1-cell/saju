import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Loader2, Send } from "lucide-react";
import TaeguqLoading from "@/components/TaeguqLoading";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface SajuContext {
  yearStem: string;
  yearBranch: string;
  monthStem: string;
  monthBranch: string;
  dayStem: string;
  dayBranch: string;
  timeStem: string;
  timeBranch: string;
  woodStrength: number;
  fireStrength: number;
  earthStrength: number;
  metalStrength: number;
  waterStrength: number;
}

export default function 상담() {
  const sajuContext: SajuContext | undefined = undefined;
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "안녕하세요. 저는 명리학 전문가입니다. 당신의 사주에 대해 궁금한 점이 있으시면 편하게 물어봐 주세요. 성격, 건강, 재물운, 직업운, 연애/결혼운, 가족운 등 다양한 주제에 대해 상담해 드릴 수 있습니다.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const askExpertMutation = trpc.consultation.askExpert.useMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await askExpertMutation.mutateAsync({
        question: input,
        context: sajuContext,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: typeof response.response === 'string' ? response.response : '',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error asking expert:", error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content:
          "죄송합니다. 현재 상담 서비스를 이용할 수 없습니다. 잠시 후 다시 시도해주세요.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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

      {/* Loading Overlay */}
      {isLoading && <TaeguqLoading message="명리학 전문가가 분석 중입니다..." fullScreen={true} />}

      <div className="container py-12">
        <div className="max-w-3xl mx-auto h-[calc(100vh-200px)] flex flex-col">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Expert 상담</h1>
            <p className="text-muted-foreground">AI 명리학 전문가에게 당신의 사주에 대해 물어보세요</p>
          </div>

          {/* Chat Container */}
          <Card className="flex-1 bg-card border border-border rounded-lg p-6 mb-6 overflow-y-auto flex flex-col">
            {/* Messages */}
            <div className="space-y-4 flex-1">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-secondary/20 text-foreground border border-secondary/30 rounded-bl-none"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div className="text-sm prose prose-sm dark:prose-invert max-w-none">{message.content}</div>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary/20 text-foreground border border-secondary/30 rounded-lg rounded-bl-none px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">생각 중입니다...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </Card>

          {/* Input Area */}
          <Card className="bg-card border border-border rounded-lg p-4">
            <div className="flex gap-3">
              <Input
                placeholder="질문을 입력하세요..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1 bg-input border border-border"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="mt-6 space-y-3">
            <p className="text-sm text-muted-foreground text-center">빠른 질문</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                "내 성격은?",
                "건강 운세",
                "재물운",
                "직업운",
                "연애운",
                "결혼운",
                "가족운",
                "올해 운세",
              ].map((question) => (
                <Button
                  key={question}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInput(question);
                  }}
                  className="text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
