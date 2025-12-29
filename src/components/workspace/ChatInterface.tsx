import { useState, useRef, useEffect } from "react";
import { Send, Loader2, AlertCircle, StopCircle, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  status?: "streaming" | "complete" | "error";
}

type ChatStatus = "idle" | "streaming" | "stopped" | "error";

interface ChatInterfaceProps {
  messages: Message[];
  status: ChatStatus;
  onSendMessage: (content: string) => void;
  onStopGeneration?: () => void;
  onRetry?: () => void;
}

export function ChatInterface({ messages, status, onSendMessage, onStopGeneration, onRetry }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status !== "streaming") {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-up">
            <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">Start a conversation</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Ask questions, brainstorm ideas, or explore your thinking.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-4 animate-fade-up",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-accent" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[70%] rounded-xl px-4 py-3",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                {message.status === "streaming" && (
                  <span className="inline-block w-1.5 h-4 bg-accent/50 animate-pulse ml-1" />
                )}
                {message.status === "error" && (
                  <div className="flex items-center gap-2 mt-2 text-destructive text-xs">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Failed to generate</span>
                    {onRetry && (
                      <button onClick={onRetry} className="underline hover:no-underline">
                        Retry
                      </button>
                    )}
                  </div>
                )}
              </div>
              {message.role === "user" && (
                <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-card">
        {status === "streaming" && onStopGeneration && (
          <div className="flex justify-center mb-3">
            <Button variant="outline" size="sm" onClick={onStopGeneration} className="gap-2">
              <StopCircle className="h-4 w-4" />
              Stop generating
            </Button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={status === "streaming"}
            className="flex-1 h-11 px-4 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 transition-all duration-150"
          />
          <Button
            type="submit"
            disabled={!input.trim() || status === "streaming"}
            size="icon"
            className="h-11 w-11 shrink-0"
          >
            {status === "streaming" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
