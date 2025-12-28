import { FileText, Layers, Lightbulb, MoreHorizontal, Copy, Share2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface Workspace {
  id: string;
  title: string;
  lastActive: string;
  tags: string[];
  artifacts?: { type: string; icon: React.ComponentType<{ className?: string }> }[];
}

interface WorkspaceCardProps {
  workspace: Workspace;
  className?: string;
  variant?: "default" | "compact";
  onClick?: () => void;
}

const tagColors: Record<string, string> = {
  Pitch: "bg-blue-50 text-blue-700 border-blue-200",
  Architecture: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Research: "bg-amber-50 text-amber-700 border-amber-200",
  Strategy: "bg-violet-50 text-violet-700 border-violet-200",
  Design: "bg-rose-50 text-rose-700 border-rose-200",
  Planning: "bg-sky-50 text-sky-700 border-sky-200",
};

export function WorkspaceCard({ workspace, className, variant = "default", onClick }: WorkspaceCardProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={cn(
        "workspace-card cursor-pointer group relative",
        variant === "compact" ? "min-w-[240px] max-w-[280px]" : "",
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Quick Actions */}
      <div 
        className={cn(
          "absolute top-3 right-3 flex items-center gap-1 transition-opacity duration-150",
          showActions ? "opacity-100" : "opacity-0"
        )}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); console.log('Open', workspace.id); }}
          className="h-7 w-7 rounded-md bg-secondary hover:bg-muted flex items-center justify-center transition-colors duration-150"
        >
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); console.log('Duplicate', workspace.id); }}
          className="h-7 w-7 rounded-md bg-secondary hover:bg-muted flex items-center justify-center transition-colors duration-150"
        >
          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); console.log('Share', workspace.id); }}
          className="h-7 w-7 rounded-md bg-secondary hover:bg-muted flex items-center justify-center transition-colors duration-150"
        >
          <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <h3 className="font-medium text-foreground text-sm leading-tight pr-20">
            {workspace.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {workspace.lastActive}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {workspace.tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "px-2 py-0.5 text-[10px] font-medium rounded-full border",
                tagColors[tag] || "bg-secondary text-secondary-foreground border-border"
              )}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Artifact Preview Strip */}
        {workspace.artifacts && workspace.artifacts.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            {workspace.artifacts.slice(0, 4).map((artifact, idx) => {
              const Icon = artifact.icon;
              return (
                <div
                  key={idx}
                  className="h-6 w-6 rounded bg-secondary flex items-center justify-center"
                >
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              );
            })}
            {workspace.artifacts.length > 4 && (
              <span className="text-[10px] text-muted-foreground">
                +{workspace.artifacts.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface NewWorkspaceCardProps {
  onClick: () => void;
  variant?: "default" | "large";
}

export function NewWorkspaceCard({ onClick, variant = "default" }: NewWorkspaceCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "workspace-card text-left group hover:border-accent/30",
        variant === "large" ? "flex flex-col items-center justify-center min-h-[160px] gap-4" : "min-w-[240px]"
      )}
    >
      <div className={cn(
        "rounded-lg bg-secondary flex items-center justify-center transition-colors duration-200 group-hover:bg-accent/10",
        variant === "large" ? "h-12 w-12" : "h-10 w-10 mb-3"
      )}>
        <svg
          className={cn(
            "text-muted-foreground group-hover:text-accent transition-colors duration-200",
            variant === "large" ? "h-6 w-6" : "h-5 w-5"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
      
      <div className={variant === "large" ? "text-center" : ""}>
        <h3 className="font-medium text-foreground text-sm">New Workspace</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Start thinking from a clean slate.
        </p>
      </div>
    </button>
  );
}
