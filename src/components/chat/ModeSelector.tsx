import * as React from "react";
import { ChevronDown, Zap, BookOpen, ListOrdered, MessageCircleQuestion, Database } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type ResponseMode = "auto" | "quick" | "deep" | "step-by-step" | "questions";

interface ModeOption {
  id: ResponseMode;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const modeOptions: ModeOption[] = [
  {
    id: "auto",
    label: "Auto",
    description: "Let Trojan decide the best approach",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    id: "quick",
    label: "Quick answer",
    description: "Fast, concise response",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    id: "deep",
    label: "Deep dive",
    description: "Thorough, detailed analysis",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    id: "step-by-step",
    label: "Step-by-step",
    description: "Structured, sequential breakdown",
    icon: <ListOrdered className="h-4 w-4" />,
  },
  {
    id: "questions",
    label: "Ask questions first",
    description: "Clarify before responding",
    icon: <MessageCircleQuestion className="h-4 w-4" />,
  },
];

interface ModeSelectorProps {
  value: ResponseMode;
  onChange: (mode: ResponseMode) => void;
  useWorkspaceKnowledge?: boolean;
  onWorkspaceKnowledgeChange?: (value: boolean) => void;
  disabled?: boolean;
}

export function ModeSelector({
  value,
  onChange,
  useWorkspaceKnowledge = false,
  onWorkspaceKnowledgeChange,
  disabled,
}: ModeSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedMode = modeOptions.find((m) => m.id === value) || modeOptions[0];

  const handleSelect = (mode: ResponseMode) => {
    onChange(mode);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          className={cn(
            "h-7 px-2.5 gap-1.5 rounded-full text-xs font-medium",
            "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground",
            "border border-transparent hover:border-border",
            "transition-all duration-200"
          )}
        >
          {selectedMode.icon}
          <span className="hidden sm:inline">{selectedMode.label}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-64 p-2"
        sideOffset={8}
      >
        <div className="mb-2 px-2">
          <h4 className="text-xs font-medium text-foreground">Response mode</h4>
        </div>

        <div className="space-y-0.5">
          {modeOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={cn(
                "w-full flex items-start gap-3 p-2.5 rounded-md text-left transition-colors",
                "hover:bg-muted/50 focus:bg-muted/50 focus:outline-none",
                value === option.id && "bg-muted"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 transition-colors",
                  value === option.id ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {option.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div
                  className={cn(
                    "text-sm font-medium transition-colors",
                    value === option.id ? "text-foreground" : "text-foreground/80"
                  )}
                >
                  {option.label}
                </div>
                <div className="text-xs text-muted-foreground leading-tight mt-0.5">
                  {option.description}
                </div>
              </div>
              {value === option.id && (
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
              )}
            </button>
          ))}
        </div>

        {onWorkspaceKnowledgeChange && (
          <>
            <Separator className="my-2" />
            <button
              onClick={() => onWorkspaceKnowledgeChange(!useWorkspaceKnowledge)}
              className={cn(
                "w-full flex items-center gap-3 p-2.5 rounded-md text-left transition-colors",
                "hover:bg-muted/50 focus:bg-muted/50 focus:outline-none"
              )}
            >
              <Database
                className={cn(
                  "h-4 w-4",
                  useWorkspaceKnowledge ? "text-foreground" : "text-muted-foreground"
                )}
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground/80">
                  Use workspace knowledge only
                </div>
              </div>
              <div
                className={cn(
                  "h-4 w-7 rounded-full transition-colors relative",
                  useWorkspaceKnowledge ? "bg-primary" : "bg-muted"
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 h-3 w-3 rounded-full bg-background shadow-sm transition-transform",
                    useWorkspaceKnowledge ? "translate-x-3.5" : "translate-x-0.5"
                  )}
                />
              </div>
            </button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

// Badge to show current mode above AI response
interface ModeBadgeProps {
  mode: ResponseMode;
  className?: string;
}

export function ModeBadge({ mode, className }: ModeBadgeProps) {
  if (mode === "auto") return null;

  const labels: Record<ResponseMode, string> = {
    auto: "Auto",
    quick: "Quick answer",
    deep: "Deep dive",
    "step-by-step": "Step-by-step",
    questions: "Questions first",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium",
        "bg-muted/50 text-muted-foreground",
        className
      )}
    >
      {labels[mode]}
    </span>
  );
}
