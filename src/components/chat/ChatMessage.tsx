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

  const handleEdit = () => onEdit?.(message.id);
  const handlePin = () => onPin?.(message.id);
  const handleBranch = () => {
    onBranch?.(message.id);
    toast({
      title: "New branch created",
      description: "A new conversation branch has been started from this message.",
    });
  };
  const handleRegenerate = () => onRegenerate?.(message.id);

  const isUser = message.role === "user";

  // User message
  if (isUser) {
    return (
      <div className="flex gap-3 group animate-fade-in justify-end">
        <div className="flex flex-col max-w-[70%] items-end">
          <div className="rounded-2xl rounded-br-md px-4 py-2.5 bg-primary text-primary-foreground">
            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {message.attachments.map((att) => (
                  <div key={att.id}>
                    {att.type === 'image' && att.preview ? (
                      <img src={att.preview} alt={att.name} className="max-h-32 rounded-lg object-cover" />
                    ) : att.type === 'link' ? (
                      <a href={att.preview} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs bg-white/20 hover:bg-white/30">
                        <Globe className="h-3 w-3" />
                        <span className="max-w-[100px] truncate">{att.name}</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs bg-white/20">
                        <Paperclip className="h-3 w-3" />
                        <span className="max-w-[100px] truncate">{att.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>
          </div>

          {/* Actions on hover */}
          {message.status === "complete" && (
            <div className="flex items-center gap-0.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={handleCopy}>
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">{copied ? "Copied!" : "Copy"}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={handleEdit}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">Edit</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Assistant message - Clean like ChatGPT/Claude
  return (
    <div className="flex gap-4 group animate-fade-in">
      {/* Simple circular avatar */}
      <div className="h-8 w-8 rounded-full bg-foreground flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles className="h-4 w-4 text-background" />
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        {/* Mode badge if set */}
        {message.responseMode && message.responseMode !== "auto" && (
          <ModeBadge mode={message.responseMode} className="mb-1" />
        )}

        {/* Content - clean, no container */}
        <div className="text-foreground">
          {message.status === "streaming" ? (
            <>
              <MarkdownRenderer content={message.content} />
              <span className="inline-block w-1.5 h-5 bg-foreground/80 rounded-sm ml-0.5 animate-pulse align-middle" />
            </>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>

        {/* Action toolbar */}
        {message.status === "complete" && (
          <div 
            className={cn(
              "flex items-center gap-0.5 pt-1",
              isLastAssistantMessage ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"
            )}
          >
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted" onClick={handleCopy}>
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">{copied ? "Copied!" : "Copy"}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" 
                    className={cn("h-8 w-8", reaction === "up" ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted")}
                    onClick={() => handleReaction("up")}>
                    <ThumbsUp className={cn("h-4 w-4", reaction === "up" && "fill-current")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">Good</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon"
                    className={cn("h-8 w-8", reaction === "down" ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted")}
                    onClick={() => handleReaction("down")}>
                    <ThumbsDown className={cn("h-4 w-4", reaction === "down" && "fill-current")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">Bad</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted" onClick={handleRegenerate}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">Regenerate</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted" onClick={handleBranch}>
                    <GitBranch className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">Branch</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon"
                    className={cn("h-8 w-8", message.isPinned ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted")}
                    onClick={handlePin}>
                    <Pin className={cn("h-4 w-4", message.isPinned && "fill-current")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">{message.isPinned ? "Unpin" : "Pin"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
}
