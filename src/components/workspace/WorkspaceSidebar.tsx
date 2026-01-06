import { useState } from "react";
import { 
  Pin, 
  GitBranch, 
  FileText, 
  Brain, 
  ChevronRight, 
  X, 
  Sparkles,
  Plus,
  Upload,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Message } from "@/components/chat/ChatMessage";

export interface Branch {
  id: string;
  name: string;
  messageId: string;
  createdAt: string;
  preview: string;
  isActive?: boolean;
}

export interface ContextFile {
  id: string;
  name: string;
  type: string;
  addedAt: string;
}

interface WorkspaceSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  pinnedMessages: Message[];
  branches: Branch[];
  contextFiles: ContextFile[];
  memoryEnabled: boolean;
  onMemoryToggle: () => void;
  onPinnedMessageClick: (messageId: string) => void;
  onBranchClick: (branchId: string) => void;
  onUnpin: (messageId: string) => void;
  onDeleteBranch: (branchId: string) => void;
  onNewBranch: () => void;
  onUploadFile: () => void;
  onRemoveFile: (fileId: string) => void;
}

type TabType = "branches" | "pinned" | "files";

export function WorkspaceSidebar({
  isOpen,
  onToggle,
  pinnedMessages,
  branches,
  contextFiles,
  memoryEnabled,
  onMemoryToggle,
  onPinnedMessageClick,
  onBranchClick,
  onUnpin,
  onDeleteBranch,
  onNewBranch,
  onUploadFile,
  onRemoveFile,
}: WorkspaceSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>("branches");

  const tabs = [
    { id: "branches" as const, icon: GitBranch, label: "Branches", count: branches.length },
    { id: "pinned" as const, icon: Pin, label: "Pinned", count: pinnedMessages.length },
    { id: "files" as const, icon: FileText, label: "Context", count: contextFiles.length },
  ];

  return (
    <>
      {/* Collapsed Toggle Button */}
      {!isOpen && (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="fixed right-4 top-20 z-40 h-10 w-10 rounded-xl bg-card border border-border shadow-lg hover:shadow-xl transition-all"
                onClick={onToggle}
              >
                <div className="relative">
                  <GitBranch className="h-5 w-5 text-muted-foreground" />
                  {(pinnedMessages.length > 0 || branches.length > 0) && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Workspace Sidebar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Sidebar Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full z-50 transition-all duration-300 ease-out",
          isOpen ? "w-80" : "w-0"
        )}
      >
        <div
          className={cn(
            "h-full w-80 bg-card/95 backdrop-blur-xl border-l border-border shadow-2xl flex flex-col",
            "transition-transform duration-300 ease-out",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
            <h2 className="font-semibold text-foreground">Workspace</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              onClick={onToggle}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-all",
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="h-4 min-w-4 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center px-1">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {activeTab === "branches" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 mb-4"
                    onClick={onNewBranch}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    New Branch
                  </Button>
                  
                  {branches.length === 0 ? (
                    <EmptyState
                      icon={<GitBranch className="h-8 w-8" />}
                      title="No branches yet"
                      description="Branch from any message to explore different directions"
                    />
                  ) : (
                    branches.map((branch) => (
                      <BranchCard
                        key={branch.id}
                        branch={branch}
                        onClick={() => onBranchClick(branch.id)}
                        onDelete={() => onDeleteBranch(branch.id)}
                      />
                    ))
                  )}
                </>
              )}

              {activeTab === "pinned" && (
                <>
                  {pinnedMessages.length === 0 ? (
                    <EmptyState
                      icon={<Pin className="h-8 w-8" />}
                      title="No pinned messages"
                      description="Pin important messages to quickly find them later"
                    />
                  ) : (
                    pinnedMessages.map((message) => (
                      <PinnedMessageCard
                        key={message.id}
                        message={message}
                        onClick={() => onPinnedMessageClick(message.id)}
                        onUnpin={() => onUnpin(message.id)}
                      />
                    ))
                  )}
                </>
              )}

              {activeTab === "files" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 mb-4"
                    onClick={onUploadFile}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload Context
                  </Button>
                  
                  {contextFiles.length === 0 ? (
                    <EmptyState
                      icon={<FileText className="h-8 w-8" />}
                      title="No context files"
                      description="Upload documents to give Trojan more context"
                    />
                  ) : (
                    contextFiles.map((file) => (
                      <FileCard
                        key={file.id}
                        file={file}
                        onRemove={() => onRemoveFile(file.id)}
                      />
                    ))
                  )}
                </>
              )}
            </div>
          </ScrollArea>

          {/* Memory Toggle Footer */}
          <div className="p-4 border-t border-border shrink-0">
            <button
              onClick={onMemoryToggle}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl transition-all",
                memoryEnabled
                  ? "bg-primary/10 border border-primary/20"
                  : "bg-muted/50 border border-transparent hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-3">
                <Brain className={cn("h-5 w-5", memoryEnabled ? "text-primary" : "text-muted-foreground")} />
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">Memory</p>
                  <p className="text-xs text-muted-foreground">
                    {memoryEnabled ? "Trojan remembers context" : "Context resets each session"}
                  </p>
                </div>
              </div>
              {memoryEnabled ? (
                <ToggleRight className="h-6 w-6 text-primary" />
              ) : (
                <ToggleLeft className="h-6 w-6 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/40 backdrop-blur-sm z-40"
          onClick={onToggle}
        />
      )}
    </>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground mb-4">
        {icon}
      </div>
      <h3 className="font-medium text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-[200px]">{description}</p>
    </div>
  );
}

function PinnedMessageCard({
  message,
  onClick,
  onUnpin,
}: {
  message: Message;
  onClick: () => void;
  onUnpin: () => void;
}) {
  const isUser = message.role === "user";

  return (
    <div
      className="group relative p-3 rounded-xl bg-background/50 border border-border hover:border-primary/30 hover:bg-background transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "h-7 w-7 rounded-lg flex items-center justify-center shrink-0",
            isUser
              ? "bg-gradient-to-br from-secondary to-muted"
              : "bg-gradient-to-br from-accent/20 to-primary/10"
          )}
        >
          {isUser ? (
            <span className="text-[10px] font-semibold text-muted-foreground">You</span>
          ) : (
            <Sparkles className="h-3 w-3 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-1">{message.timestamp}</p>
          <p className="text-sm text-foreground line-clamp-2">{message.content}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
        onClick={(e) => {
          e.stopPropagation();
          onUnpin();
        }}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

function BranchCard({
  branch,
  onClick,
  onDelete,
}: {
  branch: Branch;
  onClick: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={cn(
        "group relative p-3 rounded-xl border transition-all cursor-pointer",
        branch.isActive
          ? "bg-primary/5 border-primary/30"
          : "bg-background/50 border-border hover:border-primary/30 hover:bg-background"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
          <GitBranch className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">{branch.name}</p>
            {branch.isActive && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                Active
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{branch.createdAt}</p>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{branch.preview}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {!branch.isActive && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}

function FileCard({
  file,
  onRemove,
}: {
  file: ContextFile;
  onRemove: () => void;
}) {
  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("doc")) return "📝";
    if (type.includes("image")) return "🖼️";
    if (type.includes("spreadsheet") || type.includes("excel")) return "📊";
    return "📎";
  };

  return (
    <div className="group relative p-3 rounded-xl bg-background/50 border border-border hover:border-primary/30 hover:bg-background transition-all">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-muted/80 flex items-center justify-center shrink-0 text-sm">
          {getFileIcon(file.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">{file.addedAt}</p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
