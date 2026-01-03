import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, GitBranch, Plus, Edit2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TopBar } from "@/components/TopBar";
import { LeftRail } from "@/components/LeftRail";
import { NewWorkspaceModal } from "@/components/NewWorkspaceModal";
import { NewBranchModal } from "@/components/NewBranchModal";
import { RenameBranchModal } from "@/components/RenameBranchModal";
import { DeleteBranchModal } from "@/components/DeleteBranchModal";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample branches data
interface Branch {
  id: string;
  title: string;
  createdAt: string;
}

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

export default function WorkspaceInterior() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const isNewWorkspace = id?.startsWith("new-");
  const workspaceType = searchParams.get("type") || "blank";
  
  const [workspaceName, setWorkspaceName] = useState(() => {
    if (isNewWorkspace) {
      return "Untitled Workspace";
    }
    return existingWorkspaceNames[id || "1"] || "Workspace";
  });
  const [isEditingName, setIsEditingName] = useState(isNewWorkspace);
  const [branches, setBranches] = useState<Branch[]>(() => {
    if (isNewWorkspace) {
      return [];
    }
    return [{ id: "1", title: "Main Branch", createdAt: new Date().toLocaleDateString("en-GB") }];
  });
  const [activeNav, setActiveNav] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [renameModalState, setRenameModalState] = useState<{ isOpen: boolean; branch: Branch | null }>({ isOpen: false, branch: null });
  const [deleteModalState, setDeleteModalState] = useState<{ isOpen: boolean; branch: Branch | null }>({ isOpen: false, branch: null });

  const handleNavClick = (navId: string) => {
    setActiveNav(navId);
    if (navId === "home") navigate("/");
    else if (navId === "recent") navigate("/recent");
    else if (navId === "templates") navigate("/templates");
    else if (navId === "library") navigate("/library");
    else if (navId === "settings") navigate("/settings");
  };

  const handleNewBranch = () => {
    setIsBranchModalOpen(true);
  };

  const handleCreateBranch = (name: string) => {
    const newBranch: Branch = {
      id: Date.now().toString(),
      title: name,
      createdAt: new Date().toLocaleDateString("en-GB"),
    };
    setBranches([...branches, newBranch]);
    toast({
      title: "Branch created",
      description: `"${newBranch.title}" has been created.`,
    });
  };

  const handleRenameBranch = (branchId: string, newName: string) => {
    setBranches(branches.map(b => 
      b.id === branchId ? { ...b, title: newName } : b
    ));
    toast({
      title: "Branch renamed",
      description: `Branch is now "${newName}".`,
    });
  };

  const handleDeleteBranch = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    setBranches(branches.filter(b => b.id !== branchId));
    toast({
      description: `"${branch?.title}" has been deleted.`,
    });
  };

  const handleCreateWorkspace = (type: string) => {
    setIsModalOpen(false);
    const newId = `new-${Date.now()}`;
    toast({
      title: "Workspace created",
      description: `Your new ${type} workspace is ready.`,
    });
    navigate(`/workspace/${newId}?type=${type}`);
  };

  const handleBranchClick = (branchId: string) => {
    navigate(`/workspace/${id}/branch/${branchId}`);
  };

  const handleNameSave = () => {
    setIsEditingName(false);
    if (workspaceName.trim() === "") {
      setWorkspaceName("Untitled Workspace");
    }
    toast({
      title: "Workspace renamed",
      description: `Workspace is now "${workspaceName}".`,
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
                  <div className="flex items-center gap-2 mt-0.5">
                    {isEditingName ? (
                      <Input
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        onBlur={handleNameSave}
                        onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
                        className="h-7 text-sm w-64"
                        autoFocus
                        placeholder="Enter workspace name..."
                      />
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground">
                          Thinking tracks for {workspaceName}
                        </p>
                        <button
                          onClick={() => setIsEditingName(true)}
                          className="p-1 hover:bg-secondary rounded transition-colors"
                        >
                          <Edit2 className="h-3 w-3 text-muted-foreground" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <Button onClick={handleNewBranch} size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                New Branch
              </Button>
            </div>

            {/* Empty State for New Workspace */}
            {branches.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <GitBranch className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Start your first branch
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">
                  Branches are thinking tracks where you can explore ideas, have conversations with AI, and create artifacts.
                </p>
                <Button onClick={handleNewBranch} className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  Create First Branch
                </Button>
              </div>
            )}

            {/* Branch Cards */}
            {branches.length > 0 && (
              <div className="space-y-3">
                {branches.map((branch) => (
                  <div
                    key={branch.id}
                    className="group p-4 bg-card border border-border rounded-lg hover:border-border/80 hover:shadow-sm transition-all cursor-pointer flex items-start justify-between"
                  >
                    <div
                      onClick={() => handleBranchClick(branch.id)}
                      className="flex-1"
                    >
                      <h3 className="font-medium text-foreground">{branch.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Created {branch.createdAt}
                      </p>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setRenameModalState({ isOpen: true, branch });
                          }}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteModalState({ isOpen: true, branch });
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

      <NewBranchModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        onCreate={handleCreateBranch}
      />

      <RenameBranchModal
        isOpen={renameModalState.isOpen}
        currentName={renameModalState.branch?.title || ""}
        onClose={() => setRenameModalState({ isOpen: false, branch: null })}
        onRename={(newName) => {
          if (renameModalState.branch) {
            handleRenameBranch(renameModalState.branch.id, newName);
          }
        }}
      />

      <DeleteBranchModal
        isOpen={deleteModalState.isOpen}
        branchName={deleteModalState.branch?.title || ""}
        onClose={() => setDeleteModalState({ isOpen: false, branch: null })}
        onDelete={() => {
          if (deleteModalState.branch) {
            handleDeleteBranch(deleteModalState.branch.id);
          }
        }}
      />
    </div>
  );
}
