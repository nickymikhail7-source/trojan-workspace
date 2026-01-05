import * as React from "react";
import {
  Minimize2,
  FileText,
  ListChecks,
  Mail,
  RefreshCw,
  MoreHorizontal,
  Palette,
  Users,
  MessageCircleQuestion,
  HelpCircle,
  GitCompare,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TransformType =
  | "shorten"
  | "summarize"
  | "extract-actions"
  | "email"
  | "rework"
  | "change-tone"
  | "change-audience"
  | "follow-up"
  | "explain-assumptions"
  | "compare-alternatives";

interface TransformAction {
  id: TransformType;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

const primaryActions: TransformAction[] = [
  { id: "shorten", label: "Shorten", icon: <Minimize2 className="h-4 w-4" /> },
  { id: "summarize", label: "Summarize", icon: <FileText className="h-4 w-4" /> },
  { id: "extract-actions", label: "Extract action items", icon: <ListChecks className="h-4 w-4" /> },
  { id: "email", label: "Turn into an email", icon: <Mail className="h-4 w-4" /> },
  { id: "rework", label: "Rework", icon: <RefreshCw className="h-4 w-4" /> },
];

const moreActions: TransformAction[] = [
  { id: "change-tone", label: "Change tone", icon: <Palette className="h-4 w-4" />, description: "Adjust formality or style" },
  { id: "change-audience", label: "Change audience", icon: <Users className="h-4 w-4" />, description: "Adapt for different readers" },
  { id: "follow-up", label: "Ask follow-up questions", icon: <MessageCircleQuestion className="h-4 w-4" />, description: "Get clarification" },
  { id: "explain-assumptions", label: "Explain assumptions", icon: <HelpCircle className="h-4 w-4" />, description: "Surface underlying logic" },
  { id: "compare-alternatives", label: "Compare alternatives", icon: <GitCompare className="h-4 w-4" />, description: "Show other approaches" },
];

interface ResponseTransformToolbarProps {
  onTransform: (type: TransformType) => void;
  isTransforming?: boolean;
  currentTransform?: TransformType | null;
  className?: string;
  alwaysVisible?: boolean;
}

export function ResponseTransformToolbar({
  onTransform,
  isTransforming,
  currentTransform,
  className,
  alwaysVisible,
}: ResponseTransformToolbarProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 p-1 rounded-lg bg-background/95 border border-border shadow-sm backdrop-blur-sm transition-opacity duration-200",
        !alwaysVisible && "opacity-0 group-hover:opacity-100",
        className
      )}
    >
      {primaryActions.map((action) => (
        <Tooltip key={action.id}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
                currentTransform === action.id && "bg-muted text-foreground"
              )}
              onClick={() => onTransform(action.id)}
              disabled={isTransforming}
            >
              {action.icon}
              <span className="sr-only">{action.label}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            {action.label}
          </TooltipContent>
        </Tooltip>
      ))}

      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                disabled={isTransforming}
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            More options
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="w-56">
          {moreActions.map((action, index) => (
            <React.Fragment key={action.id}>
              <DropdownMenuItem
                onClick={() => onTransform(action.id)}
                className="flex items-start gap-3 p-2.5 cursor-pointer"
              >
                <span className="text-muted-foreground mt-0.5">{action.icon}</span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{action.label}</span>
                  {action.description && (
                    <span className="text-xs text-muted-foreground">
                      {action.description}
                    </span>
                  )}
                </div>
              </DropdownMenuItem>
              {index === 1 && <DropdownMenuSeparator />}
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Transform badge that appears briefly after transformation
interface TransformBadgeProps {
  type: TransformType | null;
  visible: boolean;
}

export function TransformBadge({ type, visible }: TransformBadgeProps) {
  const labels: Record<TransformType, string> = {
    shorten: "Shortened",
    summarize: "Summarized",
    "extract-actions": "Actions extracted",
    email: "Converted to email",
    rework: "Reworked",
    "change-tone": "Tone adjusted",
    "change-audience": "Audience adapted",
    "follow-up": "Follow-up added",
    "explain-assumptions": "Assumptions explained",
    "compare-alternatives": "Alternatives shown",
  };

  if (!type || !visible) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}
    >
      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
      {labels[type]}
    </div>
  );
}
