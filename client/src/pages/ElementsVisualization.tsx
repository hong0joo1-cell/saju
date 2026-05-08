import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip, ResponsiveContainer } from "recharts";

export default function ElementsVisualization() {
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

  const radarData = result
    ? [
        {
          name: "Wood (목)",
          value: result.elements.wood,
          fullMark: 10,
        },
        {
          name: "Fire (화)",
          value: result.elements.fire,
          fullMark: 10,
        },
        {
          name: "Earth (토)",
          value: result.elements.earth,
          fullMark: 10,
        },
        {
          name: "Metal (금)",
          value: result.elements.metal,
          fullMark: 10,
        },
        {
          name: "Water (수)",
          value: result.elements.water,
          fullMark: 10,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="text-2xl font-bold text-primary">Premium Saju</div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </a>
          </div>
        </div>
      </nav>

      <div className="container py-12">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Five Elements Visualization</h1>
            <p className="text-lg text-muted-foreground">Visualize your elemental balance through radar chart</p>
          </div>

          {/* Input Form */}
          <Card className="bg-card border border-border rounded-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Year */}
              <div className="space-y-2">
                <Label htmlFor="year" className="text-foreground font-medium">
                  Birth Year
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

              {/* Month */}
              <div className="space-y-2">
                <Label htmlFor="month" className="text-foreground font-medium">
                  Birth Month
                </Label>
                <Select value={formData.month.toString()} onValueChange={(v) => handleInputChange("month", parseInt(v))}>
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

              {/* Day */}
              <div className="space-y-2">
                <Label htmlFor="day" className="text-foreground font-medium">
                  Birth Day
                </Label>
                <Select value={formData.day.toString()} onValueChange={(v) => handleInputChange("day", parseInt(v))}>
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

              {/* Hour */}
              <div className="space-y-2">
                <Label htmlFor="hour" className="text-foreground font-medium">
                  Birth Hour
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

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-foreground font-medium">
                  Gender
                </Label>
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
                "Visualize Elements"
              )}
            </Button>
          </Card>

          {/* Results */}
          {result && (
            <div className="space-y-8 animate-fade-in">
              {/* Radar Chart */}
              <Card className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Five Elements Balance</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="name" stroke="#6b7280" />
                    <PolarRadiusAxis angle={90} domain={[0, 10]} stroke="#6b7280" />
                    <Radar name="Strength" dataKey="value" stroke="#D4A853" fill="#D4A853" fillOpacity={0.6} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>

              {/* Elements Detail */}
              <Card className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Elemental Strengths</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { name: "Wood", value: result.elements.wood, color: "bg-green-100", icon: "🌿" },
                    { name: "Fire", value: result.elements.fire, color: "bg-red-100", icon: "🔥" },
                    { name: "Earth", value: result.elements.earth, color: "bg-yellow-100", icon: "🏔️" },
                    { name: "Metal", value: result.elements.metal, color: "bg-gray-100", icon: "⚔️" },
                    { name: "Water", value: result.elements.water, color: "bg-blue-100", icon: "💧" },
                  ].map((element, idx) => (
                    <div key={idx} className={`${element.color} border border-border rounded-lg p-4 text-center`}>
                      <div className="text-3xl mb-2">{element.icon}</div>
                      <div className="text-sm font-medium text-foreground mb-2">{element.name}</div>
                      <div className="text-2xl font-bold text-primary">{element.value}</div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {element.value >= 7 ? "Strong" : element.value >= 4 ? "Balanced" : "Weak"}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Balance Analysis */}
              <Card className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Balance Analysis</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
                    <span className="text-foreground font-medium">Overall Balance Score</span>
                    <span className="text-3xl font-bold text-primary">{result.elementBalance}/100</span>
                  </div>

                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-sm text-foreground">
                      {result.elementBalance >= 80
                        ? "Your five elements are very well balanced, indicating harmony and stability in life."
                        : result.elementBalance >= 60
                          ? "Your five elements are relatively balanced with minor imbalances."
                          : result.elementBalance >= 40
                            ? "Your five elements show some imbalance. Focus on strengthening weaker elements."
                            : "Your five elements are significantly imbalanced. Consider life adjustments to improve balance."}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
