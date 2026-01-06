import { Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentWorkspaceItemProps {
  id: string;
  title: string;
  lastActive: string;
  preview?: string;
  onClick: () => void;
}

export function RecentWorkspaceItem({
  title,
  lastActive,
  preview,
  onClick,
}: RecentWorkspaceItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full flex items-center gap-3 p-3 rounded-xl text-left",
        "bg-card/50 border border-transparent",
        "hover:bg-card hover:border-border hover:shadow-sm",
        "transition-all duration-200"
      )}
    >
      <div className="h-10 w-10 rounded-lg bg-muted/60 flex items-center justify-center shrink-0 group-hover:bg-muted transition-colors">
        <Clock className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground text-sm truncate">
          {title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {lastActive}
        </p>
        {preview && (
          <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-1">
            {preview}
          </p>
        )}
      </div>
      
      <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
