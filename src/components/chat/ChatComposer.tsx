import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { ArrowUp, Square, X, Globe, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PromptRefineDropdown } from "./PromptRefineDropdown";
import { ModeSelector, type ResponseMode } from "./ModeSelector";
import { AttachmentDropdown } from "@/components/AttachmentDropdown";
import { AIModelSelector } from "@/components/AIModelSelector";

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
  ({ value, onChange, onSend, onStop, isStreaming = false, placeholder = "Ask anything...", disabled = false }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const [responseMode, setResponseMode] = useState<ResponseMode>("auto");
    const [selectedModel, setSelectedModel] = useState("gpt-4");
    const [isAutoMode, setIsAutoMode] = useState(true);
    const [webSearchEnabled, setWebSearchEnabled] = useState(false);

    useImperativeHandle(ref, () => ({
      focus: () => textareaRef.current?.focus(),
    }));

    // Auto-resize textarea
    useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        const newHeight = Math.min(textarea.scrollHeight, 160);
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

    const handleUploadPhoto = () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files) {
          const newFiles: AttachedFile[] = Array.from(files).map((file) => ({
            id: `${Date.now()}-${file.name}`,
            name: file.name,
            size: file.size,
          }));
          setAttachedFiles((prev) => [...prev, ...newFiles]);
        }
      };
      input.click();
    };

    const handleUploadFile = () => {
      const input = document.createElement("input");
      input.type = "file";
      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files) {
          const newFiles: AttachedFile[] = Array.from(files).map((file) => ({
            id: `${Date.now()}-${file.name}`,
            name: file.name,
            size: file.size,
          }));
          setAttachedFiles((prev) => [...prev, ...newFiles]);
        }
      };
      input.click();
    };

    const canSend = value.trim().length > 0 && !isStreaming && !disabled;

    return (
      <TooltipProvider>
        <div className="w-full">
          {/* Main Composer Container */}
          <div 
            className={cn(
              "rounded-2xl border bg-card/80 backdrop-blur-sm transition-all duration-200",
              isFocused 
                ? "border-accent/60 shadow-lg shadow-accent/5" 
                : "border-border/60 hover:border-border"
            )}
          >
            {/* Attached Files */}
            {attachedFiles.length > 0 && (
              <div className="px-4 pt-3 pb-1 flex flex-wrap gap-1.5">
                {attachedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-1.5 bg-secondary/50 rounded-lg px-2 py-1 text-xs group/file"
                  >
                    <span className="text-foreground max-w-[100px] truncate">{file.name}</span>
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
            <div className="p-4 pb-2">
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
                  "w-full resize-none bg-transparent text-foreground",
                  "placeholder:text-muted-foreground/60 focus:outline-none",
                  "text-sm leading-relaxed min-h-[24px] max-h-[120px]",
                  "disabled:opacity-50"
                )}
              />
            </div>

            {/* Toolbar Row */}
            <div className="flex items-center justify-between px-3 py-2 border-t border-border/30">
              {/* Left Side */}
              <div className="flex items-center gap-1.5">
                <AttachmentDropdown
                  onUploadPhoto={handleUploadPhoto}
                  onUploadFile={handleUploadFile}
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
                  prompt={value}
                  onRefine={handleRefine}
                  onSend={handleRefineSend}
                  disabled={!value.trim() || disabled || isStreaming}
                />

                {/* Mode Selector */}
                <ModeSelector
                  value={responseMode}
                  onChange={setResponseMode}
                  disabled={disabled || isStreaming}
                />

                {/* Web Search Toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                      disabled={disabled || isStreaming}
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center",
                        "transition-colors focus:outline-none disabled:opacity-50",
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
                      disabled={disabled || isStreaming}
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center",
                        "text-muted-foreground hover:text-foreground hover:bg-secondary/80",
                        "transition-colors focus:outline-none disabled:opacity-50"
                      )}
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Voice input</p>
                  </TooltipContent>
                </Tooltip>

                {/* Send / Stop Button */}
                {isStreaming ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={onStop}
                        className="h-8 w-8 rounded-full flex items-center justify-center ml-1 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                      >
                        <Square className="h-3.5 w-3.5 fill-current" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Stop generating</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <button
                    onClick={() => onSend(value, responseMode)}
                    disabled={!canSend}
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center ml-1",
                      "transition-colors focus:outline-none",
                      canSend
                        ? "bg-accent text-accent-foreground hover:bg-accent/90"
                        : "bg-secondary text-muted-foreground/50"
                    )}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </TooltipProvider>
    );
  }
);

ChatComposer.displayName = "ChatComposer";
