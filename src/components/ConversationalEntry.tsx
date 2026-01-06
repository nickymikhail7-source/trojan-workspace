import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Target, 
  Bug, 
  Mail, 
  Presentation, 
  Plus,
  Send,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { QuickActionCard } from "@/components/QuickActionCard";
import { RecentWorkspaceItem } from "@/components/RecentWorkspaceItem";
import { useToast } from "@/hooks/use-toast";

interface Workspace {
  id: string;
  title: string;
  lastActive: string;
  preview?: string;
}

interface ConversationalEntryProps {
  userName?: string;
  recentWorkspaces: Workspace[];
}

const quickActions = [
  {
    id: "gtm",
    icon: Target,
    label: "Plan a GTM strategy",
    description: "Go-to-market planning and execution",
    prompt: "Help me plan a go-to-market strategy for my product.",
  },
  {
    id: "debug",
    icon: Bug,
    label: "Debug my app",
    description: "Troubleshoot issues and find solutions",
    prompt: "I need help debugging an issue in my application.",
  },
  {
    id: "email",
    icon: Mail,
    label: "Write a cold email",
    description: "Craft compelling outreach messages",
    prompt: "Help me write a cold email to reach out to potential customers.",
  },
  {
    id: "pitch",
    icon: Presentation,
    label: "Review a pitch deck",
    description: "Get feedback on your presentation",
    prompt: "I want to review my pitch deck and get feedback.",
  },
];

export function ConversationalEntry({ 
  userName = "there", 
  recentWorkspaces 
}: ConversationalEntryProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const handleCreateWorkspace = (prompt: string) => {
    const newId = `new-${Date.now()}`;
    const encodedPrompt = encodeURIComponent(prompt);
    navigate(`/workspace/${newId}/branch/main?prompt=${encodedPrompt}`);
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    if (action.id === "other") {
      inputRef.current?.focus();
      return;
    }
    handleCreateWorkspace(action.prompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    handleCreateWorkspace(inputValue.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleWorkspaceClick = (workspace: Workspace) => {
    navigate(`/workspace/${workspace.id}/branch/main`);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl space-y-10 animate-fade-up">
        {/* Greeting */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-2">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">
            Hey {userName}, what are we working on today?
          </h1>
          <p className="text-muted-foreground text-base">
            Start with a quick action or tell me what's on your mind.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <QuickActionCard
              key={action.id}
              icon={action.icon}
              label={action.label}
              description={action.description}
              onClick={() => handleQuickAction(action)}
            />
          ))}
          <QuickActionCard
            icon={Plus}
            label="Start something else..."
            description="Begin with your own idea"
            onClick={() => inputRef.current?.focus()}
            variant="custom"
          />
        </div>

        {/* Input Field */}
        <form onSubmit={handleSubmit} className="relative">
          <div
            className={cn(
              "relative rounded-2xl border bg-card transition-all duration-200",
              isFocused
                ? "border-primary/40 shadow-lg shadow-primary/5 ring-4 ring-primary/10"
                : "border-border hover:border-border/80"
            )}
          >
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Or just tell me what you need help with..."
              rows={1}
              className={cn(
                "w-full resize-none bg-transparent px-4 py-4 pr-14 text-foreground",
                "placeholder:text-muted-foreground focus:outline-none",
                "text-base leading-relaxed"
              )}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim()}
              className={cn(
                "absolute right-3 bottom-3 h-9 w-9 rounded-xl transition-all",
                inputValue.trim()
                  ? "opacity-100 scale-100"
                  : "opacity-50 scale-95"
              )}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Recent Workspaces */}
        {recentWorkspaces.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border/50" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Recently Active
              </span>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            
            <div className="space-y-2">
              {recentWorkspaces.slice(0, 4).map((workspace) => (
                <RecentWorkspaceItem
                  key={workspace.id}
                  id={workspace.id}
                  title={workspace.title}
                  lastActive={workspace.lastActive}
                  preview={workspace.preview}
                  onClick={() => handleWorkspaceClick(workspace)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
