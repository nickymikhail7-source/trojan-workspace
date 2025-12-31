import { useState } from "react";
import { Pin, GitBranch, MessageSquare, ChevronRight, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Message } from "./ChatMessage";

export interface Branch {
  id: string;
  name: string;
  messageId: string;
  createdAt: string;
  preview: string;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  pinnedMessages: Message[];
  branches: Branch[];
  onPinnedMessageClick: (messageId: string) => void;
  onBranchClick: (branchId: string) => void;
  onUnpin: (messageId: string) => void;
  onDeleteBranch: (branchId: string) => void;
}

export function ChatSidebar({
  isOpen,
  onToggle,
  pinnedMessages,
  branches,
  onPinnedMessageClick,
  onBranchClick,
  onUnpin,
  onDeleteBranch,
}: ChatSidebarProps) {
  const [activeTab, setActiveTab] = useState<"pinned" | "branches">("pinned");

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
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  {(pinnedMessages.length > 0 || branches.length > 0) && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Pinned & Branches</p>
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
            <h2 className="font-semibold text-foreground">Conversation</h2>
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
            <button
              onClick={() => setActiveTab("pinned")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all",
                activeTab === "pinned"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Pin className="h-4 w-4" />
              <span>Pinned</span>
              {pinnedMessages.length > 0 && (
                <span className="ml-1 h-5 min-w-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center px-1.5">
                  {pinnedMessages.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("branches")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all",
                activeTab === "branches"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <GitBranch className="h-4 w-4" />
              <span>Branches</span>
              {branches.length > 0 && (
                <span className="ml-1 h-5 min-w-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center px-1.5">
                  {branches.length}
                </span>
              )}
            </button>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1">
            {activeTab === "pinned" ? (
              <div className="p-4 space-y-3">
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
              </div>
            ) : (
              <div className="p-4 space-y-3">
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
              </div>
            )}
          </ScrollArea>
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

      {/* Unpin button */}
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
      className="group relative p-3 rounded-xl bg-background/50 border border-border hover:border-primary/30 hover:bg-background transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
          <GitBranch className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground mb-0.5">{branch.name}</p>
          <p className="text-xs text-muted-foreground mb-1">{branch.createdAt}</p>
          <p className="text-xs text-muted-foreground line-clamp-2">{branch.preview}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Delete button */}
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
    </div>
  );
}
