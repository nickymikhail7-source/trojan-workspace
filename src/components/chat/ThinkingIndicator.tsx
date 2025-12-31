import { Sparkles } from "lucide-react";

export function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-3 text-muted-foreground animate-in fade-in duration-300">
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 ring-1 ring-border/50">
        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-sm">Thinking</span>
        <span className="flex gap-0.5">
          <span className="w-1 h-1 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
          <span className="w-1 h-1 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
          <span className="w-1 h-1 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
        </span>
      </div>
    </div>
  );
}
