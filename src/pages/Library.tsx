import { useState } from "react";
import { Library as LibraryIcon, FileText, Layers, Lightbulb, Target, Search, Filter } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { LeftRail } from "@/components/LeftRail";
import { NewWorkspaceModal } from "@/components/NewWorkspaceModal";
import { EmptyState } from "@/components/EmptyState";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Artifact {
  id: string;
  title: string;
  type: "doc" | "diagram" | "idea" | "decision";
  workspaceTitle: string;
  updatedAt: string;
}

const artifactIcons: Record<string, LucideIcon> = {
  doc: FileText,
  diagram: Layers,
  idea: Lightbulb,
  decision: Target,
};

const artifacts: Artifact[] = [
  { id: "1", title: "Product Requirements v2", type: "doc", workspaceTitle: "Q1 Product Strategy", updatedAt: "2 hours ago" },
  { id: "2", title: "System Architecture Diagram", type: "diagram", workspaceTitle: "API Architecture Review", updatedAt: "Yesterday" },
  { id: "3", title: "Pricing Model Ideas", type: "idea", workspaceTitle: "Series A Pitch Deck", updatedAt: "2 days ago" },
  { id: "4", title: "Tech Stack Decision", type: "decision", workspaceTitle: "API Architecture Review", updatedAt: "3 days ago" },
  { id: "5", title: "User Interview Notes", type: "doc", workspaceTitle: "User Research: Onboarding", updatedAt: "4 days ago" },
  { id: "6", title: "Competitor Matrix", type: "diagram", workspaceTitle: "Competitor Analysis 2024", updatedAt: "5 days ago" },
  { id: "7", title: "Feature Prioritization", type: "decision", workspaceTitle: "Q1 Product Strategy", updatedAt: "1 week ago" },
  { id: "8", title: "Brand Voice Guidelines", type: "doc", workspaceTitle: "Brand Guidelines v2", updatedAt: "1 week ago" },
];

const types = ["All", "Documents", "Diagrams", "Ideas", "Decisions"];
const typeMap: Record<string, string> = {
  "Documents": "doc",
  "Diagrams": "diagram",
  "Ideas": "idea",
  "Decisions": "decision",
};

export default function Library() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("library");
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    if (id === "home") navigate("/");
    else if (id === "recent") navigate("/recent");
    else if (id === "templates") navigate("/templates");
    else if (id === "settings") navigate("/settings");
  };

  const handleArtifactClick = (artifact: Artifact) => {
    toast({
      title: `Opening "${artifact.title}"`,
      description: `From ${artifact.workspaceTitle}`,
    });
  };

  const handleCreateWorkspace = (type: string) => {
    setIsModalOpen(false);
    toast({
      title: "Workspace created",
      description: `Your new ${type} workspace is ready.`,
    });
  };

  const filteredArtifacts = artifacts.filter((a) => {
    const matchesType = selectedType === "All" || a.type === typeMap[selectedType];
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         a.workspaceTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar onNewWorkspace={() => setIsModalOpen(true)} />
      
      <div className="flex flex-1 overflow-hidden">
        <LeftRail activeItem={activeNav} onItemClick={handleNavClick} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8 animate-fade-up flex items-center gap-3">
              <LibraryIcon className="h-6 w-6 text-muted-foreground" />
              <div>
                <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                  Library
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  All artifacts across your workspaces.
                </p>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-up" style={{ animationDelay: "50ms" }}>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search artifacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 whitespace-nowrap",
                      selectedType === type
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Artifacts List */}
            {filteredArtifacts.length === 0 ? (
              <EmptyState
                icon={LibraryIcon}
                title="No artifacts found"
                description={searchQuery ? "Try adjusting your search or filters." : "Artifacts you create in workspaces will appear here."}
              />
            ) : (
              <div className="space-y-2">
                {filteredArtifacts.map((artifact, index) => {
                  const Icon = artifactIcons[artifact.type];
                  return (
                    <button
                      key={artifact.id}
                      onClick={() => handleArtifactClick(artifact)}
                      className="w-full flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-surface-hover text-left transition-colors duration-150 animate-fade-up"
                      style={{ animationDelay: `${(index + 2) * 50}ms` }}
                    >
                      <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{artifact.title}</p>
                        <p className="text-xs text-muted-foreground">{artifact.workspaceTitle}</p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{artifact.updatedAt}</span>
                    </button>
                  );
                })}
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
