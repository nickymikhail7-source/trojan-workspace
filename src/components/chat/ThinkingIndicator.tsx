import { Sparkles } from "lucide-react";

export function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-4 animate-fade-in">
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-accent/20 via-primary/15 to-primary/5 flex items-center justify-center ring-1 ring-primary/10 shadow-sm">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-amber-500 ring-2 ring-background animate-pulse" />
      </div>

      {/* Thinking bubble */}
      <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-5 py-3 shadow-card">
        <span className="text-sm text-muted-foreground font-medium">Thinking</span>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
