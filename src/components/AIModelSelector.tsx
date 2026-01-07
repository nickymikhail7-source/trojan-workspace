import { useState } from "react";
import { Bot, Check, ChevronDown, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
}

const models: AIModel[] = [
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
    description: "Most capable, best for complex tasks",
  },
  {
    id: "claude-3.5",
    name: "Claude 3.5",
    provider: "Anthropic",
    description: "Great for analysis and writing",
  },
  {
    id: "gemini-2.5",
    name: "Gemini 2.5",
    provider: "Google",
    description: "Fast, multimodal capabilities",
  },
];

interface AIModelSelectorProps {
  value: string;
  isAuto: boolean;
  onValueChange: (value: string) => void;
  onAutoChange: (isAuto: boolean) => void;
  disabled?: boolean;
}

export function AIModelSelector({
  value,
  isAuto,
  onValueChange,
  onAutoChange,
  disabled,
}: AIModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedModel = models.find((m) => m.id === value);
  const filteredModels = models.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          className={cn(
            "h-7 px-2.5 rounded-md flex items-center gap-1.5",
            "bg-secondary/60 hover:bg-secondary",
            "text-xs text-muted-foreground hover:text-foreground",
            "transition-colors focus:outline-none",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <Bot className="h-3.5 w-3.5" />
          <span>{isAuto ? "Auto" : selectedModel?.name || "Auto"}</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-0">
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full h-8 pl-8 pr-3 rounded-md",
                "bg-secondary/50 text-sm",
                "placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-1 focus:ring-accent"
              )}
            />
          </div>
        </div>

        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium">Auto</span>
              <p className="text-xs text-muted-foreground mt-0.5">
                Balanced quality and speed
              </p>
            </div>
            <Switch
              checked={isAuto}
              onCheckedChange={onAutoChange}
              className="ml-3"
            />
          </div>
        </div>

        {!isAuto && (
          <div className="p-2 max-h-48 overflow-y-auto">
            {filteredModels.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onValueChange(model.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-start gap-3 p-2 rounded-md",
                  "hover:bg-secondary/80 transition-colors text-left",
                  value === model.id && "bg-secondary"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{model.name}</span>
                    <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 bg-secondary rounded">
                      {model.provider}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {model.description}
                  </p>
                </div>
                {value === model.id && (
                  <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                )}
              </button>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
