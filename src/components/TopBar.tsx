import { Search, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrojanLogo } from "./TrojanLogo";

interface TopBarProps {
  onNewWorkspace: () => void;
}

export function TopBar({ onNewWorkspace }: TopBarProps) {
  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
      {/* Left: Logo */}
      <TrojanLogo size="sm" />

      {/* Center: Global Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search workspaces, artifacts, decisions…"
            className="w-full h-9 pl-9 pr-4 bg-secondary rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all duration-150"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <Button 
          onClick={onNewWorkspace}
          size="sm" 
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Workspace</span>
        </Button>
        
        <button className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center hover:bg-surface-hover transition-colors duration-150">
          <User className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
