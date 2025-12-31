import { Sparkles, FileText, Lightbulb, MessageSquare, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarterPrompt {
  icon: React.ElementType;
  text: string;
  description?: string;
}

interface ChatEmptyStateProps {
  onPromptClick: (prompt: string) => void;
}

const starterPrompts: StarterPrompt[] = [
  {
    icon: FileText,
    text: "Help me write a product brief",
    description: "Structure your ideas",
  },
  {
    icon: Lightbulb,
    text: "Brainstorm solutions for...",
    description: "Explore possibilities",
  },
  {
    icon: MessageSquare,
    text: "Explain a complex concept",
    description: "Break it down simply",
  },
  {
    icon: Zap,
    text: "Create an action plan",
    description: "Step-by-step guidance",
  },
];

export function ChatEmptyState({ onPromptClick }: ChatEmptyStateProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 py-12 animate-in fade-in duration-500">
      {/* Icon */}
      <div className="relative mb-6">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center ring-1 ring-primary/10">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-accent flex items-center justify-center ring-2 ring-background">
          <span className="text-[10px] text-accent-foreground font-bold">AI</span>
        </div>
      </div>

      {/* Title & Subtitle */}
      <h2 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">
        Start thinking
      </h2>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-10 leading-relaxed">
        Your personal thinking space. Ask questions, explore ideas, and work through problems together with AI.
      </p>

      {/* Starter Prompts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl w-full">
        {starterPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => onPromptClick(prompt.text)}
            className={cn(
              "flex items-start gap-3 p-4 text-left",
              "bg-card border border-border rounded-xl",
              "hover:border-primary/30 hover:shadow-card",
              "transition-all duration-200 group"
            )}
          >
            <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
              <prompt.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground block">
                {prompt.text}
              </span>
              {prompt.description && (
                <span className="text-xs text-muted-foreground mt-0.5 block">
                  {prompt.description}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
