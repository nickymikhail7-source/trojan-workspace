import { useState } from "react";
import { MessageSquare, FileText, GitBranch, Lightbulb, Filter } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { LeftRail } from "@/components/LeftRail";
import { NewWorkspaceModal } from "@/components/NewWorkspaceModal";
import { ActivityFeed } from "@/components/workspace/ActivityFeed";
import { EmptyState } from "@/components/EmptyState";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const activities = [
  { id: "1", type: "message" as const, title: "New message in Q1 Strategy", description: "Explored pricing model options with AI", timestamp: "2 hours ago", user: "You" },
  { id: "2", type: "artifact" as const, title: "Document created", description: "Product Requirements v2 in Q1 Product Strategy", timestamp: "3 hours ago", user: "You" },
  { id: "3", type: "branch" as const, title: "New branch created", description: "Technical Spec in API Architecture Review", timestamp: "Yesterday", user: "You" },
  { id: "4", type: "insight" as const, title: "AI insight generated", description: "Connection found between pricing and user segments", timestamp: "Yesterday" },
  { id: "5", type: "message" as const, title: "Conversation continued", description: "Discussed onboarding flow improvements", timestamp: "2 days ago", user: "You" },
  { id: "6", type: "artifact" as const, title: "Diagram updated", description: "System Architecture Diagram in API Architecture", timestamp: "3 days ago", user: "You" },
];

const filters = ["All", "Messages", "Artifacts", "Branches", "Insights"];
const filterMap: Record<string, string> = {
  "Messages": "message",
  "Artifacts": "artifact",
  "Branches": "branch",
  "Insights": "insight",
};

export default function Activity() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    if (id === "home") navigate("/");
    else if (id === "recent") navigate("/recent");
    else if (id === "templates") navigate("/templates");
    else if (id === "library") navigate("/library");
    else if (id === "settings") navigate("/settings");
  };

  const handleCreateWorkspace = (type: string) => {
    setIsModalOpen(false);
    toast({
      title: "Workspace created",
      description: `Your new ${type} workspace is ready.`,
    });
  };

  const filteredActivities = selectedFilter === "All"
    ? activities
    : activities.filter(a => a.type === filterMap[selectedFilter]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar onNewWorkspace={() => setIsModalOpen(true)} />
      
      <div className="flex flex-1 overflow-hidden">
        <LeftRail activeItem={activeNav} onItemClick={handleNavClick} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8 animate-fade-up flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
              <div>
                <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                  Activity
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Your recent activity across workspaces.
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6 animate-fade-up overflow-x-auto pb-2" style={{ animationDelay: "50ms" }}>
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 whitespace-nowrap",
                    selectedFilter === filter
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Activity Feed */}
            {filteredActivities.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No activity yet"
                description="Your recent actions will appear here as you work."
              />
            ) : (
              <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
                <ActivityFeed activities={filteredActivities} />
              </div>
            )}
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
