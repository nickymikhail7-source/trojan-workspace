import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Target, Bug, PenTool, Search, ArrowUp, Paperclip, Globe, LayoutTemplate, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrojanLogo } from "./TrojanLogo";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ConversationalEntryProps {
  userName?: string;
}

const quickActions = [
  {
    id: "gtm",
    icon: Target,
    label: "Plan strategy",
    prompt: "Help me plan a go-to-market strategy for my product.",
  },
  {
    id: "debug",
    icon: Bug,
    label: "Debug issue",
    prompt: "I need help debugging an issue in my application.",
  },
  {
    id: "write",
    icon: PenTool,
    label: "Write content",
    prompt: "Help me write professional content.",
  },
  {
    id: "research",
    icon: Search,
    label: "Research",
    prompt: "Help me research and analyze a topic in depth.",
  },
];

const toolbarActions = [
  { id: "attach", icon: Paperclip, tooltip: "Attach file" },
  { id: "web", icon: Globe, tooltip: "Search web" },
  { id: "templates", icon: LayoutTemplate, tooltip: "Templates" },
];

export function ConversationalEntry({ userName }: ConversationalEntryProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 160)}px`;
    }
  }, [inputValue]);

  const handleCreateWorkspace = (prompt: string) => {
    const newId = `new-${Date.now()}`;
    const encodedPrompt = encodeURIComponent(prompt);
    navigate(`/workspace/${newId}/branch/main?prompt=${encodedPrompt}`);
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    handleCreateWorkspace(action.prompt);
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    handleCreateWorkspace(inputValue.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl animate-fade-up">
        {/* Trojan Logo */}
        <div className="flex justify-center mb-6">
          <TrojanLogo size="lg" showText={false} />
        </div>

        {/* Single Bold Headline */}
        <h1 className="text-2xl font-semibold text-foreground text-center mb-8">
          What are we thinking about?
        </h1>

        {/* Two-Row Input Box */}
        <div
          className={cn(
            "rounded-2xl border bg-card transition-all duration-200 shadow-sm",
            isFocused
              ? "border-accent/60 shadow-md"
              : "border-border hover:border-border/80"
          )}
        >
          {/* Textarea Section */}
          <div className="p-4 pb-0">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Message Trojan..."
              rows={2}
              className={cn(
                "w-full resize-none bg-transparent text-foreground",
                "placeholder:text-muted-foreground/60 focus:outline-none",
                "text-base leading-relaxed min-h-[56px] max-h-[160px]"
              )}
            />
          </div>

          {/* Toolbar Section */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
            {/* Left: Tool Icons */}
            <div className="flex items-center gap-1">
              {toolbarActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Tooltip key={action.id}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        <Icon className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      {action.tooltip}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            {/* Right: Send Button */}
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200",
                inputValue.trim()
                  ? "bg-foreground text-background hover:bg-foreground/90 shadow-sm"
                  : "bg-secondary text-muted-foreground/50"
              )}
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Bordered Pill Quick Actions */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-border/80 transition-colors"
              >
                <Icon className="h-4 w-4" />
                <span>{action.label}</span>
              </button>
            );
          })}
          <button
            className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-border/80 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
