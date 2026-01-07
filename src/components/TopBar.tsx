import { useEffect, useRef, useState } from "react";
import { Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobalCommandBar, GlobalCommandBarRef } from "./GlobalCommandBar";

interface TopBarProps {
  onNewWorkspace: () => void;
}

export function TopBar({ onNewWorkspace }: TopBarProps) {
  const commandBarRef = useRef<GlobalCommandBarRef>(null);
  const [isCommandBarFocused, setIsCommandBarFocused] = useState(false);

  // Global ⌘K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        commandBarRef.current?.focus();
        setIsCommandBarFocused(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
      {/* Left: Wordmark */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Trojan
        </span>
      </div>

      {/* Center: Global Command Bar */}
      <div className="flex-1 max-w-xl mx-6">
        <GlobalCommandBar
          ref={commandBarRef}
          className="w-full"
          onClose={() => setIsCommandBarFocused(false)}
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 shrink-0">
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
