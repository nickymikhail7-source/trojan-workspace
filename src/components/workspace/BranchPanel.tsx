import { useState } from "react";
import { GitBranch, Plus, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Branch {
  id: string;
  title: string;
  isActive: boolean;
  messageCount: number;
}

interface BranchPanelProps {
  branches: Branch[];
  activeBranchId: string;
  onBranchSelect: (id: string) => void;
  onNewBranch: () => void;
}

export function BranchPanel({ branches, activeBranchId, onBranchSelect, onNewBranch }: BranchPanelProps) {
  return (
    <div className="w-56 border-r border-border bg-sidebar flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Branches</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onNewBranch}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Branch List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {branches.map((branch) => (
          <button
            key={branch.id}
            onClick={() => onBranchSelect(branch.id)}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors duration-150 group",
              branch.id === activeBranchId
                ? "bg-accent/10 text-foreground"
                : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
            )}
          >
            <ChevronRight className={cn(
              "h-3.5 w-3.5 transition-transform duration-150",
              branch.id === activeBranchId && "rotate-90 text-accent"
            )} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{branch.title}</p>
              <p className="text-xs text-muted-foreground">{branch.messageCount} messages</p>
            </div>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 h-6 w-6 rounded flex items-center justify-center hover:bg-secondary">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </button>
        ))}
      </div>
    </div>
  );
}
