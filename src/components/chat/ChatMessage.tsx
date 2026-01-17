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
  Zap,
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
          {/* User Message Bubble - Futuristic */}
          <div className="relative rounded-2xl px-4 py-3 bg-gradient-to-br from-primary via-primary to-accent/80 text-primary-foreground shadow-lg shadow-primary/30">
            {/* Animated border glow */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary via-accent to-primary opacity-75 blur-sm -z-10 animate-pulse" />
            
            {/* Glass overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-white/5 pointer-events-none" />

            {/* Attachments Display */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2 relative">
                {message.attachments.map((att) => (
                  <div key={att.id} className="flex items-center gap-1.5">
                    {att.type === 'image' && att.preview ? (
                      <img 
                        src={att.preview} 
                        alt={att.name} 
                        className="max-h-32 rounded-lg object-cover border border-white/30 shadow-lg"
                      />
                    ) : att.type === 'link' ? (
                      <a 
                        href={att.preview} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all bg-white/20 hover:bg-white/30 text-primary-foreground backdrop-blur-sm border border-white/20"
                      >
                        <Globe className="h-3 w-3" />
                        <span className="max-w-[100px] truncate">{att.name}</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-white/20 text-primary-foreground backdrop-blur-sm border border-white/20">
                        <Paperclip className="h-3 w-3" />
                        <span className="max-w-[100px] truncate">{att.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="relative text-sm whitespace-pre-wrap leading-relaxed font-medium">
              {message.content}
            </div>
          </div>

          {/* Timestamp */}
          <span className="text-[10px] mt-2 px-1 font-medium tracking-wider text-muted-foreground/50 uppercase">
            {message.timestamp}
          </span>

          {/* User Action Toolbar */}
          {message.status === "complete" && (
            <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/10"
                      onClick={handleCopy}
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs bg-card/95 backdrop-blur-sm border-border/50">{copied ? "Copied!" : "Copy"}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/10"
                      onClick={handleEdit}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs bg-card/95 backdrop-blur-sm border-border/50">Edit</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>

        {/* User Avatar - Futuristic */}
        <div className="relative h-10 w-10 shrink-0 mt-1">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 blur-md" />
          <div className="relative h-full w-full rounded-xl bg-gradient-to-br from-secondary via-muted to-secondary flex items-center justify-center ring-1 ring-border/50 shadow-lg">
            <span className="text-xs font-bold text-foreground/80 tracking-wide">YOU</span>
          </div>
        </div>
      </div>
    );
  }

  // Assistant message render - Futuristic design
  return (
    <div className="flex gap-5 group animate-fade-in">
      {/* AI Avatar - Futuristic with animated glow */}
      <div className="relative shrink-0">
        {/* Outer glow ring */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500 opacity-60 blur-md animate-pulse" />
        
        {/* Avatar container */}
        <div className="relative h-11 w-11 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-xl shadow-violet-500/40 overflow-hidden">
          {/* Inner shine effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20" />
          
          {/* Animated scan line */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-[scan_2s_ease-in-out_infinite]" />
          
          <Sparkles className="h-5 w-5 text-white drop-shadow-lg relative z-10" />
        </div>
        
        {/* Status indicator with pulse */}
        <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-background shadow-lg shadow-emerald-400/50">
          <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-50" />
        </div>
      </div>

      <div className="flex-1 min-w-0 pt-1">
        {/* AI Label Badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-violet-500/15 to-cyan-500/15 border border-violet-500/20 backdrop-blur-sm">
            <Zap className="h-3 w-3 text-violet-400" />
            <span className="text-[11px] font-semibold text-violet-400 uppercase tracking-wider">AI</span>
          </div>
          
          {message.responseMode && message.responseMode !== "auto" && (
            <ModeBadge mode={message.responseMode} />
          )}
        </div>

        {/* Content Container - Glassmorphism */}
        <div className={cn(
          "relative rounded-2xl p-5",
          "bg-gradient-to-br from-card/80 via-card/60 to-secondary/40",
          "backdrop-blur-xl",
          "border border-border/40",
          "shadow-xl shadow-black/5",
          message.status === "streaming" && "ai-streaming"
        )}>
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-violet-500/30 rounded-tl-2xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyan-500/30 rounded-br-2xl" />
          
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

          {/* Content */}
          <div className="relative text-foreground">
            {message.status === "streaming" ? (
              <div className="text-sm">
                <MarkdownRenderer content={message.content} />
                <span className="inline-flex items-center gap-1 ml-1">
                  <span className="w-1.5 h-4 bg-gradient-to-t from-violet-500 to-cyan-400 rounded-full animate-pulse" />
                </span>
              </div>
            ) : (
              <MarkdownRenderer content={message.content} />
            )}
          </div>
        </div>

        {/* Timestamp */}
        <span className="text-[10px] mt-3 block font-medium tracking-wider text-muted-foreground/40 uppercase">
          {message.timestamp}
        </span>

        {/* Action Toolbar - Futuristic minimal */}
        {message.status === "complete" && (
          <div 
            className={cn(
              "flex items-center gap-0.5 mt-3 p-1 rounded-xl",
              "bg-gradient-to-r from-secondary/50 via-secondary/30 to-secondary/50",
              "backdrop-blur-sm border border-border/30",
              isLastAssistantMessage
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100 transition-all duration-300"
            )}
          >
            <TooltipProvider delayDuration={200}>
              {/* Copy */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-violet-500/10 transition-all"
                    onClick={handleCopy}
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs bg-card/95 backdrop-blur-sm border-violet-500/20">{copied ? "Copied!" : "Copy"}</TooltipContent>
              </Tooltip>

              {/* Thumbs Up */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-lg transition-all",
                      reaction === "up" 
                        ? "text-emerald-400 bg-emerald-500/15 shadow-inner shadow-emerald-500/20" 
                        : "text-muted-foreground hover:text-foreground hover:bg-emerald-500/10"
                    )}
                    onClick={() => handleReaction("up")}
                  >
                    <ThumbsUp className={cn("h-4 w-4", reaction === "up" && "fill-current")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs bg-card/95 backdrop-blur-sm border-border/50">Good response</TooltipContent>
              </Tooltip>

              {/* Thumbs Down */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-lg transition-all",
                      reaction === "down" 
                        ? "text-rose-400 bg-rose-500/15 shadow-inner shadow-rose-500/20" 
                        : "text-muted-foreground hover:text-foreground hover:bg-rose-500/10"
                    )}
                    onClick={() => handleReaction("down")}
                  >
                    <ThumbsDown className={cn("h-4 w-4", reaction === "down" && "fill-current")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs bg-card/95 backdrop-blur-sm border-border/50">Bad response</TooltipContent>
              </Tooltip>

              <div className="w-px h-5 bg-border/50 mx-1" />

              {/* Regenerate */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-cyan-500/10 transition-all"
                    onClick={handleRegenerate}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs bg-card/95 backdrop-blur-sm border-border/50">Regenerate</TooltipContent>
              </Tooltip>

              {/* Branch */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-violet-500/10 transition-all"
                    onClick={handleBranch}
                  >
                    <GitBranch className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs bg-card/95 backdrop-blur-sm border-border/50">Branch conversation</TooltipContent>
              </Tooltip>

              {/* Pin */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-lg transition-all",
                      message.isPinned 
                        ? "text-amber-400 bg-amber-500/15 shadow-inner shadow-amber-500/20" 
                        : "text-muted-foreground hover:text-foreground hover:bg-amber-500/10"
                    )}
                    onClick={handlePin}
                  >
                    <Pin className={cn("h-4 w-4", message.isPinned && "fill-current")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs bg-card/95 backdrop-blur-sm border-border/50">{message.isPinned ? "Unpin" : "Pin to artifacts"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
}
