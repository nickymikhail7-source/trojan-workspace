import * as React from "react";
import { Sparkles, Wand2, ListChecks, Layout, ShieldCheck, Zap, Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { PromptRefineModal } from "./PromptRefineModal";

interface RefineOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const refineOptions: RefineOption[] = [
  {
    id: "clarify",
    label: "Clarify intent",
    description: "Make your request more specific and unambiguous",
    icon: <Wand2 className="h-4 w-4" />,
  },
  {
    id: "context",
    label: "Add missing context",
    description: "Include relevant background information",
    icon: <ListChecks className="h-4 w-4" />,
  },
  {
    id: "structure",
    label: "Make it structured",
    description: "Organize into clear sections or steps",
    icon: <Layout className="h-4 w-4" />,
  },
  {
    id: "constraints",
    label: "Add constraints",
    description: "Define boundaries and limitations",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  {
    id: "optimize",
    label: "Optimize for best outcome",
    description: "Maximize clarity and effectiveness",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    id: "advanced",
    label: "Advanced…",
    description: "Access more refinement options",
    icon: <Settings2 className="h-4 w-4" />,
  },
];

interface PromptRefineDropdownProps {
  prompt: string;
  onRefine: (refinedPrompt: string) => void;
  onSend: (refinedPrompt: string) => void;
  disabled?: boolean;
}

export function PromptRefineDropdown({
  prompt,
  onRefine,
  onSend,
  disabled,
}: PromptRefineDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<RefineOption | null>(null);

  const handleOptionSelect = (option: RefineOption) => {
    setSelectedOption(option);
    setIsOpen(false);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedOption(null);
  };

  const handleReplace = (refinedPrompt: string) => {
    onRefine(refinedPrompt);
    handleModalClose();
  };

  const handleReplaceAndSend = (refinedPrompt: string) => {
    onSend(refinedPrompt);
    handleModalClose();
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                disabled={disabled || !prompt.trim()}
              >
                <Sparkles className="h-4 w-4" />
                <span className="sr-only">Refine prompt</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Refine prompt</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent
          align="end"
          className="w-64 bg-popover border border-border shadow-lg rounded-lg p-1"
        >
          {refineOptions.map((option) => (
            <DropdownMenuItem
              key={option.id}
              onClick={() => handleOptionSelect(option)}
              className="flex items-start gap-3 p-3 cursor-pointer rounded-md hover:bg-muted/50 focus:bg-muted/50 transition-colors group"
            >
              <span className="text-muted-foreground group-hover:text-foreground transition-colors mt-0.5">
                {option.icon}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  {option.label}
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  {option.description}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <PromptRefineModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        originalPrompt={prompt}
        refineType={selectedOption}
        onReplace={handleReplace}
        onReplaceAndSend={handleReplaceAndSend}
      />
    </>
  );
}
