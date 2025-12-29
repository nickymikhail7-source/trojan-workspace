import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Layers, Lightbulb, BookOpen, PenTool, Target } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { LeftRail } from "@/components/LeftRail";
import { WorkspaceCard, NewWorkspaceCard, Workspace } from "@/components/WorkspaceCard";
import { NewWorkspaceModal } from "@/components/NewWorkspaceModal";
import { useToast } from "@/hooks/use-toast";
// Sample data
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

const allWorkspaces: Workspace[] = [
  ...recentWorkspaces,
  {
    id: "6",
    title: "Brand Guidelines v2",
    lastActive: "Active 1 week ago",
    tags: ["Design"],
    artifacts: [
      { type: "design", icon: PenTool },
      { type: "doc", icon: FileText },
    ],
  },
  {
    id: "7",
    title: "Team Retrospective Notes",
    lastActive: "Active 2 weeks ago",
    tags: ["Planning"],
    artifacts: [
      { type: "doc", icon: FileText },
    ],
  },
  {
    id: "8",
    title: "Feature Prioritization",
    lastActive: "Active 2 weeks ago",
    tags: ["Strategy", "Planning"],
    artifacts: [
      { type: "layers", icon: Layers },
      { type: "target", icon: Target },
    ],
  },
];

export default function Index() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    if (id === "recent") navigate("/recent");
    else if (id === "templates") navigate("/templates");
    else if (id === "library") navigate("/library");
    else if (id === "settings") navigate("/settings");
  };
  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCreateWorkspace = (type: string) => {
    setIsModalOpen(false);
    toast({
      title: "Workspace created",
      description: `Your new ${type} workspace is ready.`,
    });
  };

  const handleWorkspaceClick = (workspace: Workspace) => {
    navigate(`/workspace/${workspace.id}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar onNewWorkspace={() => setIsModalOpen(true)} />
      
      <div className="flex flex-1 overflow-hidden">
        <LeftRail activeItem={activeNav} onItemClick={handleNavClick} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8 animate-fade-up">
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                Workspaces
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Pick up where you left off.
              </p>
            </div>

            {/* Recent Workspaces */}
            <section className="mb-10 animate-fade-up" style={{ animationDelay: "50ms" }}>
              <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                Recent
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
                {recentWorkspaces.slice(0, 6).map((workspace, index) => (
                  <div 
                    key={workspace.id}
                    className="animate-slide-in-left"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <WorkspaceCard 
                      workspace={workspace} 
                      variant="compact" 
                      onClick={() => handleWorkspaceClick(workspace)}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* All Workspaces */}
            <section className="animate-fade-up" style={{ animationDelay: "100ms" }}>
              <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                All Workspaces
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* New Workspace CTA */}
                <NewWorkspaceCard onClick={() => setIsModalOpen(true)} variant="large" />
                
                {/* Workspace Cards */}
                {allWorkspaces.map((workspace, index) => (
                  <div 
                    key={workspace.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${(index + 1) * 50}ms` }}
                  >
                    <WorkspaceCard workspace={workspace} onClick={() => handleWorkspaceClick(workspace)} />
                  </div>
                ))}
              </div>
            </section>
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
