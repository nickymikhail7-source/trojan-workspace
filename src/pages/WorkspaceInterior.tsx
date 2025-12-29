import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, GitBranch, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/TopBar";
import { LeftRail } from "@/components/LeftRail";
import { NewWorkspaceModal } from "@/components/NewWorkspaceModal";
import { useToast } from "@/hooks/use-toast";

// Sample branches data
interface Branch {
  id: string;
  title: string;
  createdAt: string;
}

const sampleBranches: Branch[] = [
  { id: "1", title: "Trojan bb", createdAt: "28/12/2025" },
];

// Sample workspace names
const workspaceNames: Record<string, string> = {
  "1": "Trojan V1",
  "2": "Series A Pitch Deck",
  "3": "API Architecture Review",
};

export default function WorkspaceInterior() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [branches, setBranches] = useState<Branch[]>(sampleBranches);
  const [activeNav, setActiveNav] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const workspaceName = workspaceNames[id || "1"] || "Workspace";

  const handleNavClick = (navId: string) => {
    setActiveNav(navId);
    if (navId === "home") navigate("/");
    else if (navId === "recent") navigate("/recent");
    else if (navId === "templates") navigate("/templates");
    else if (navId === "library") navigate("/library");
    else if (navId === "settings") navigate("/settings");
  };

  const handleNewBranch = () => {
    const newBranch: Branch = {
      id: Date.now().toString(),
      title: `New Branch ${branches.length + 1}`,
      createdAt: new Date().toLocaleDateString("en-GB"),
    };
    setBranches([...branches, newBranch]);
    toast({
      title: "Branch created",
      description: `"${newBranch.title}" has been created.`,
    });
  };

  const handleCreateWorkspace = (type: string) => {
    setIsModalOpen(false);
    toast({
      title: "Workspace created",
      description: `Your new ${type} workspace is ready.`,
    });
    navigate("/");
  };

  const handleBranchClick = (branchId: string) => {
    toast({
      title: "Opening branch",
      description: "Branch view coming soon.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar onNewWorkspace={() => setIsModalOpen(true)} />
      
      <div className="flex flex-1 overflow-hidden">
        <LeftRail activeItem={activeNav} onItemClick={handleNavClick} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-6">
            {/* Back Link */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Workspaces
            </button>

            {/* Branches Section */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-3">
                <GitBranch className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Branches</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Thinking tracks for {workspaceName}
                  </p>
                </div>
              </div>
              
              <Button onClick={handleNewBranch} size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                New Branch
              </Button>
            </div>

            {/* Branch Cards */}
            <div className="space-y-3">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  onClick={() => handleBranchClick(branch.id)}
                  className="p-4 bg-card border border-border rounded-lg hover:border-border/80 hover:shadow-sm transition-all cursor-pointer"
                >
                  <h3 className="font-medium text-foreground">{branch.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Created {branch.createdAt}
                  </p>
                </div>
              ))}
            </div>
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
