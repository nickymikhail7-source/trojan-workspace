import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Sparkles, Edit2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CollapsibleLeftRail } from "@/components/CollapsibleLeftRail";
import { NewWorkspaceModal } from "@/components/NewWorkspaceModal";
import { NewBranchModal } from "@/components/NewBranchModal";
import { useToast } from "@/hooks/use-toast";
import {
  ChatMessage,
  ChatComposer,
  ChatEmptyState,
  ThinkingIndicator,
  type Message,
  type ChatComposerRef,
} from "@/components/chat";
import { WorkspaceSidebar, type Branch, type ContextFile } from "@/components/workspace/WorkspaceSidebar";

// Sample workspace names for existing workspaces
const existingWorkspaceNames: Record<string, string> = {
  "1": "Q1 Product Strategy",
  "2": "Series A Pitch Deck",
  "3": "API Architecture Review",
  "4": "User Research: Onboarding",
  "5": "Competitor Analysis 2024",
  "6": "Brand Guidelines v2",
  "7": "Team Retrospective Notes",
  "8": "Feature Prioritization",
};

export default function BranchView() {
  const { id: workspaceId, branchId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const composerRef = useRef<ChatComposerRef>(null);

  const isNewWorkspace = workspaceId?.startsWith("new-");
  const initialPrompt = searchParams.get("prompt");

  const [workspaceName, setWorkspaceName] = useState(() => {
    // Check localStorage for saved workspaces first
    const savedWorkspaces = JSON.parse(localStorage.getItem("trojan-workspaces") || "[]");
    const savedWorkspace = savedWorkspaces.find((w: any) => w.id === workspaceId);
    if (savedWorkspace) return savedWorkspace.title;
    if (isNewWorkspace) return "Untitled Workspace";
    return existingWorkspaceNames[workspaceId || "1"] || "Workspace";
  });
  const [isEditingName, setIsEditingName] = useState(false);
  
  // Load messages from localStorage
  const [messages, setMessages] = useState<Message[]>(() => {
    const storageKey = `trojan-messages-${workspaceId}-${branchId}`;
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [pendingBranchMessageId, setPendingBranchMessageId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pinnedMessageIds, setPinnedMessageIds] = useState<Set<string>>(new Set());
  const [branches, setBranches] = useState<Branch[]>([
    {
      id: "main",
      name: "Main",
      messageId: "",
      createdAt: "Now",
      preview: "Primary conversation thread",
      isActive: branchId === "main",
    },
  ]);
  const [contextFiles, setContextFiles] = useState<ContextFile[]>([]);
  const [memoryEnabled, setMemoryEnabled] = useState(true);

  // Handle initial prompt from URL
  useEffect(() => {
    if (initialPrompt && messages.length === 0) {
      handleSendMessage(initialPrompt);
      // Clear the prompt from URL
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("prompt");
      navigate(`/workspace/${workspaceId}/branch/${branchId}`, { replace: true });
    }
  }, [initialPrompt]);

  // When user switches branches, load that branch's saved messages
  useEffect(() => {
    if (!workspaceId || !branchId) return;
    const storageKey = `trojan-messages-${workspaceId}-${branchId}`;
    const saved = localStorage.getItem(storageKey);
    setMessages(saved ? JSON.parse(saved) : []);
    setIsStreaming(false);
    setInputValue("");

    // Ensure the UI highlights the active branch after navigation
    setBranches((prev) => prev.map((b) => ({ ...b, isActive: b.id === branchId })));
  }, [workspaceId, branchId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (!workspaceId || !branchId) return;
    const storageKey = `trojan-messages-${workspaceId}-${branchId}`;
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, workspaceId, branchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCreateWorkspace = (type: string) => {
    setIsModalOpen(false);
    const newId = `new-${Date.now()}`;
    
    // Save to localStorage
    const saved = localStorage.getItem("trojan-workspaces");
    const existing = saved ? JSON.parse(saved) : [];
    const newWorkspace = {
      id: newId,
      title: `New ${type} Workspace`,
      lastActive: "Just now",
      branchCount: 1,
      tags: [type],
    };
    localStorage.setItem("trojan-workspaces", JSON.stringify([newWorkspace, ...existing]));
    
    toast({
      title: "Workspace created",
      description: `Your new ${type} workspace is ready.`,
    });
    navigate(`/workspace/${newId}/branch/main`);
  };

  const handleNameSave = () => {
    setIsEditingName(false);
    const name = workspaceName.trim() === "" ? "Untitled Workspace" : workspaceName;
    setWorkspaceName(name);
    
    // Update workspace name in localStorage
    if (workspaceId) {
      const saved = localStorage.getItem("trojan-workspaces");
      if (saved) {
        const workspaces = JSON.parse(saved);
        const updated = workspaces.map((w: any) =>
          w.id === workspaceId ? { ...w, title: name } : w
        );
        localStorage.setItem("trojan-workspaces", JSON.stringify(updated));
      } else {
        // Create new entry if workspace doesn't exist
        const newWorkspace = {
          id: workspaceId,
          title: name,
          lastActive: "Just now",
          branchCount: 1,
          tags: [],
        };
        localStorage.setItem("trojan-workspaces", JSON.stringify([newWorkspace]));
      }
    }
    
    toast({
      description: `Workspace renamed to "${name}"`,
    });
  };

  const handleSendMessage = (value?: string, mode?: string) => {
    const messageContent = value || inputValue;
    if (!messageContent.trim() || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "complete",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsStreaming(true);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "streaming",
      responseMode: mode as any,
    };

    setMessages((prev) => [...prev, aiMessage]);

    const responseText = getSimulatedResponse(messageContent);
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

  const handleBranchMessage = useCallback((messageId: string) => {
    setPendingBranchMessageId(messageId);
    setIsBranchModalOpen(true);
  }, []);

  const handleCreateBranch = useCallback((name: string) => {
    if (!pendingBranchMessageId) return;

    const message = messages.find((m) => m.id === pendingBranchMessageId);
    if (!message) return;

    const newBranchId = `branch-${Date.now()}`;

    const newBranch: Branch = {
      id: newBranchId,
      name,
      messageId: pendingBranchMessageId,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      preview: message.content.slice(0, 80) + (message.content.length > 80 ? "..." : ""),
      isActive: true,
    };

    setBranches((prev) => [
      ...prev.map((b) => ({ ...b, isActive: false })),
      newBranch,
    ]);
    setPendingBranchMessageId(null);

    // Immediately navigate to the newly created branch
    navigate(`/workspace/${workspaceId}/branch/${newBranchId}`);

    toast({
      title: "Branch created",
      description: `"${name}" has been created.`,
    });
  }, [pendingBranchMessageId, messages, toast, navigate, workspaceId]);

  const handlePinnedMessageClick = useCallback((messageId: string) => {
    const element = messageRefs.current.get(messageId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("animate-pulse");
      setTimeout(() => element.classList.remove("animate-pulse"), 1500);
    }
    setIsSidebarOpen(false);
  }, []);

  const handleBranchClick = useCallback((branchIdToNav: string) => {
    setBranches((prev) =>
      prev.map((b) => ({ ...b, isActive: b.id === branchIdToNav }))
    );
    setIsSidebarOpen(false);
    navigate(`/workspace/${workspaceId}/branch/${branchIdToNav}`);
  }, [navigate, workspaceId]);

  const handleDeleteBranch = useCallback((branchIdToDelete: string) => {
    setBranches((prev) => prev.filter((b) => b.id !== branchIdToDelete));
    toast({
      description: "Branch deleted",
    });
  }, [toast]);

  const handleRegenerateMessage = useCallback((messageId: string) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;

    let userMessageContent = "";
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        userMessageContent = messages[i].content;
        break;
      }
    }

    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    setIsStreaming(true);

    const aiMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "streaming",
    };

    setMessages((prev) => [...prev, aiMessage]);

    const responseText = getSimulatedResponse(userMessageContent);
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
  }, [messages]);

  const handleUploadFile = () => {
    toast({
      title: "Coming soon",
      description: "File upload will be available in a future update.",
    });
  };

  const handleRemoveFile = (fileId: string) => {
    setContextFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const pinnedMessages = messages.filter((m) => pinnedMessageIds.has(m.id));
  const lastAssistantMessageId = [...messages].reverse().find((m) => m.role === "assistant" && m.status === "complete")?.id;

  const getSimulatedResponse = (input: string): string => {
    const responses = [
      "That's an interesting point. Let me think through this with you.\n\nBased on what you've shared, I see a few key considerations:\n\n1. **Context matters** - Understanding the full picture helps us make better decisions\n2. **Trade-offs exist** - Every choice has pros and cons we should weigh\n3. **Iteration is key** - We can refine our approach as we learn more\n\nWhat aspect would you like to explore first?",
      "Great question! Here's my analysis:\n\nThe core challenge seems to be finding the right balance between complexity and simplicity. Too simple, and we miss important nuances. Too complex, and we lose clarity.\n\nI'd suggest we:\n- Start with the most critical elements\n- Build incrementally\n- Test our assumptions early\n\nShall we dive deeper into any of these areas?",
      "I understand what you're getting at. Let me break this down:\n\n**The Problem:**\nWe need to make a decision with incomplete information.\n\n**Possible Approaches:**\n1. Gather more data before deciding\n2. Make a reversible decision now\n3. Split the decision into smaller parts\n\n**My Recommendation:**\nOption 2 seems most practical here. We can move forward while staying flexible.\n\nWhat do you think about this approach?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const showThinking = isStreaming && messages.some(m => m.status === "streaming" && m.content === "");

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <CollapsibleLeftRail onNewWorkspace={() => setIsModalOpen(true)} />

      <div className="flex flex-1 flex-col overflow-hidden">

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Enhanced Branch Header */}
          <div className="border-b border-border bg-card/50 px-4 py-2 shrink-0 flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Home</span>
            </button>
            <div className="h-4 w-px bg-border" />
            
            {/* Workspace Name */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="h-3 w-3 text-primary" />
              </div>
              
              {isEditingName ? (
                <Input
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  onBlur={handleNameSave}
                  onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
                  className="h-7 text-sm w-64"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="flex items-center gap-2 group"
                >
                  <span className="text-sm font-medium text-foreground truncate max-w-[200px]">
                    {workspaceName}
                  </span>
                  <Edit2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )}
              
              <span className="text-xs text-muted-foreground">
                / {branches.find(b => b.id === branchId)?.name || "Main"}
              </span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <ChatEmptyState onPromptClick={handlePromptClick} />
            ) : (
              <div className="max-w-4xl mx-auto px-6 py-6 space-y-5">
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
                      onRegenerate={handleRegenerateMessage}
                      isLastAssistantMessage={message.id === lastAssistantMessageId}
                    />
                  </div>
                ))}
                
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
          <div className="border-t border-border/50 bg-background/60 backdrop-blur-sm px-6 py-2 shrink-0">
            <div className="max-w-4xl mx-auto">
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

      {/* Workspace Sidebar */}
      <WorkspaceSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        pinnedMessages={pinnedMessages}
        branches={branches}
        contextFiles={contextFiles}
        memoryEnabled={memoryEnabled}
        onMemoryToggle={() => setMemoryEnabled(!memoryEnabled)}
        onPinnedMessageClick={handlePinnedMessageClick}
        onBranchClick={handleBranchClick}
        onUnpin={handlePinMessage}
        onDeleteBranch={handleDeleteBranch}
        onNewBranch={() => setIsBranchModalOpen(true)}
        onUploadFile={handleUploadFile}
        onRemoveFile={handleRemoveFile}
      />

      <NewWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateWorkspace}
      />

      <NewBranchModal
        isOpen={isBranchModalOpen}
        onClose={() => {
          setIsBranchModalOpen(false);
          setPendingBranchMessageId(null);
        }}
        onCreate={handleCreateBranch}
      />
    </div>
  );
}
