import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Target, Bug, PenTool, FileText, ArrowUp, Sparkles, Zap, Globe, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { AttachmentDropdown } from "./AttachmentDropdown";
import { AIModelSelector } from "./AIModelSelector";
import { ModeSelector, type ResponseMode } from "./chat/ModeSelector";
import { PromptRefineDropdown } from "./chat/PromptRefineDropdown";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

export function ConversationalEntry() {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [responseMode, setResponseMode] = useState<ResponseMode>("auto");
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
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

  const handleRefinePrompt = (refined: string) => {
    setInputValue(refined);
  };

  const handleRefineAndSend = (refined: string) => {
    handleCreateWorkspace(refined);
  };

  return (
    <TooltipProvider>
      <div className="min-h-full flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl animate-fade-up">
          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
              What's on your mind today?
            </h1>
          </div>

          {/* Chatbox Container */}
          <div
            className={cn(
              "relative rounded-2xl border backdrop-blur-sm transition-all duration-300 overflow-hidden",
              "bg-gradient-to-b from-card via-card to-secondary/20",
              isFocused
                ? "border-primary/40 shadow-xl shadow-primary/10 ring-2 ring-primary/20"
                : "border-border/50 hover:border-border hover:shadow-lg hover:shadow-primary/5"
            )}
          >
            {/* Subtle gradient overlay */}
            <div 
              className={cn(
                "absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-300 pointer-events-none",
                isFocused && "opacity-100"
              )} 
            />
            
            {/* Input Row */}
            <div className="relative p-4 pb-2">
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
                  "w-full resize-none bg-transparent text-foreground",
                  "placeholder:text-muted-foreground/50 focus:outline-none",
                  "text-sm leading-relaxed min-h-[24px] max-h-[120px]",
                  "transition-colors duration-200"
                )}
              />
            </div>

            {/* Toolbar Row */}
            <div className="relative flex items-center justify-between px-3 py-2 border-t border-border/30">
              {/* Left Side */}
              <div className="flex items-center gap-1.5">
                <AttachmentDropdown
                  onUploadPhoto={() => console.log("Upload photo")}
                  onUploadFile={() => console.log("Upload file")}
                  onTakeScreenshot={() => console.log("Take screenshot")}
                />
                <AIModelSelector
                  value={selectedModel}
                  isAuto={isAutoMode}
                  onValueChange={setSelectedModel}
                  onAutoChange={setIsAutoMode}
                />
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-0.5">
                {/* Refine Prompt */}
                <PromptRefineDropdown
                  prompt={inputValue}
                  onRefine={handleRefinePrompt}
                  onSend={handleRefineAndSend}
                  disabled={!inputValue.trim()}
                />

                {/* Mode Selector */}
                <ModeSelector
                  value={responseMode}
                  onChange={setResponseMode}
                />

                {/* Web Search Toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center",
                        "transition-colors focus:outline-none",
                        webSearchEnabled
                          ? "text-accent bg-accent/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                      )}
                    >
                      <Globe className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>{webSearchEnabled ? "Disable" : "Enable"} web search</p>
                  </TooltipContent>
                </Tooltip>

                {/* Voice Input */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center",
                        "text-muted-foreground hover:text-foreground hover:bg-secondary/80",
                        "transition-colors focus:outline-none"
                      )}
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Voice input</p>
                  </TooltipContent>
                </Tooltip>

                {/* Send Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!inputValue.trim()}
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center ml-1",
                    "transition-colors focus:outline-none",
                    inputValue.trim()
                      ? "bg-accent text-accent-foreground hover:bg-accent/90"
                      : "bg-secondary text-muted-foreground/50"
                  )}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] text-muted-foreground/80 hover:text-foreground hover:bg-secondary/60 transition-colors"
                >
                  <Icon className="h-3 w-3" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
