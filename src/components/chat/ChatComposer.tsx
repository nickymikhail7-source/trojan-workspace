import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { ArrowUp, Square, X, Globe, Mic, Plus, Sparkles, Bot, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PromptRefineDropdown } from "./PromptRefineDropdown";
import { ModeSelector, type ResponseMode } from "./ModeSelector";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

// Model options (UI only)
const modelOptions = [
  { id: "gpt-4.1", name: "GPT-4.1", provider: "OpenAI" },
  { id: "claude-3.5", name: "Claude 3.5", provider: "Anthropic" },
  { id: "gemini-2.5", name: "Gemini 2.5", provider: "Google" },
];

export const ChatComposer = forwardRef<ChatComposerRef, ChatComposerProps>(
  ({ value, onChange, onSend, onStop, isStreaming = false, placeholder = "Ask anything...", disabled = false }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const [responseMode, setResponseMode] = useState<ResponseMode>("auto");
    const [selectedModel, setSelectedModel] = useState("gpt-4.1");
    const [isAutoModel, setIsAutoModel] = useState(true);
    const [webSearchEnabled, setWebSearchEnabled] = useState(false);
    const [isModelOpen, setIsModelOpen] = useState(false);

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

    const handleUploadClick = () => {
      fileInputRef.current?.click();
    };

    const canSend = value.trim().length > 0 && !isStreaming && !disabled;
    const displayModel = isAutoModel ? `Auto · ${selectedModel.toUpperCase()}` : modelOptions.find(m => m.id === selectedModel)?.name || selectedModel;

    return (
      <TooltipProvider>
        <div className="w-full">
          {/* Main Composer Container */}
          <div 
            className={cn(
              "rounded-2xl border bg-card/80 backdrop-blur-sm transition-all duration-200",
              isFocused 
                ? "border-primary/40 shadow-lg shadow-primary/5" 
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

            {/* Single Toolbar Row */}
            <div className="flex items-center justify-between px-3 py-2 border-t border-border/30">
              {/* Left Side: Attach + Refine + Model */}
              <div className="flex items-center gap-1">
                {/* Attach Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleUploadClick}
                      disabled={disabled || isStreaming}
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center",
                        "text-muted-foreground hover:text-foreground hover:bg-secondary/80",
                        "transition-colors focus:outline-none disabled:opacity-50"
                      )}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Attach files</TooltipContent>
                </Tooltip>

                {/* Prompt Refiner */}
                <PromptRefineDropdown
                  prompt={value}
                  onRefine={handleRefine}
                  onSend={handleRefineSend}
                  disabled={!value.trim() || disabled || isStreaming}
                />

                {/* Model Identifier Pill */}
                <Popover open={isModelOpen} onOpenChange={setIsModelOpen}>
                  <PopoverTrigger asChild>
                    <button
                      disabled={disabled || isStreaming}
                      className={cn(
                        "h-7 px-2.5 rounded-full flex items-center gap-1.5",
                        "bg-muted/60 hover:bg-muted",
                        "text-xs font-medium text-muted-foreground hover:text-foreground",
                        "border border-transparent hover:border-border",
                        "transition-all duration-200 disabled:opacity-50"
                      )}
                    >
                      <Bot className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{displayModel}</span>
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-64 p-2" sideOffset={8}>
                    <div className="mb-2 px-2">
                      <h4 className="text-xs font-medium text-foreground">Model</h4>
                    </div>
                    
                    {/* Auto Option */}
                    <button
                      onClick={() => {
                        setIsAutoModel(true);
                        setIsModelOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 p-2.5 rounded-md text-left transition-colors",
                        "hover:bg-muted/50 focus:bg-muted/50 focus:outline-none",
                        isAutoModel && "bg-muted"
                      )}
                    >
                      <Sparkles className={cn("h-4 w-4", isAutoModel ? "text-primary" : "text-muted-foreground")} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">Auto (recommended)</div>
                        <div className="text-xs text-muted-foreground">Best model for each task</div>
                      </div>
                      {isAutoModel && <div className="h-2 w-2 rounded-full bg-primary" />}
                    </button>

                    <div className="my-2 border-t border-border" />

                    {/* Model Options */}
                    {modelOptions.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model.id);
                          setIsAutoModel(false);
                          setIsModelOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 p-2.5 rounded-md text-left transition-colors",
                          "hover:bg-muted/50 focus:bg-muted/50 focus:outline-none",
                          !isAutoModel && selectedModel === model.id && "bg-muted"
                        )}
                      >
                        <Bot className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{model.name}</span>
                            <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 bg-secondary rounded">
                              {model.provider}
                            </span>
                          </div>
                        </div>
                        {!isAutoModel && selectedModel === model.id && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </button>
                    ))}
                  </PopoverContent>
                </Popover>
              </div>

              {/* Right Side: Mode + Web + Voice + Send */}
              <div className="flex items-center gap-0.5">
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
                          ? "text-primary bg-primary/10"
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
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
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