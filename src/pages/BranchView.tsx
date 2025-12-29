import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, StopCircle, Sparkles, FileText, Lightbulb, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TopBar } from "@/components/TopBar";
import { LeftRail } from "@/components/LeftRail";
import { NewWorkspaceModal } from "@/components/NewWorkspaceModal";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  status: "sending" | "streaming" | "complete" | "error";
}

export default function BranchView() {
  const { id: workspaceId, branchId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNavClick = (navId: string) => {
    setActiveNav(navId);
    if (navId === "home") navigate("/");
    else if (navId === "recent") navigate("/recent");
    else if (navId === "templates") navigate("/templates");
    else if (navId === "library") navigate("/library");
    else if (navId === "settings") navigate("/settings");
  };

  const handleCreateWorkspace = (type: string) => {
    setIsModalOpen(false);
    const newId = `new-${Date.now()}`;
    toast({
      title: "Workspace created",
      description: `Your new ${type} workspace is ready.`,
    });
    navigate(`/workspace/${newId}?type=${type}`);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "complete",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsStreaming(true);

    // Simulate AI response
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "streaming",
    };

    setMessages((prev) => [...prev, aiMessage]);

    // Simulate streaming response
    const responseText = getSimulatedResponse(inputValue);
    let currentIndex = 0;

    const streamInterval = setInterval(() => {
      if (currentIndex < responseText.length) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessage.id
              ? { ...msg, content: responseText.slice(0, currentIndex + 1) }
              : msg
          )
        );
        currentIndex++;
      } else {
        clearInterval(streamInterval);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessage.id ? { ...msg, status: "complete" } : msg
          )
        );
        setIsStreaming(false);
      }
    }, 20);
  };

  const handleStopGeneration = () => {
    setIsStreaming(false);
    setMessages((prev) =>
      prev.map((msg) =>
        msg.status === "streaming" ? { ...msg, status: "complete" } : msg
      )
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSimulatedResponse = (input: string): string => {
    const responses = [
      "That's an interesting point. Let me think through this with you.\n\nBased on what you've shared, I see a few key considerations:\n\n1. **Context matters** - Understanding the full picture helps us make better decisions\n2. **Trade-offs exist** - Every choice has pros and cons we should weigh\n3. **Iteration is key** - We can refine our approach as we learn more\n\nWhat aspect would you like to explore first?",
      "Great question! Here's my analysis:\n\nThe core challenge seems to be finding the right balance between complexity and simplicity. Too simple, and we miss important nuances. Too complex, and we lose clarity.\n\nI'd suggest we:\n- Start with the most critical elements\n- Build incrementally\n- Test our assumptions early\n\nShall we dive deeper into any of these areas?",
      "I understand what you're getting at. Let me break this down:\n\n**The Problem:**\nWe need to make a decision with incomplete information.\n\n**Possible Approaches:**\n1. Gather more data before deciding\n2. Make a reversible decision now\n3. Split the decision into smaller parts\n\n**My Recommendation:**\nOption 2 seems most practical here. We can move forward while staying flexible.\n\nWhat do you think about this approach?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar onNewWorkspace={() => setIsModalOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <LeftRail activeItem={activeNav} onItemClick={handleNavClick} />

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Branch Header */}
          <div className="border-b border-border bg-card px-6 py-4 shrink-0">
            <button
              onClick={() => navigate(`/workspace/${workspaceId}`)}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mb-3"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Branches
            </button>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Branch {branchId?.slice(-4)}</h1>
                <p className="text-xs text-muted-foreground">Think together with AI</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center px-6 py-12">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Start thinking</h2>
                <p className="text-sm text-muted-foreground text-center max-w-md mb-8">
                  This is your thinking space. Ask questions, explore ideas, and work through problems together with AI.
                </p>
                
                {/* Starter prompts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
                  {[
                    { icon: FileText, text: "Help me write a product brief" },
                    { icon: Lightbulb, text: "Brainstorm solutions for..." },
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInputValue(prompt.text);
                        textareaRef.current?.focus();
                      }}
                      className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:border-primary/30 hover:bg-card/80 transition-all text-left group"
                    >
                      <prompt.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      <span className="text-sm text-foreground">{prompt.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-4",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground"
                      )}
                    >
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                        {message.status === "streaming" && (
                          <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "text-xs mt-2",
                          message.role === "user"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        )}
                      >
                        {message.timestamp}
                      </div>
                    </div>
                    {message.role === "user" && (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
                        <span className="text-xs font-medium text-muted-foreground">You</span>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-border bg-card p-4 shrink-0">
            <div className="max-w-3xl mx-auto">
              <div className="relative flex items-end gap-2">
                <Textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="What would you like to think about?"
                  className="min-h-[52px] max-h-[200px] resize-none pr-12"
                  rows={1}
                />
                <div className="absolute right-2 bottom-2">
                  {isStreaming ? (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleStopGeneration}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <StopCircle className="h-5 w-5" />
                    </Button>
                  ) : (
                    <Button
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      className="h-8 w-8"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </main>
      </div>

      <NewWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateWorkspace}
      />
    </div>
  );
}
