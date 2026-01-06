import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Target, Bug, PenTool, FileText, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversationalEntryProps {
  userName?: string;
  greeting?: string;
  recentWorkspaces?: Array<{ id: string; title: string; lastActive: string; preview?: string }>;
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
    id: "review",
    icon: FileText,
    label: "Review docs",
    prompt: "I'd like you to review and help me improve a document.",
  },
];

export function ConversationalEntry({ 
  userName = "there", 
  greeting = "Hey",
}: ConversationalEntryProps) {
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
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-8">
      <div className="w-full max-w-xl animate-fade-up">
        {/* Minimal Greeting */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-medium text-foreground tracking-tight">
            {greeting}, {userName}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            What would you like to work on?
          </p>
        </div>

        {/* Compact Chat Input */}
        <div
          className={cn(
            "relative rounded-xl border bg-card transition-all duration-200",
            isFocused
              ? "border-accent/60 shadow-sm"
              : "border-border hover:border-border/80"
          )}
        >
          <div className="flex items-end gap-2 p-3">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              rows={1}
              className={cn(
                "flex-1 resize-none bg-transparent text-foreground",
                "placeholder:text-muted-foreground/60 focus:outline-none",
                "text-sm leading-relaxed min-h-[24px] max-h-[120px]"
              )}
            />
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                inputValue.trim()
                  ? "bg-foreground text-background hover:bg-foreground/90"
                  : "bg-secondary text-muted-foreground/50"
              )}
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quick Actions - Compact Pills */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <Icon className="h-3 w-3" />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
