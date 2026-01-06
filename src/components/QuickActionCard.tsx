import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  onClick: () => void;
  variant?: "default" | "custom";
}

export function QuickActionCard({
  icon: Icon,
  label,
  description,
  onClick,
  variant = "default",
}: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full p-4 rounded-xl border text-left transition-all duration-200",
        "hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
        variant === "custom"
          ? "border-dashed border-border/60 bg-transparent hover:border-primary/40 hover:bg-primary/5"
          : "border-border bg-card hover:border-primary/30 hover:bg-card/80"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
            variant === "custom"
              ? "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
              : "bg-primary/10 text-primary"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground text-sm leading-tight">
            {label}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
