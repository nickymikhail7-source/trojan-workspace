import { useState } from "react";
import { Copy, ThumbsUp, ThumbsDown, Bookmark, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  status: "sending" | "streaming" | "complete" | "error";
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
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

  const handleSaveArtifact = () => {
    toast({
      title: "Saved as artifact",
      description: "This response has been saved to your artifacts.",
    });
  };

  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 group",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 mt-1 ring-1 ring-border/50">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
      )}

      <div className={cn("flex flex-col max-w-[75%]", isUser ? "items-end" : "items-start")}>
        {/* Message Bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-subtle",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border text-foreground"
          )}
        >
          <div className="text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
            {message.status === "streaming" && (
              <span className="inline-block w-2 h-4 bg-primary/60 animate-pulse ml-1 rounded-sm" />
            )}
          </div>
        </div>

        {/* Timestamp */}
        <span
          className={cn(
            "text-[11px] mt-1.5 px-1",
            isUser ? "text-muted-foreground/70" : "text-muted-foreground"
          )}
        >
          {message.timestamp}
        </span>

        {/* Assistant Message Actions */}
        {!isUser && message.status === "complete" && (
          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{copied ? "Copied!" : "Copy"}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-7 w-7",
                      reaction === "up"
                        ? "text-green-500 hover:text-green-600"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => handleReaction("up")}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Good response</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-7 w-7",
                      reaction === "down"
                        ? "text-destructive hover:text-destructive/80"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => handleReaction("down")}
                  >
                    <ThumbsDown className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Bad response</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={handleSaveArtifact}
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Save as artifact</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1 ring-1 ring-border/50">
          <span className="text-xs font-medium text-muted-foreground">You</span>
        </div>
      )}
    </div>
  );
}
