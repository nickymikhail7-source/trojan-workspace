import { Sparkles, TrendingUp, Link2, AlertTriangle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Insight {
  id: string;
  type: "summary" | "connection" | "trend" | "warning";
  title: string;
  description: string;
}

const insightIcons = {
  summary: Sparkles,
  connection: Link2,
  trend: TrendingUp,
  warning: AlertTriangle,
};

const insightColors = {
  summary: "bg-accent/10 text-accent",
  connection: "bg-emerald-500/10 text-emerald-600",
  trend: "bg-blue-500/10 text-blue-600",
  warning: "bg-amber-500/10 text-amber-600",
};

interface InsightsPanelProps {
  insights: Insight[];
  onInsightClick: (id: string) => void;
}

export function InsightsPanel({ insights, onInsightClick }: InsightsPanelProps) {
  return (
    <div className="w-72 border-l border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-accent" />
        <span className="text-sm font-medium text-foreground">AI Insights</span>
      </div>

      {/* Insights List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-3">
              <Sparkles className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Insights will appear as you work</p>
          </div>
        ) : (
          insights.map((insight) => {
            const Icon = insightIcons[insight.type];
            const colorClass = insightColors[insight.type];
            
            return (
              <button
                key={insight.id}
                onClick={() => onInsightClick(insight.id)}
                className="w-full p-3 rounded-lg border border-border bg-background hover:bg-surface-hover text-left transition-colors duration-150 group"
              >
                <div className="flex items-start gap-3">
                  <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center shrink-0", colorClass)}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{insight.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{insight.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0" />
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
