import { useState } from "react";
import { 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  Check, 
  Sparkles, 
  Pencil, 
  GitBranch, 
  RefreshCw,
  Pin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { ModeBadge, type ResponseMode } from "./ModeSelector";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  status: "sending" | "streaming" | "complete" | "error";
  isPinned?: boolean;
  responseMode?: ResponseMode;
}

interface ChatMessageProps {
  message: Message;
  onEdit?: (messageId: string) => void;
  onPin?: (messageId: string) => void;
  onBranch?: (messageId: string) => void;
  onRegenerate?: (messageId: string) => void;
  isLastAssistantMessage?: boolean;
}

export function ChatMessage({ 
  message, 
  onEdit, 
  onPin,
  onBranch, 
  onRegenerate, 
  isLastAssistantMessage 
}: ChatMessageProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [reaction, setReaction] = useState<"up" | "down" | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ description: "Copied to clipboard" });
  };

  const handleReaction = (type: "up" | "down") => {
    setReaction(reaction === type ? null : type);
  };

  const handleEdit = () => {
    onEdit?.(message.id);
  };

  const handlePin = () => {
    onPin?.(message.id);
  };

  const handleBranch = () => {
    onBranch?.(message.id);
    toast({
      title: "New branch created",
      description: "A new conversation branch has been started from this message.",
    });
  };

  const handleRegenerate = () => {
    onRegenerate?.(message.id);
  };

  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-4 group animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="relative shrink-0 mt-1">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-accent/20 via-primary/15 to-primary/5 flex items-center justify-center ring-1 ring-primary/10 shadow-sm">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
        </div>
      )}

      <div className={cn("flex flex-col max-w-[75%]", isUser ? "items-end" : "items-start")}>
        {/* Mode badge for assistant messages */}
        {!isUser && message.responseMode && message.responseMode !== "auto" && (
          <ModeBadge mode={message.responseMode} className="mb-1" />
        )}
        

        {/* Message Bubble */}
        <div
          className={cn(
            "relative rounded-2xl px-4 py-3 transition-all duration-200",
            isUser
              ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
              : "bg-card border border-border/80 text-foreground shadow-card hover:shadow-lg hover:border-border",
            
            message.status === "streaming" && !isUser && "streaming-glow"
          )}
        >
          {/* Pin indicator badge */}
          {message.isPinned && (
            <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center shadow-md">
              <Pin className="h-2.5 w-2.5 text-primary-foreground" />
            </div>
          )}
          
          {/* Subtle glow for user messages */}
          {isUser && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          )}
          
          <div className="relative text-sm whitespace-pre-wrap leading-relaxed">
            {message.status === "streaming" ? (
              <>
                <span className="animate-text-reveal">{message.content}</span>
                <span className="inline-block w-0.5 h-4 bg-accent animate-blink ml-0.5 rounded-sm align-middle" />
              </>
            ) : (
              message.content
            )}
          </div>
        </div>

        {/* Timestamp */}
        <span
          className={cn(
            "text-[10px] mt-1.5 px-1 font-medium tracking-wide",
            isUser ? "text-muted-foreground/60" : "text-muted-foreground/70"
          )}
        >
          {message.timestamp}
        </span>

        {/* Action Toolbar */}
        {message.status === "complete" && (
          <div 
            className={cn(
              "flex items-center gap-0.5 mt-2 p-1 rounded-lg bg-background/95 backdrop-blur-sm border border-border/50 shadow-sm",
              isLastAssistantMessage && !isUser
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
            )}
          >
            <TooltipProvider delayDuration={200}>
              {/* Copy */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    onClick={handleCopy}
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">{copied ? "Copied!" : "Copy"}</TooltipContent>
              </Tooltip>

              {/* User messages: Pin + Edit */}
              {isUser && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-7 w-7 rounded-md",
                          message.isPinned 
                            ? "text-primary hover:text-primary/80 bg-primary/10" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                        onClick={handlePin}
                      >
                        <Pin className={cn("h-3.5 w-3.5", message.isPinned && "fill-current")} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">{message.isPinned ? "Unpin" : "Pin"}</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        onClick={handleEdit}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">Edit</TooltipContent>
                  </Tooltip>
                </>
              )}

              {/* Branch (assistant only) */}
              {!isUser && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      onClick={handleBranch}
                    >
                      <GitBranch className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">Branch</TooltipContent>
                </Tooltip>
              )}

              {/* Regenerate (assistant only) */}
              {!isUser && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      onClick={handleRegenerate}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">Regenerate</TooltipContent>
                </Tooltip>
              )}

              {/* Feedback Section (assistant only) */}
              {!isUser && (
                <>
                  {/* Divider */}
                  <div className="h-4 w-px bg-border mx-0.5" />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-7 w-7 rounded-md",
                          reaction === "up" ? "text-green-500 hover:text-green-600 bg-green-500/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                        onClick={() => handleReaction("up")}
                      >
                        <ThumbsUp className={cn("h-3.5 w-3.5", reaction === "up" && "fill-current")} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">Good</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-7 w-7 rounded-md",
                          reaction === "down" ? "text-destructive hover:text-destructive/80 bg-destructive/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                        onClick={() => handleReaction("down")}
                      >
                        <ThumbsDown className={cn("h-3.5 w-3.5", reaction === "down" && "fill-current")} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">Bad</TooltipContent>
                  </Tooltip>
                </>
              )}
            </TooltipProvider>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center shrink-0 mt-1 ring-1 ring-border/50 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground">You</span>
        </div>
      )}
    </div>
  );
}
