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
  Paperclip,
  Globe,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { ModeBadge, type ResponseMode } from "./ModeSelector";
import { MarkdownRenderer } from "./MarkdownRenderer";

export interface MessageAttachment {
  id: string;
  type: 'file' | 'image' | 'link';
  name: string;
  preview?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  status: "sending" | "streaming" | "complete" | "error";
  isPinned?: boolean;
  responseMode?: ResponseMode;
  attachments?: MessageAttachment[];
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

  // User message render
  if (isUser) {
    return (
      <div className="flex gap-4 group animate-fade-in justify-end">
        <div className="flex flex-col max-w-[75%] items-end">
          {/* User Message Bubble */}
          <div className="relative rounded-xl px-4 py-3 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-md">
            {/* Subtle glow overlay */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

            {/* Attachments Display */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {message.attachments.map((att) => (
                  <div key={att.id} className="flex items-center gap-1.5">
                    {att.type === 'image' && att.preview ? (
                      <img 
                        src={att.preview} 
                        alt={att.name} 
                        className="max-h-32 rounded-lg object-cover border border-white/20"
                      />
                    ) : att.type === 'link' ? (
                      <a 
                        href={att.preview} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-colors bg-white/20 hover:bg-white/30 text-primary-foreground"
                      >
                        <Globe className="h-3 w-3" />
                        <span className="max-w-[100px] truncate">{att.name}</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs bg-white/20 text-primary-foreground">
                        <Paperclip className="h-3 w-3" />
                        <span className="max-w-[100px] truncate">{att.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="relative text-sm whitespace-pre-wrap leading-relaxed">
              {message.content}
            </div>
          </div>

          {/* Timestamp */}
          <span className="text-[10px] mt-1.5 px-1 font-medium tracking-wide text-muted-foreground/60">
            {message.timestamp}
          </span>

          {/* User Action Toolbar */}
          {message.status === "complete" && (
            <div className="flex items-center gap-0.5 mt-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <TooltipProvider delayDuration={200}>
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
              </TooltipProvider>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center shrink-0 mt-1 ring-1 ring-border/50 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground">You</span>
        </div>
      </div>
    );
  }

  // Assistant message render - clean, no bubble
  return (
    <div className="flex gap-5 group animate-fade-in">
      {/* Assistant Avatar */}
      <div className="relative shrink-0">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background" />
      </div>

      <div className="flex-1 min-w-0 pt-1">
        {/* Mode badge */}
        {message.responseMode && message.responseMode !== "auto" && (
          <ModeBadge mode={message.responseMode} className="mb-2" />
        )}

        {/* Content - Markdown rendered, no bubble */}
        <div className={cn(
          "text-foreground",
          message.status === "streaming" && "streaming-content"
        )}>
          {message.status === "streaming" ? (
            <div className="text-sm">
              <MarkdownRenderer content={message.content} />
              <span className="inline-block w-0.5 h-4 bg-primary animate-pulse ml-0.5 rounded-sm align-middle" />
            </div>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] mt-3 block font-medium tracking-wide text-muted-foreground/50">
          {message.timestamp}
        </span>

        {/* Action Toolbar - hover only, minimal design */}
        {message.status === "complete" && (
          <div 
            className={cn(
              "flex items-center gap-1 mt-2 -ml-1",
              isLastAssistantMessage
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            )}
          >
            <TooltipProvider delayDuration={200}>
              {/* Copy */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    onClick={handleCopy}
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">{copied ? "Copied!" : "Copy"}</TooltipContent>
              </Tooltip>

              {/* Thumbs Up */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-lg",
                      reaction === "up" 
                        ? "text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    )}
                    onClick={() => handleReaction("up")}
                  >
                    <ThumbsUp className={cn("h-4 w-4", reaction === "up" && "fill-current")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">Good response</TooltipContent>
              </Tooltip>

              {/* Thumbs Down */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-lg",
                      reaction === "down" 
                        ? "text-rose-500 bg-rose-500/10 hover:bg-rose-500/20" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    )}
                    onClick={() => handleReaction("down")}
                  >
                    <ThumbsDown className={cn("h-4 w-4", reaction === "down" && "fill-current")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">Bad response</TooltipContent>
              </Tooltip>

              {/* Regenerate */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    onClick={handleRegenerate}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">Regenerate</TooltipContent>
              </Tooltip>

              {/* Branch */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    onClick={handleBranch}
                  >
                    <GitBranch className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">Branch conversation</TooltipContent>
              </Tooltip>

              {/* Pin */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-lg",
                      message.isPinned 
                        ? "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    )}
                    onClick={handlePin}
                  >
                    <Pin className={cn("h-4 w-4", message.isPinned && "fill-current")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">{message.isPinned ? "Unpin" : "Pin to artifacts"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
}
