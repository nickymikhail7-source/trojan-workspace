import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Target, 
  Bug, 
  PenTool, 
  FileText, 
  ArrowUp,
  Sparkles,
  Paperclip
} from "lucide-react";
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
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl animate-fade-up">
        {/* Greeting */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 mb-4">
            <Sparkles className="h-6 w-6 text-accent" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
            {greeting}, {userName}
          </h1>
          <p className="text-muted-foreground mt-1">
            What would you like to work on?
          </p>
        </div>

        {/* Enhanced Chat Input */}
        <div
          className={cn(
            "relative rounded-2xl border-2 bg-card transition-all duration-300",
            isFocused
              ? "border-accent shadow-xl shadow-accent/10"
              : "border-border/60 shadow-lg shadow-black/5 hover:border-border"
          )}
        >
          {/* Input Area */}
          <div className="p-4 pb-14">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              rows={2}
              className={cn(
                "w-full resize-none bg-transparent text-foreground",
                "placeholder:text-muted-foreground focus:outline-none",
                "text-base sm:text-lg leading-relaxed"
              )}
            />
          </div>
          
          {/* Bottom Bar */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 border-t border-border/50">
            {/* Attachment Button */}
            <button
              type="button"
              className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            
            {/* Send Button */}
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              className={cn(
                "h-9 px-4 rounded-xl flex items-center gap-2 font-medium text-sm transition-all duration-200",
                inputValue.trim()
                  ? "bg-accent text-accent-foreground hover:bg-accent/90 shadow-md shadow-accent/20"
                  : "bg-secondary text-muted-foreground cursor-not-allowed"
              )}
            >
              <span>Send</span>
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quick Actions - Compact Pills Below */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground mr-1">Try:</span>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card hover:bg-secondary hover:border-accent/30 text-sm text-muted-foreground hover:text-foreground transition-all duration-150"
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
