import { useState } from "react";
import { Zap, Brain, Search, Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type WorkMode = "quick" | "think" | "research" | "create";

interface WorkModeOption {
  id: WorkMode;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const workModeOptions: WorkModeOption[] = [
  {
    id: "quick",
    label: "Quick",
    description: "Fast, concise answer",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    id: "think",
    label: "Think",
    description: "Deep, thoughtful analysis",
    icon: <Brain className="h-4 w-4" />,
  },
  {
    id: "research",
    label: "Research",
    description: "Explore and investigate",
    icon: <Search className="h-4 w-4" />,
  },
  {
    id: "create",
    label: "Create",
    description: "Generate and build",
    icon: <Sparkles className="h-4 w-4" />,
  },
];

interface WorkModeSelectorProps {
  value: WorkMode;
  onChange: (mode: WorkMode) => void;
  className?: string;
}

export function WorkModeSelector({ value, onChange, className }: WorkModeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = workModeOptions.find((opt) => opt.id === value) || workModeOptions[1];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
            "text-sm font-medium transition-colors",
            "bg-secondary/80 hover:bg-secondary text-foreground",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
            className
          )}
        >
          {selectedOption.icon}
          <span>{selectedOption.label}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 p-1.5"
        align="start"
        sideOffset={8}
      >
        <div className="space-y-0.5">
          {workModeOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-start gap-3 px-3 py-2.5 rounded-md",
                "text-left transition-colors",
                option.id === value
                  ? "bg-primary/10 text-foreground"
                  : "hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
              )}
            >
              <span className={cn(
                "mt-0.5 flex-shrink-0",
                option.id === value ? "text-primary" : ""
              )}>
                {option.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{option.label}</div>
                <div className="text-xs text-muted-foreground/80">{option.description}</div>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Badge component for displaying the mode in messages
interface WorkModeBadgeProps {
  mode: WorkMode;
  className?: string;
}

export function WorkModeBadge({ mode, className }: WorkModeBadgeProps) {
  const option = workModeOptions.find((opt) => opt.id === mode);
  if (!option || mode === "think") return null; // Don't show badge for default mode

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full",
        "text-xs font-medium bg-secondary/60 text-muted-foreground",
        className
      )}
    >
      {option.icon}
      <span>{option.label}</span>
    </span>
  );
}
