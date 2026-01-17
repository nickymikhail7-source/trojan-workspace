import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Sparkles, Edit2, GitBranch, Pin } from "lucide-react";
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
  type MessageAttachment,
  type ChatComposerRef,
  type WorkMode,
} from "@/components/chat";
import { WorkspaceSidebar, type Branch, type ContextFile } from "@/components/workspace/WorkspaceSidebar";
import { getPendingPrompt, clearPendingPrompt } from "@/lib/pendingPrompt";

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

  // WorkMode state - loaded from branch metadata
  const [workMode, setWorkMode] = useState<WorkMode>(() => {
    const metaKey = `branch-metadata-${workspaceId}-${branchId}`;
    try {
      const saved = localStorage.getItem(metaKey);
      if (saved) {
        const meta = JSON.parse(saved);
        return meta.workMode || "think";
      }
    } catch {
      // ignore
    }
    return "think";
  });

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
  const [branches, setBranches] = useState<Branch[]>(() => {
    // Load branches from localStorage
    const storageKey = `trojan-branches-${workspaceId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Branch[];
        return parsed.map(b => ({ ...b, isActive: b.id === branchId }));
      } catch {
        // fallback
      }
    }
    return [
      {
        id: "main",
        name: "Main",
        messageId: "",
        createdAt: "Now",
        preview: "Primary conversation thread",
        isActive: branchId === "main",
      },
    ];
  });
  const [contextFiles, setContextFiles] = useState<ContextFile[]>([]);
  const [memoryEnabled, setMemoryEnabled] = useState(true);

  const consumedInitialPromptRef = useRef<Set<string>>(new Set());

  // When user switches branches, load that branch's saved messages
  useEffect(() => {
    if (!workspaceId || !branchId) return;

    const storageKey = `trojan-messages-${workspaceId}-${branchId}`;

    try {
      const saved = localStorage.getItem(storageKey);
      setMessages(saved ? (JSON.parse(saved) as Message[]) : []);
    } catch {
      setMessages([]);
    }

    setIsStreaming(false);
    setInputValue("");

    // Ensure the UI highlights the active branch after navigation
    setBranches((prev) => prev.map((b) => ({ ...b, isActive: b.id === branchId })));
  }, [workspaceId, branchId]);

  // Save branches to localStorage whenever they change
  useEffect(() => {
    if (!workspaceId) return;
    const storageKey = `trojan-branches-${workspaceId}`;
    localStorage.setItem(storageKey, JSON.stringify(branches));
    
    // Also update branch count in workspaces list
    try {
      const savedWorkspaces = JSON.parse(localStorage.getItem("trojan-workspaces") || "[]");
      const updated = savedWorkspaces.map((w: any) => 
        w.id === workspaceId ? { ...w, branchCount: branches.length } : w
      );
      localStorage.setItem("trojan-workspaces", JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, [branches, workspaceId]);

  // If we arrived here from Home with pending prompt, seed the conversation once
  useEffect(() => {
    if (!workspaceId || !branchId) return;
    
    // Check for new pending prompt system first
    const pendingPrompt = getPendingPrompt();
    if (pendingPrompt) {
      const promptKey = `${workspaceId}:${branchId}:${pendingPrompt.content}`;
      if (consumedInitialPromptRef.current.has(promptKey)) {
        clearPendingPrompt();
        return;
      }
      
      consumedInitialPromptRef.current.add(promptKey);
      
      // Save workMode to branch metadata
      const metaKey = `branch-metadata-${workspaceId}-${branchId}`;
      localStorage.setItem(metaKey, JSON.stringify({ workMode: pendingPrompt.meta.workMode }));
      setWorkMode(pendingPrompt.meta.workMode);
      
      // Ensure workspace exists in localStorage
      try {
        const savedWorkspaces = JSON.parse(localStorage.getItem("trojan-workspaces") || "[]");
        const exists = savedWorkspaces.some((w: any) => w.id === workspaceId);
        if (!exists) {
          const newWorkspace = {
            id: workspaceId,
            title: "Untitled Workspace",
            lastActive: "Just now",
            branchCount: 1,
            tags: [],
          };
          localStorage.setItem("trojan-workspaces", JSON.stringify([newWorkspace, ...savedWorkspaces]));
        }
      } catch {
        // ignore
      }
      
      // Convert pending attachments to message attachments
      const messageAttachments: MessageAttachment[] | undefined = pendingPrompt.meta.attachments?.map(att => ({
        id: att.id,
        type: att.type,
        name: att.name,
        preview: att.preview,
      }));
      
      handleSendMessage(pendingPrompt.content, pendingPrompt.meta.workMode, messageAttachments);
      clearPendingPrompt();
      return;
    }
    
    // Backward compatibility: check for URL-based prompt
    const urlPrompt = searchParams.get("prompt");
    if (urlPrompt?.trim()) {
      const promptKey = `${workspaceId}:${branchId}:${urlPrompt}`;
      if (consumedInitialPromptRef.current.has(promptKey)) {
        // Clear URL param
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("prompt");
        navigate(`/workspace/${workspaceId}/branch/${branchId}`, { replace: true });
        return;
      }
      
      consumedInitialPromptRef.current.add(promptKey);
      
      const storageKey = `trojan-messages-${workspaceId}-${branchId}`;
      const hasSavedMessages = (() => {
        try {
          const saved = localStorage.getItem(storageKey);
          const parsed = saved ? (JSON.parse(saved) as Message[]) : [];
          return parsed.length > 0;
        } catch {
          return false;
        }
      })();
      
      if (!hasSavedMessages) {
        // Ensure workspace exists in localStorage
        try {
          const savedWorkspaces = JSON.parse(localStorage.getItem("trojan-workspaces") || "[]");
          const exists = savedWorkspaces.some((w: any) => w.id === workspaceId);
          if (!exists) {
            const newWorkspace = {
              id: workspaceId,
              title: "Untitled Workspace",
              lastActive: "Just now",
              branchCount: 1,
              tags: [],
            };
            localStorage.setItem("trojan-workspaces", JSON.stringify([newWorkspace, ...savedWorkspaces]));
          }
        } catch {
          // ignore
        }
        
        handleSendMessage(urlPrompt.trim());
      }
      
      // Clear URL param
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("prompt");
      navigate(`/workspace/${workspaceId}/branch/${branchId}`, { replace: true });
    }
  }, [workspaceId, branchId, navigate, searchParams]);

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

  const handleSendMessage = (value?: string, mode?: string, attachments?: MessageAttachment[]) => {
    const messageContent = value || inputValue;
    if (!messageContent.trim() || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "complete",
      attachments: attachments,
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

    // Copy messages up to and including the branched message
    const messageIndex = messages.findIndex((m) => m.id === pendingBranchMessageId);
    const messagesToCopy = messages.slice(0, messageIndex + 1);
    
    // Save copied messages to the new branch's storage
    const newBranchStorageKey = `trojan-messages-${workspaceId}-${newBranchId}`;
    localStorage.setItem(newBranchStorageKey, JSON.stringify(messagesToCopy));

    const newBranch: Branch = {
      id: newBranchId,
      name,
      messageId: pendingBranchMessageId,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      preview: message.content.slice(0, 80) + (message.content.length > 80 ? "..." : ""),
      isActive: true,
      parentBranchId: branchId, // Track the parent branch
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
      description: `"${name}" has been created with ${messagesToCopy.length} messages.`,
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
      "That's an interesting point! Let me think through this with you.\n\n## Key Considerations\n\nBased on what you've shared, here are the main factors to consider:\n\n1. **Context matters** - Understanding the full picture helps us make better decisions\n2. **Trade-offs exist** - Every choice has pros and cons we should weigh\n3. **Iteration is key** - We can refine our approach as we learn more\n\n> The best solutions often emerge through collaborative exploration rather than isolated thinking.\n\nWhat aspect would you like to explore first?",
      "Great question! Here's my analysis:\n\n## The Core Challenge\n\nFinding the right balance between **complexity** and **simplicity**. Too simple, and we miss important nuances. Too complex, and we lose clarity.\n\n### Recommended Approach\n\n- Start with the most critical elements\n- Build incrementally\n- Test our assumptions early\n\nHere's a simple example in code:\n\n```javascript\nconst solution = {\n  start: 'simple',\n  iterate: true,\n  validate: 'continuously'\n};\n```\n\nShall we dive deeper into any of these areas?",
      "I understand what you're getting at. Let me break this down:\n\n## The Problem\n\nWe need to make a decision with incomplete information.\n\n## Possible Approaches\n\n| Approach | Pros | Cons |\n|----------|------|------|\n| Gather more data | More informed | Time-consuming |\n| Decide now | Fast action | Risk of error |\n| Split decision | Manageable | Complexity |\n\n## My Recommendation\n\nOption 2 seems most practical here. We can move forward while staying flexible.\n\n```typescript\nfunction makeDecision(context: Context): Decision {\n  return context.isReversible \n    ? decideNow(context) \n    : gatherMoreData(context);\n}\n```\n\nWhat do you think about this approach?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const showThinking = isStreaming && messages.some(m => m.status === "streaming" && m.content === "");

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <CollapsibleLeftRail onNewWorkspace={() => setIsModalOpen(true)} />

      <div className="flex flex-1 flex-col overflow-hidden">

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Breadcrumb Header */}
          <div className="border-b border-border bg-card/50 px-4 py-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                {/* Home Link */}
                <button
                  onClick={() => navigate("/")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </button>
                
                <span className="text-muted-foreground/50">/</span>
                
                {/* Workspace Name - clickable to navigate to main branch */}
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </div>
                  {isEditingName ? (
                    <Input
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      onBlur={handleNameSave}
                      onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
                      className="h-6 text-sm w-48 px-2"
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={() => navigate(`/workspace/${workspaceId}/branch/main`)}
                      className="font-medium text-foreground hover:text-primary transition-colors truncate max-w-[180px]"
                    >
                      {workspaceName}
                    </button>
                  )}
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="h-5 w-5 rounded hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                </div>
                
                
                {/* Branch Hierarchy Breadcrumb */}
                {(() => {
                  const currentBranch = branches.find(b => b.id === branchId);
                  const breadcrumbBranches: Branch[] = [];
                  
                  // Build hierarchy from current branch up to root
                  let branch = currentBranch;
                  while (branch) {
                    breadcrumbBranches.unshift(branch);
                    branch = branch.parentBranchId 
                      ? branches.find(b => b.id === branch!.parentBranchId) 
                      : undefined;
                  }
                  
                  return breadcrumbBranches.map((b, index) => (
                    <div key={b.id} className="flex items-center gap-2">
                      {index > 0 && (
                        <span className="text-muted-foreground/50">/</span>
                      )}
                      {b.id === branchId ? (
                        // Current branch - not clickable
                        <span className="font-medium text-foreground flex items-center gap-1.5">
                          {b.parentBranchId && (
                            <GitBranch className="h-3 w-3 text-primary" />
                          )}
                          {b.name}
                        </span>
                      ) : (
                        // Parent branch - clickable
                        <button
                          onClick={() => navigate(`/workspace/${workspaceId}/branch/${b.id}`)}
                          className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                        >
                          {b.parentBranchId && (
                            <GitBranch className="h-3 w-3" />
                          )}
                          {b.name}
                        </button>
                      )}
                    </div>
                  ));
                })()}
                
                {/* Branch count indicator */}
                {branches.length > 1 && (
                  <span className="ml-1 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {branches.length} branches
                  </span>
                )}
              </div>

              {/* Sidebar Toggle - Top Right */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="h-9 w-9 rounded-xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex items-center justify-center"
              >
                <div className="relative">
                  <GitBranch className="h-4 w-4 text-muted-foreground" />
                  {(pinnedMessageIds.size > 0 || branches.length > 1) && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
              </button>
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
                      onEdit={() => {}}
                      onPin={handlePinMessage}
                      onBranch={handleBranchMessage}
                      onRegenerate={handleRegenerateMessage}
                      isLastAssistantMessage={message.id === lastAssistantMessageId}
                    />
                  </div>
                ))}
                
                {showThinking && (
                  <div className="pt-2">
                    <ThinkingIndicator workMode={workMode} />
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
