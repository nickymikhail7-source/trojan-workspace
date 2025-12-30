import { FileText, Layers, Lightbulb, MoreHorizontal, Copy, Share2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ShareModal } from "./ShareModal";
import { ArtifactPreviewModal } from "./ArtifactPreviewModal";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const artifactLabels: Record<string, string> = {
  doc: "Document",
  diagram: "Diagram", 
  idea: "Insight",
  target: "Goal",
  book: "Research",
  design: "Design",
  layers: "Layers",
  code: "Code",
  chart: "Chart",
  checklist: "Checklist",
};

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
  onDuplicate?: (workspace: Workspace) => void;
}

const tagColors: Record<string, string> = {
  Pitch: "bg-blue-50 text-blue-700 border-blue-200",
  Architecture: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Research: "bg-amber-50 text-amber-700 border-amber-200",
  Strategy: "bg-violet-50 text-violet-700 border-violet-200",
  Design: "bg-rose-50 text-rose-700 border-rose-200",
  Planning: "bg-sky-50 text-sky-700 border-sky-200",
};

export function WorkspaceCard({ workspace, className, variant = "default", onClick, onDuplicate }: WorkspaceCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [artifactModalOpen, setArtifactModalOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenNewWindow = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`/workspace/${workspace.id}`, '_blank');
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDuplicate) {
      onDuplicate(workspace);
    } else {
      toast({
        title: "Workspace duplicated",
        description: `Created a copy of "${workspace.title}"`,
      });
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShareModalOpen(true);
  };

  const handleArtifactStripClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setArtifactModalOpen(true);
  };

  return (
    <>
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
            onClick={handleOpenNewWindow}
            title="Open in new window"
            className="h-7 w-7 rounded-md bg-secondary hover:bg-muted flex items-center justify-center transition-colors duration-150"
          >
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          <button 
            onClick={handleDuplicate}
            title="Duplicate workspace"
            className="h-7 w-7 rounded-md bg-secondary hover:bg-muted flex items-center justify-center transition-colors duration-150"
          >
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          <button 
            onClick={handleShare}
            title="Share workspace"
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

          {/* Artifact Preview Strip - Now Clickable */}
          {workspace.artifacts && workspace.artifacts.length > 0 && (
            <div 
              className="flex items-center gap-2 pt-2 border-t border-border cursor-pointer hover:bg-secondary/30 -mx-4 px-4 -mb-4 pb-4 rounded-b-xl transition-colors"
              onClick={handleArtifactStripClick}
            >
            <TooltipProvider delayDuration={200}>
              {workspace.artifacts.slice(0, 4).map((artifact, idx) => {
                const Icon = artifact.icon;
                const label = artifactLabels[artifact.type] || artifact.type;
                return (
                  <Tooltip key={idx}>
                    <TooltipTrigger asChild>
                      <div className="h-6 w-6 rounded bg-secondary flex items-center justify-center">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      {label}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
              {workspace.artifacts.length > 4 && (
                <span className="text-[10px] text-muted-foreground">
                  +{workspace.artifacts.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        workspaceTitle={workspace.title}
        workspaceId={workspace.id}
      />

      <ArtifactPreviewModal
        isOpen={artifactModalOpen}
        onClose={() => setArtifactModalOpen(false)}
        workspaceTitle={workspace.title}
        artifacts={workspace.artifacts || []}
        onArtifactClick={(artifact) => {
          toast({
            title: "Opening artifact",
            description: `Viewing ${artifact.type} artifact`,
          });
          setArtifactModalOpen(false);
        }}
      />
    </>
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
