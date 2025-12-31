import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { LeftRail } from "@/components/LeftRail";
import { NewWorkspaceModal } from "@/components/NewWorkspaceModal";
import { useToast } from "@/hooks/use-toast";
import {
  ChatMessage,
  ChatComposer,
  ChatEmptyState,
  ThinkingIndicator,
  ChatSidebar,
  type Message,
  type ChatComposerRef,
  type Branch,
} from "@/components/chat";

export default function BranchView() {
  const { id: workspaceId, branchId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const composerRef = useRef<ChatComposerRef>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pinnedMessageIds, setPinnedMessageIds] = useState<Set<string>>(new Set());
  const [branches, setBranches] = useState<Branch[]>([]);

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

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    composerRef.current?.focus();
  };

  // Pin/Unpin message handler
  const handlePinMessage = useCallback((messageId: string) => {
    setPinnedMessageIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  }, []);

  // Branch from message handler
  const handleBranchMessage = useCallback((messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message) return;

    const newBranch: Branch = {
      id: `branch-${Date.now()}`,
      name: `Branch ${branches.length + 1}`,
      messageId,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      preview: message.content.slice(0, 80) + (message.content.length > 80 ? "..." : ""),
    };

    setBranches((prev) => [...prev, newBranch]);
  }, [messages, branches.length]);

  // Scroll to pinned message
  const handlePinnedMessageClick = useCallback((messageId: string) => {
    const element = messageRefs.current.get(messageId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("animate-pulse");
      setTimeout(() => element.classList.remove("animate-pulse"), 1500);
    }
    setIsSidebarOpen(false);
  }, []);

  // Navigate to branch
  const handleBranchClick = useCallback((branchIdToNav: string) => {
    toast({
      title: "Opening branch",
      description: "Navigating to the branched conversation...",
    });
    setIsSidebarOpen(false);
    // In a real app, this would navigate to the branch
    navigate(`/workspace/${workspaceId}/branch/${branchIdToNav}`);
  }, [navigate, workspaceId, toast]);

  // Delete branch
  const handleDeleteBranch = useCallback((branchIdToDelete: string) => {
    setBranches((prev) => prev.filter((b) => b.id !== branchIdToDelete));
    toast({
      description: "Branch deleted",
    });
  }, [toast]);

  // Get pinned messages
  const pinnedMessages = messages.filter((m) => pinnedMessageIds.has(m.id));

  const getSimulatedResponse = (input: string): string => {
    const responses = [
      "That's an interesting point. Let me think through this with you.\n\nBased on what you've shared, I see a few key considerations:\n\n1. **Context matters** - Understanding the full picture helps us make better decisions\n2. **Trade-offs exist** - Every choice has pros and cons we should weigh\n3. **Iteration is key** - We can refine our approach as we learn more\n\nWhat aspect would you like to explore first?",
      "Great question! Here's my analysis:\n\nThe core challenge seems to be finding the right balance between complexity and simplicity. Too simple, and we miss important nuances. Too complex, and we lose clarity.\n\nI'd suggest we:\n- Start with the most critical elements\n- Build incrementally\n- Test our assumptions early\n\nShall we dive deeper into any of these areas?",
      "I understand what you're getting at. Let me break this down:\n\n**The Problem:**\nWe need to make a decision with incomplete information.\n\n**Possible Approaches:**\n1. Gather more data before deciding\n2. Make a reversible decision now\n3. Split the decision into smaller parts\n\n**My Recommendation:**\nOption 2 seems most practical here. We can move forward while staying flexible.\n\nWhat do you think about this approach?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Check if currently streaming (for thinking indicator)
  const showThinking = isStreaming && messages.some(m => m.status === "streaming" && m.content === "");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar onNewWorkspace={() => setIsModalOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <LeftRail activeItem={activeNav} onItemClick={handleNavClick} />

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Compact Branch Header */}
          <div className="border-b border-border bg-card/50 px-4 py-2 shrink-0 flex items-center gap-3">
            <button
              onClick={() => navigate(`/workspace/${workspaceId}`)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">Branch {branchId?.slice(-4)}</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <ChatEmptyState onPromptClick={handlePromptClick} />
            ) : (
              <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    ref={(el) => {
                      if (el) messageRefs.current.set(message.id, el);
                    }}
                  >
                    <ChatMessage
                      message={{ ...message, isPinned: pinnedMessageIds.has(message.id) }}
                      onPin={handlePinMessage}
                      onBranch={handleBranchMessage}
                    />
                  </div>
                ))}
                
                {/* Thinking Indicator */}
                {showThinking && (
                  <div className="pt-2">
                    <ThinkingIndicator />
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Composer Area */}
          <div className="border-t border-border/50 bg-background/60 backdrop-blur-sm px-4 py-3 shrink-0">
            <div className="max-w-3xl mx-auto">
              <ChatComposer
                ref={composerRef}
                value={inputValue}
                onChange={setInputValue}
                onSend={handleSendMessage}
                onStop={handleStopGeneration}
                isStreaming={isStreaming}
                placeholder="What would you like to think about?"
              />
            </div>
          </div>
        </main>
      </div>

      {/* Chat Sidebar */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        pinnedMessages={pinnedMessages}
        branches={branches}
        onPinnedMessageClick={handlePinnedMessageClick}
        onBranchClick={handleBranchClick}
        onUnpin={handlePinMessage}
        onDeleteBranch={handleDeleteBranch}
      />

      <NewWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateWorkspace}
      />
    </div>
  );
}
