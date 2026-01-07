import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { AIModelSelector } from "./AIModelSelector";
import { PromptRefineDropdown } from "./chat/PromptRefineDropdown";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface GlobalCommandBarRef {
  focus: () => void;
}

interface GlobalCommandBarProps {
  className?: string;
  onClose?: () => void;
}

export const GlobalCommandBar = forwardRef<GlobalCommandBarRef, GlobalCommandBarProps>(
  ({ className, onClose }, ref) => {
    const [inputValue, setInputValue] = useState("");
    const [selectedModel, setSelectedModel] = useState("gpt-4");
    const [isAutoMode, setIsAutoMode] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }));

    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    const handleSubmit = () => {
      if (!inputValue.trim()) return;
      const newId = `new-${Date.now()}`;
      const encodedPrompt = encodeURIComponent(inputValue.trim());
      navigate(`/workspace/${newId}/branch/main?prompt=${encodedPrompt}`);
      setInputValue("");
      onClose?.();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    const handleRefinePrompt = (refined: string) => {
      setInputValue(refined);
    };

    const handleRefineAndSend = (refined: string) => {
      const newId = `new-${Date.now()}`;
      const encodedPrompt = encodeURIComponent(refined);
      navigate(`/workspace/${newId}/branch/main?prompt=${encodedPrompt}`);
      setInputValue("");
      onClose?.();
    };

    return (
      <TooltipProvider>
        <div
          className={cn(
            "flex items-center gap-2 rounded-full border bg-card/95 backdrop-blur-sm px-1.5 py-1 transition-all duration-200",
            "border-border/60 hover:border-accent/40 focus-within:border-accent/60 focus-within:shadow-sm",
            className
          )}
        >
          {/* Left: AI Model Selector */}
          <AIModelSelector
            value={selectedModel}
            isAuto={isAutoMode}
            onValueChange={setSelectedModel}
            onAutoChange={setIsAutoMode}
          />

          {/* Attachment */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center",
                  "text-muted-foreground hover:text-foreground hover:bg-secondary/80",
                  "transition-colors focus:outline-none"
                )}
              >
                <Paperclip className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Attach files</p>
            </TooltipContent>
          </Tooltip>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What would you like to think about?"
            className={cn(
              "flex-1 min-w-0 bg-transparent text-foreground text-sm",
              "placeholder:text-muted-foreground/60 focus:outline-none"
            )}
          />

          {/* Right Side Actions */}
          <div className="flex items-center gap-0.5">
            {/* Refine Prompt */}
            <PromptRefineDropdown
              prompt={inputValue}
              onRefine={handleRefinePrompt}
              onSend={handleRefineAndSend}
              disabled={!inputValue.trim()}
            />

            {/* Send Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleSubmit}
                  disabled={!inputValue.trim()}
                  className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center",
                    "transition-colors focus:outline-none",
                    inputValue.trim()
                      ? "bg-accent text-accent-foreground hover:bg-accent/90"
                      : "bg-secondary text-muted-foreground/50"
                  )}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Send message</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    );
  }
);

GlobalCommandBar.displayName = "GlobalCommandBar";
