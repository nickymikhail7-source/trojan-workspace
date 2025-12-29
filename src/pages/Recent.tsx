import { useState } from "react";
import { Clock, FileText, Layers, Lightbulb, Target, BookOpen, PenTool } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { LeftRail } from "@/components/LeftRail";
import { WorkspaceCard, Workspace } from "@/components/WorkspaceCard";
import { NewWorkspaceModal } from "@/components/NewWorkspaceModal";
import { EmptyState } from "@/components/EmptyState";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const recentWorkspaces: Workspace[] = [
  {
    id: "1",
    title: "Q1 Product Strategy",
    lastActive: "Active 3 hours ago",
    tags: ["Strategy", "Planning"],
    artifacts: [
      { type: "doc", icon: FileText },
      { type: "diagram", icon: Layers },
      { type: "idea", icon: Lightbulb },
    ],
  },
  {
    id: "2",
    title: "Series A Pitch Deck",
    lastActive: "Active yesterday",
    tags: ["Pitch"],
    artifacts: [
      { type: "doc", icon: FileText },
      { type: "design", icon: PenTool },
    ],
  },
  {
    id: "3",
    title: "API Architecture Review",
    lastActive: "Active 2 days ago",
    tags: ["Architecture"],
    artifacts: [
      { type: "diagram", icon: Layers },
      { type: "doc", icon: FileText },
      { type: "doc", icon: FileText },
      { type: "target", icon: Target },
    ],
  },
  {
    id: "4",
    title: "User Research: Onboarding",
    lastActive: "Active 3 days ago",
    tags: ["Research", "Design"],
    artifacts: [
      { type: "doc", icon: FileText },
      { type: "book", icon: BookOpen },
    ],
  },
  {
    id: "5",
    title: "Competitor Analysis 2024",
    lastActive: "Active 5 days ago",
    tags: ["Research", "Strategy"],
    artifacts: [
      { type: "doc", icon: FileText },
      { type: "layers", icon: Layers },
    ],
  },
];

export default function Recent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("recent");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    if (id === "home") navigate("/");
    else if (id === "templates") navigate("/templates");
    else if (id === "library") navigate("/library");
    else if (id === "settings") navigate("/settings");
  };

  const handleWorkspaceClick = (workspace: Workspace) => {
    navigate(`/workspace/${workspace.id}`);
  };

  const handleCreateWorkspace = (type: string) => {
    setIsModalOpen(false);
    toast({
      title: "Workspace created",
      description: `Your new ${type} workspace is ready.`,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar onNewWorkspace={() => setIsModalOpen(true)} />
      
      <div className="flex flex-1 overflow-hidden">
        <LeftRail activeItem={activeNav} onItemClick={handleNavClick} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8 animate-fade-up flex items-center gap-3">
              <Clock className="h-6 w-6 text-muted-foreground" />
              <div>
                <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                  Recent
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Your recently accessed workspaces.
                </p>
              </div>
            </div>

            {/* Recent List */}
            {recentWorkspaces.length === 0 ? (
              <EmptyState
                icon={Clock}
                title="No recent workspaces"
                description="Workspaces you've recently accessed will appear here."
                actionLabel="Create Workspace"
                onAction={() => setIsModalOpen(true)}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentWorkspaces.map((workspace, index) => (
                  <div
                    key={workspace.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <WorkspaceCard
                      workspace={workspace}
                      onClick={() => handleWorkspaceClick(workspace)}
                    />
                  </div>
                ))}
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
