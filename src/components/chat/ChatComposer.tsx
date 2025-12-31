import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Send, Square, Paperclip, X } from "lucide-react";
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
      // Reset input
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
      <div className="w-full">
        <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
          {/* Attached Files */}
          {attachedFiles.length > 0 && (
            <div className="px-4 pt-3 pb-2 border-b border-border/50 flex flex-wrap gap-2">
              {attachedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-1.5 text-xs group"
                >
                  <Paperclip className="h-3 w-3 text-muted-foreground" />
                  <span className="text-foreground max-w-[120px] truncate">{file.name}</span>
                  <span className="text-muted-foreground">{formatFileSize(file.size)}</span>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
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
                    className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
                    onClick={handleAttachClick}
                    disabled={disabled}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Attach files</p>
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
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled || isStreaming}
              rows={1}
              className={cn(
                "flex-1 min-h-[36px] max-h-[160px] resize-none",
                "bg-transparent text-sm text-foreground placeholder:text-muted-foreground",
                "focus:outline-none py-2",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            />

            {/* Send / Stop Button */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {isStreaming ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={onStop}
                    >
                      <Square className="h-4 w-4 fill-current" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="icon"
                      className={cn(
                        "h-9 w-9 shrink-0 transition-all duration-200",
                        canSend
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-secondary text-muted-foreground cursor-not-allowed"
                      )}
                      onClick={onSend}
                      disabled={!canSend}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{isStreaming ? "Stop generating" : "Send message"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Helper Text */}
        <p className="text-[11px] text-muted-foreground text-center mt-2">
          Press <span className="font-medium">Enter</span> to send, <span className="font-medium">Shift+Enter</span> for new line
        </p>
      </div>
    );
  }
);

ChatComposer.displayName = "ChatComposer";
