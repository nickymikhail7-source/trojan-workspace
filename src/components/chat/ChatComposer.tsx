import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Send, Square, Paperclip, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PromptRefineDropdown } from "./PromptRefineDropdown";
import { ModeSelector, type ResponseMode } from "./ModeSelector";

interface AttachedFile {
  id: string;
  name: string;
  size: number;
}

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (value?: string, mode?: ResponseMode) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export interface ChatComposerRef {
  focus: () => void;
}

export const ChatComposer = forwardRef<ChatComposerRef, ChatComposerProps>(
  ({ value, onChange, onSend, onStop, isStreaming = false, placeholder = "Type a message...", disabled = false }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const [responseMode, setResponseMode] = useState<ResponseMode>("auto");
    const [useWorkspaceKnowledge, setUseWorkspaceKnowledge] = useState(false);

    useImperativeHandle(ref, () => ({
      focus: () => textareaRef.current?.focus(),
    }));

    // Auto-resize textarea
    useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        const newHeight = Math.min(textarea.scrollHeight, 160); // max ~6 rows
        textarea.style.height = `${newHeight}px`;
      }
    }, [value]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (value.trim() && !isStreaming) {
          onSend(value, responseMode);
        }
      }
    };

    const handleAttachClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        const newFiles: AttachedFile[] = Array.from(files).map((file) => ({
          id: `${Date.now()}-${file.name}`,
          name: file.name,
          size: file.size,
        }));
        setAttachedFiles((prev) => [...prev, ...newFiles]);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const removeFile = (fileId: string) => {
      setAttachedFiles((prev) => prev.filter((f) => f.id !== fileId));
    };

    const handleRefine = (refinedPrompt: string) => {
      onChange(refinedPrompt);
    };

    const handleRefineSend = (refinedPrompt: string) => {
      onChange(refinedPrompt);
      onSend(refinedPrompt, responseMode);
    };

    const canSend = value.trim().length > 0 && !isStreaming && !disabled;

    return (
      <div className="w-full">
        {/* Main Composer Container */}
        <div 
          className={cn(
            "relative bg-card/80 rounded-xl overflow-hidden transition-all duration-200",
            "border",
            isFocused 
              ? "border-primary/30 shadow-sm" 
              : "border-border/60 hover:border-border"
          )}
        >

          {/* Attached Files */}
          {attachedFiles.length > 0 && (
            <div className="px-3 pt-2 pb-1 border-b border-border/30 flex flex-wrap gap-1.5">
              {attachedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-1.5 bg-secondary/50 rounded-lg px-2 py-1 text-xs group/file"
                >
                  <Paperclip className="h-3 w-3 text-muted-foreground" />
                  <span className="text-foreground max-w-[80px] truncate">{file.name}</span>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="h-4 w-4 rounded-full hover:bg-destructive/20 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Row */}
          <div className="flex items-center gap-1.5 px-2 py-1.5">
            {/* Mode Selector */}
            <ModeSelector
              value={responseMode}
              onChange={setResponseMode}
              useWorkspaceKnowledge={useWorkspaceKnowledge}
              onWorkspaceKnowledgeChange={setUseWorkspaceKnowledge}
              disabled={disabled || isStreaming}
            />

            {/* Attach Button */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    onClick={handleAttachClick}
                    disabled={disabled}
                  >
                    <Paperclip className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Attach files
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Textarea */}
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                disabled={disabled || isStreaming}
                rows={1}
                className={cn(
                  "w-full min-h-[32px] max-h-[100px] resize-none",
                  "bg-transparent text-sm text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none py-1.5 px-1",
                  "disabled:opacity-50"
                )}
              />
            </div>

            {/* Refine Button */}
            <TooltipProvider delayDuration={300}>
              <PromptRefineDropdown
                prompt={value}
                onRefine={handleRefine}
                onSend={handleRefineSend}
                disabled={disabled || isStreaming}
              />
            </TooltipProvider>

            {/* Send / Stop Button */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {isStreaming ? (
                    <Button
                      type="button"
                      size="icon"
                      className="h-7 w-7 shrink-0 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20"
                      onClick={onStop}
                    >
                      <Square className="h-3 w-3 fill-current" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="icon"
                      className={cn(
                        "h-7 w-7 shrink-0 rounded-md transition-colors",
                        canSend
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-secondary text-muted-foreground"
                      )}
                      onClick={() => onSend(value, responseMode)}
                      disabled={!canSend}
                    >
                      <Send className="h-3 w-3" />
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {isStreaming ? "Stop" : "Send"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Helper Text */}
        <div className="flex items-center justify-center gap-1.5 mt-2 text-[10px] text-muted-foreground/70">
          <Sparkles className="h-2.5 w-2.5" />
          <span>AI-powered thinking partner</span>
          <span className="mx-1">•</span>
          <span>
            <kbd className="px-1 py-0.5 rounded bg-secondary/50 text-[9px] font-mono">Enter</kbd> to send
            <span className="mx-1">·</span>
            <kbd className="px-1 py-0.5 rounded bg-secondary/50 text-[9px] font-mono">Shift+Enter</kbd> new line
          </span>
        </div>
      </div>
    );

  }
);

ChatComposer.displayName = "ChatComposer";
