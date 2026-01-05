import { useState, useCallback } from "react";
import { Copy, ThumbsUp, ThumbsDown, Bookmark, Check, Sparkles, Pin, GitBranch, RefreshCw, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { ResponseTransformToolbar, TransformBadge, type TransformType } from "./ResponseTransformToolbar";
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
  onPin?: (messageId: string) => void;
  onBranch?: (messageId: string) => void;
  onRegenerate?: (messageId: string) => void;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onTransform?: (messageId: string, type: TransformType) => void;
  isLastAssistantMessage?: boolean;
}

export function ChatMessage({ 
  message, 
  onPin, 
  onBranch, 
  onRegenerate, 
  onEdit, 
  onDelete, 
  onTransform,
  isLastAssistantMessage 
}: ChatMessageProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [reaction, setReaction] = useState<"up" | "down" | null>(null);
  const [isPinned, setIsPinned] = useState(message.isPinned || false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [currentTransform, setCurrentTransform] = useState<TransformType | null>(null);
  const [showTransformBadge, setShowTransformBadge] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ description: "Copied to clipboard" });
  };

  const handleReaction = (type: "up" | "down") => {
    setReaction(reaction === type ? null : type);
  };

  const handleSaveArtifact = () => {
    toast({
      title: "Saved as artifact",
      description: "This response has been saved to your artifacts.",
    });
  };

  const handlePin = () => {
    setIsPinned(!isPinned);
    onPin?.(message.id);
    toast({
      description: isPinned ? "Message unpinned" : "Message pinned",
    });
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

  const handleEdit = () => {
    onEdit?.(message.id);
  };

  const handleDelete = () => {
    onDelete?.(message.id);
  };

  const handleTransform = useCallback((type: TransformType) => {
    setIsTransforming(true);
    setCurrentTransform(type);
    
    // Simulate transformation
    setTimeout(() => {
      setIsTransforming(false);
      setShowTransformBadge(true);
      onTransform?.(message.id, type);
      
      // Hide badge after 3 seconds
      setTimeout(() => setShowTransformBadge(false), 3000);
    }, 800);
  }, [message.id, onTransform]);

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
        
        {/* Pin indicator */}
        {isPinned && (
          <div className="flex items-center gap-1 text-[10px] text-accent mb-1 px-1">
            <Pin className="h-2.5 w-2.5 fill-current" />
            <span className="font-medium">Pinned</span>
          </div>
        )}

        {/* Transform Badge */}
        {!isUser && (
          <TransformBadge type={currentTransform} visible={showTransformBadge} />
        )}

        {/* Message Bubble */}
        <div
          className={cn(
            "relative rounded-2xl px-4 py-3 transition-all duration-200",
            isUser
              ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
              : "bg-card border border-border/80 text-foreground shadow-card hover:shadow-lg hover:border-border",
            isPinned && !isUser && "ring-2 ring-accent/30 border-accent/40",
            message.status === "streaming" && !isUser && "streaming-glow",
            isTransforming && "opacity-70"
          )}
        >
          {/* Subtle glow for user messages */}
          {isUser && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          )}
          
          {/* Loading overlay for transforms */}
          {isTransforming && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-2xl">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Transforming...</span>
              </div>
            </div>
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

        {/* Response Transform Toolbar (Assistant only, on hover or always for last message) */}
        {!isUser && message.status === "complete" && (
          <div className="mt-2">
            <ResponseTransformToolbar
              onTransform={handleTransform}
              isTransforming={isTransforming}
              currentTransform={currentTransform}
              alwaysVisible={isLastAssistantMessage}
            />
          </div>
        )}

        {/* Message Actions */}
        {message.status === "complete" && (
          <div 
            className={cn(
              "flex items-center gap-0.5 mt-2 p-1 rounded-lg bg-secondary/50 backdrop-blur-sm border border-border/50",
              "opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
            )}
          >
            <TooltipProvider delayDuration={200}>
              {/* Copy */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-background"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {copied ? "Copied!" : "Copy"}
                </TooltipContent>
              </Tooltip>

              {/* Pin */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-7 w-7 rounded-md",
                      isPinned
                        ? "text-accent hover:text-accent/80"
                        : "text-muted-foreground hover:text-foreground hover:bg-background"
                    )}
                    onClick={handlePin}
                  >
                    <Pin className={cn("h-3.5 w-3.5", isPinned && "fill-current")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {isPinned ? "Unpin" : "Pin message"}
                </TooltipContent>
              </Tooltip>

              {/* Branch (assistant only) */}
              {!isUser && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-background"
                      onClick={handleBranch}
                    >
                      <GitBranch className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    Branch conversation
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Regenerate (last assistant message only) */}
              {!isUser && isLastAssistantMessage && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-background"
                      onClick={handleRegenerate}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    Regenerate response
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Edit (user only) */}
              {isUser && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-background"
                      onClick={handleEdit}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    Edit message
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Delete (user only) */}
              {isUser && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    Delete message
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Thumbs Up (assistant only) */}
              {!isUser && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-7 w-7 rounded-md",
                        reaction === "up"
                          ? "text-green-500 hover:text-green-600 bg-green-500/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-background"
                      )}
                      onClick={() => handleReaction("up")}
                    >
                      <ThumbsUp className={cn("h-3.5 w-3.5", reaction === "up" && "fill-current")} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    Good response
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Thumbs Down (assistant only) */}
              {!isUser && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-7 w-7 rounded-md",
                        reaction === "down"
                          ? "text-destructive hover:text-destructive/80 bg-destructive/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-background"
                      )}
                      onClick={() => handleReaction("down")}
                    >
                      <ThumbsDown className={cn("h-3.5 w-3.5", reaction === "down" && "fill-current")} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    Bad response
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Save as Artifact (assistant only) */}
              {!isUser && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-background"
                      onClick={handleSaveArtifact}
                    >
                      <Bookmark className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    Save as artifact
                  </TooltipContent>
                </Tooltip>
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
