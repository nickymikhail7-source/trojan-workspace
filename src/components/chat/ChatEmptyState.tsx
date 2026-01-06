import { FileText, Lightbulb, MessageSquare, Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrojanLogo } from "@/components/TrojanLogo";

interface StarterPrompt {
  icon: React.ElementType;
  text: string;
  description?: string;
  gradient: string;
}

interface ChatEmptyStateProps {
  onPromptClick: (prompt: string) => void;
}

const starterPrompts: StarterPrompt[] = [
  {
    icon: FileText,
    text: "Help me write a product brief",
    description: "Structure your ideas",
    gradient: "from-blue-500/20 to-blue-600/5",
  },
  {
    icon: Lightbulb,
    text: "Brainstorm solutions for...",
    description: "Explore possibilities",
    gradient: "from-amber-500/20 to-amber-600/5",
  },
  {
    icon: MessageSquare,
    text: "Explain a complex concept",
    description: "Break it down simply",
    gradient: "from-green-500/20 to-green-600/5",
  },
  {
    icon: Zap,
    text: "Create an action plan",
    description: "Step-by-step guidance",
    gradient: "from-purple-500/20 to-purple-600/5",
  },
];

export function ChatEmptyState({ onPromptClick }: ChatEmptyStateProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 py-12 animate-fade-in">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Trojan Logo */}
      <div className="relative mb-8">
        <TrojanLogo size="lg" showText={false} className="scale-150" />
        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-primary/20" style={{ animationDuration: '3s' }} />
      </div>

      {/* Title & Subtitle */}
      <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
        Start thinking
      </h2>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-12 leading-relaxed">
        Your personal thinking space. Ask questions, explore ideas, and work through problems together with AI.
      </p>

      {/* Starter Prompts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl w-full relative z-10">
        {starterPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => onPromptClick(prompt.text)}
            className={cn(
              "relative flex items-start gap-4 p-5 text-left overflow-hidden",
              "bg-card border border-border/80 rounded-2xl",
              "hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5",
              "transition-all duration-300 group hover:-translate-y-0.5"
            )}
          >
            {/* Background gradient on hover */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              prompt.gradient
            )} />
            
            <div className="relative h-11 w-11 rounded-xl bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors duration-300 ring-1 ring-border/50 group-hover:ring-primary/20">
              <prompt.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            </div>
            <div className="relative flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground block group-hover:text-primary transition-colors">
                {prompt.text}
              </span>
              {prompt.description && (
                <span className="text-xs text-muted-foreground mt-1 block">
                  {prompt.description}
                </span>
              )}
            </div>
            <ArrowRight className="relative h-4 w-4 text-muted-foreground/0 group-hover:text-primary group-hover:translate-x-0 -translate-x-2 transition-all duration-300 self-center opacity-0 group-hover:opacity-100" />
          </button>
        ))}
      </div>
    </div>
  );
}
