import { FileText, Layers, Lightbulb, Target, BookOpen, PenTool, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Artifact {
  type: string;
  icon: React.ComponentType<{ className?: string }>;
  title?: string;
  preview?: string;
}

interface ArtifactPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceTitle: string;
  artifacts: Artifact[];
  onArtifactClick?: (artifact: Artifact) => void;
}

const artifactMeta: Record<string, { label: string; color: string; description: string }> = {
  doc: {
    label: "Document",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    description: "Written content, notes, or documentation",
  },
  diagram: {
    label: "Diagram",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description: "Visual architecture or flow diagram",
  },
  idea: {
    label: "Insight",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    description: "AI-generated insight or recommendation",
  },
  target: {
    label: "Goal",
    color: "bg-violet-50 text-violet-700 border-violet-200",
    description: "Objective or milestone tracking",
  },
  book: {
    label: "Research",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    description: "Research findings or references",
  },
  design: {
    label: "Design",
    color: "bg-sky-50 text-sky-700 border-sky-200",
    description: "Visual design or mockup",
  },
  layers: {
    label: "Layers",
    color: "bg-teal-50 text-teal-700 border-teal-200",
    description: "Layered content or architecture",
  },
};

export function ArtifactPreviewModal({
  isOpen,
  onClose,
  workspaceTitle,
  artifacts,
  onArtifactClick,
}: ArtifactPreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-muted-foreground" />
            Artifacts in "{workspaceTitle}"
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          {artifacts.length === 0 ? (
            <div className="py-8 text-center">
              <Layers className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No artifacts yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Start a conversation to generate insights
              </p>
            </div>
          ) : (
            <div className="space-y-2 py-2">
              {artifacts.map((artifact, idx) => {
                const Icon = artifact.icon;
                const meta = artifactMeta[artifact.type] || {
                  label: artifact.type,
                  color: "bg-secondary text-secondary-foreground border-border",
                  description: "Workspace artifact",
                };

                return (
                  <button
                    key={idx}
                    onClick={() => onArtifactClick?.(artifact)}
                    className="w-full flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors text-left group"
                  >
                    <div
                      className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${meta.color} border`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground truncate">
                          {artifact.title || `${meta.label} ${idx + 1}`}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-medium rounded border ${meta.color}`}
                        >
                          {meta.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {artifact.preview || meta.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
