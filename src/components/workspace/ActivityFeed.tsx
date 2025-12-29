import { FileText, MessageSquare, GitBranch, Lightbulb, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Activity {
  id: string;
  type: "message" | "artifact" | "branch" | "insight";
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

const activityIcons: Record<string, LucideIcon> = {
  message: MessageSquare,
  artifact: FileText,
  branch: GitBranch,
  insight: Lightbulb,
};

const activityColors: Record<string, string> = {
  message: "bg-blue-500/10 text-blue-600",
  artifact: "bg-emerald-500/10 text-emerald-600",
  branch: "bg-violet-500/10 text-violet-600",
  insight: "bg-amber-500/10 text-amber-600",
};

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="space-y-3">
      {activities.map((activity, index) => {
        const Icon = activityIcons[activity.type] || FileText;
        const colorClass = activityColors[activity.type];
        
        return (
          <div
            key={activity.id}
            className="flex gap-3 animate-fade-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col items-center">
              <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", colorClass)}>
                <Icon className="h-4 w-4" />
              </div>
              {index < activities.length - 1 && (
                <div className="w-px flex-1 bg-border mt-2" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <span className="text-[10px] text-muted-foreground">{activity.timestamp}</span>
              </div>
              <p className="text-xs text-muted-foreground">{activity.description}</p>
              {activity.user && (
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center">
                    <User className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{activity.user}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
