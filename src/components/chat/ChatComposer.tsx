import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Send, Square, Paperclip, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AttachedFile {
  id: string;
  name: string;
  size: number;
}

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
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
          onSend();
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

    const formatFileSize = (bytes: number) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const canSend = value.trim().length > 0 && !isStreaming && !disabled;

    return (
      <div className="w-full animate-fade-in">
        {/* Main Composer Container */}
        <div 
          className={cn(
            "relative bg-card rounded-2xl overflow-hidden transition-all duration-300",
            "border shadow-card",
            isFocused 
              ? "border-primary/40 shadow-lg shadow-primary/5 ring-4 ring-primary/5" 
              : "border-border hover:border-border/80 hover:shadow-lg"
          )}
        >
          {/* Gradient accent line at top */}
          <div className={cn(
            "absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent",
            "opacity-0 transition-opacity duration-300",
            isFocused && "opacity-100"
          )} />

          {/* Attached Files */}
          {attachedFiles.length > 0 && (
            <div className="px-4 pt-3 pb-2 border-b border-border/50 flex flex-wrap gap-2 animate-fade-in">
              {attachedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 bg-secondary/70 hover:bg-secondary rounded-xl px-3 py-2 text-xs group/file transition-colors"
                >
                  <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Paperclip className="h-3 w-3 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-foreground font-medium max-w-[100px] truncate">{file.name}</span>
                    <span className="text-muted-foreground text-[10px]">{formatFileSize(file.size)}</span>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="ml-1 h-5 w-5 rounded-full bg-muted/50 hover:bg-destructive/20 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Row */}
          <div className="flex items-end gap-2 p-3">
            {/* Attach Button */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 shrink-0 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                    onClick={handleAttachClick}
                    disabled={disabled}
                  >
                    <Paperclip className="h-5 w-5" />
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
            <div className="flex-1 relative">
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
                  "w-full min-h-[40px] max-h-[160px] resize-none",
                  "bg-transparent text-sm text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none py-2.5 px-1",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              />
            </div>

            {/* Send / Stop Button */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {isStreaming ? (
                    <Button
                      type="button"
                      size="icon"
                      className="h-10 w-10 shrink-0 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all duration-200"
                      onClick={onStop}
                    >
                      <Square className="h-4 w-4 fill-current" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="icon"
                      className={cn(
                        "h-10 w-10 shrink-0 rounded-xl transition-all duration-200",
                        canSend
                          ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
                          : "bg-secondary text-muted-foreground cursor-not-allowed"
                      )}
                      onClick={onSend}
                      disabled={!canSend}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {isStreaming ? "Stop generating" : "Send message"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Helper Text */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            <span>AI-powered thinking partner</span>
          </div>
          <span className="text-muted-foreground/30">•</span>
          <span className="text-[11px] text-muted-foreground">
            <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[10px] font-mono">Enter</kbd> to send
            <span className="mx-1.5">·</span>
            <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[10px] font-mono">Shift+Enter</kbd> new line
          </span>
        </div>
      </div>
    );
  }
);

ChatComposer.displayName = "ChatComposer";
