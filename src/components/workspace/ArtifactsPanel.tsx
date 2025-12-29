import { useState } from "react";
import { FileText, Layers, Lightbulb, Target, Plus, Search, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface Artifact {
  id: string;
  type: "doc" | "diagram" | "idea" | "decision" | "note";
  title: string;
  updatedAt: string;
}

const artifactIcons: Record<string, LucideIcon> = {
  doc: FileText,
  diagram: Layers,
  idea: Lightbulb,
  decision: Target,
  note: FileText,
};

interface ArtifactsPanelProps {
  artifacts: Artifact[];
  onArtifactSelect: (id: string) => void;
  onNewArtifact: () => void;
}

export function ArtifactsPanel({ artifacts, onArtifactSelect, onNewArtifact }: ArtifactsPanelProps) {
  const [search, setSearch] = useState("");

  const filteredArtifacts = artifacts.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-64 border-l border-border bg-sidebar flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Artifacts</span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onNewArtifact}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search artifacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 bg-secondary rounded-md text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </div>

      {/* Artifact List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredArtifacts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-muted-foreground">No artifacts yet</p>
          </div>
        ) : (
          filteredArtifacts.map((artifact) => {
            const Icon = artifactIcons[artifact.type] || FileText;
            return (
              <button
                key={artifact.id}
                onClick={() => onArtifactSelect(artifact.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors duration-150 group hover:bg-surface-hover"
              >
                <div className="h-7 w-7 rounded bg-secondary flex items-center justify-center shrink-0">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{artifact.title}</p>
                  <p className="text-[10px] text-muted-foreground">{artifact.updatedAt}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 h-6 w-6 rounded flex items-center justify-center hover:bg-secondary">
                  <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
