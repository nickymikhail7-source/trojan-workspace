import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type ThinkingPhase = "thinking" | "analyzing" | "preparing";

interface ThinkingIndicatorProps {
  className?: string;
}

const phaseConfig = {
  thinking: {
    text: "Thinking",
    duration: 1500,
  },
  analyzing: {
    text: "Analyzing",
    duration: 2000,
  },
  preparing: {
    text: "Preparing response",
    duration: 0,
  },
};

export function ThinkingIndicator({ className }: ThinkingIndicatorProps) {
  const [phase, setPhase] = useState<ThinkingPhase>("thinking");

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setPhase("analyzing");
    }, phaseConfig.thinking.duration);

    const timer2 = setTimeout(() => {
      setPhase("preparing");
    }, phaseConfig.thinking.duration + phaseConfig.analyzing.duration);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className={cn("flex items-center gap-4 animate-fade-in", className)}>
      {/* Avatar with animated ring */}
      <div className="relative shrink-0">
        {/* Outer pulsing ring */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent via-primary to-accent opacity-20 animate-pulse-ring" />
        
        {/* Rotating gradient ring */}
        <div className="absolute -inset-1 rounded-xl bg-gradient-conic from-accent via-primary via-accent to-accent opacity-30 animate-gradient-rotate blur-sm" />
        
        {/* Main avatar */}
        <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-accent/20 via-primary/15 to-primary/5 flex items-center justify-center ring-1 ring-primary/20 shadow-lg shadow-accent/10">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
        </div>
        
        {/* Status indicator */}
        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-amber-500 ring-2 ring-background animate-pulse" />
      </div>

      {/* Thinking bubble */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-5 py-3 shadow-card overflow-hidden relative">
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-shimmer animate-shimmer" />
          
          {/* Content */}
          <div className="relative flex items-center gap-3">
            <span className="text-sm text-muted-foreground font-medium">
              {phaseConfig[phase].text}
            </span>
            
            {/* Animated dots */}
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>

        {/* Progress skeleton lines */}
        <div className="flex flex-col gap-1.5 pl-1">
          <div className="h-2.5 w-48 rounded-full bg-muted/50 overflow-hidden">
            <div className="h-full w-full bg-shimmer animate-shimmer" />
          </div>
          <div className="h-2.5 w-36 rounded-full bg-muted/50 overflow-hidden">
            <div className="h-full w-full bg-shimmer animate-shimmer [animation-delay:100ms]" />
          </div>
          <div className="h-2.5 w-24 rounded-full bg-muted/50 overflow-hidden">
            <div className="h-full w-full bg-shimmer animate-shimmer [animation-delay:200ms]" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Streaming cursor component for use in messages
export function StreamingCursor() {
  return (
    <span className="inline-block w-0.5 h-4 bg-accent animate-blink ml-0.5 rounded-sm align-middle" />
  );
}

// Message skeleton for loading state
export function MessageSkeleton() {
  return (
    <div className="flex items-start gap-4 animate-fade-in">
      {/* Avatar skeleton */}
      <div className="h-9 w-9 rounded-xl bg-muted/50 animate-pulse shrink-0" />
      
      {/* Content skeleton */}
      <div className="flex-1 space-y-2.5 pt-1">
        <div className="h-3 w-3/4 rounded-full bg-muted/50 overflow-hidden">
          <div className="h-full w-full bg-shimmer animate-shimmer" />
        </div>
        <div className="h-3 w-1/2 rounded-full bg-muted/50 overflow-hidden">
          <div className="h-full w-full bg-shimmer animate-shimmer [animation-delay:100ms]" />
        </div>
        <div className="h-3 w-2/3 rounded-full bg-muted/50 overflow-hidden">
          <div className="h-full w-full bg-shimmer animate-shimmer [animation-delay:200ms]" />
        </div>
      </div>
    </div>
  );
}
