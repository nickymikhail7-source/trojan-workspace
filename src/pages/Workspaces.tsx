import { useState, useEffect } from "react";
import { FolderKanban, Search, MoreVertical, Pencil, Trash2, GitBranch } from "lucide-react";
import { CollapsibleLeftRail } from "@/components/CollapsibleLeftRail";
import { NewWorkspaceModal } from "@/components/NewWorkspaceModal";
import { RenameWorkspaceModal } from "@/components/RenameWorkspaceModal";
import { EmptyState } from "@/components/EmptyState";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Workspace {
  id: string;
  title: string;
  lastActive: string;
  branchCount: number;
  tags: string[];
}

// Default sample workspaces
const defaultWorkspaces: Workspace[] = [
  {
    id: "1",
    title: "Q1 Product Strategy",
    lastActive: "Active 3 hours ago",
    branchCount: 3,
    tags: ["Strategy", "Planning"],
  },
  {
    id: "2",
    title: "Series A Pitch Deck",
    lastActive: "Active yesterday",
    branchCount: 1,
    tags: ["Pitch"],
  },
  {
    id: "3",
    title: "API Architecture Review",
    lastActive: "Active 2 days ago",
    branchCount: 5,
    tags: ["Architecture"],
  },
  {
    id: "4",
    title: "User Research: Onboarding",
    lastActive: "Active 3 days ago",
    branchCount: 2,
    tags: ["Research", "Design"],
  },
  {
    id: "5",
    title: "Competitor Analysis 2024",
    lastActive: "Active 5 days ago",
    branchCount: 1,
    tags: ["Research", "Strategy"],
  },
  {
    id: "6",
    title: "Brand Guidelines v2",
    lastActive: "Active 1 week ago",
    branchCount: 2,
    tags: ["Brand", "Design"],
  },
];

const STORAGE_KEY = "trojan-workspaces";

export default function Workspaces() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [workspaceToRename, setWorkspaceToRename] = useState<Workspace | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load workspaces from localStorage, merge with defaults
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const savedWorkspaces = JSON.parse(saved);
      // Merge saved with defaults (avoid duplicates)
      const defaultIds = new Set(defaultWorkspaces.map(w => w.id));
      const userWorkspaces = savedWorkspaces.filter((w: Workspace) => !defaultIds.has(w.id));
      setWorkspaces([...userWorkspaces, ...defaultWorkspaces]);
    } else {
      setWorkspaces(defaultWorkspaces);
    }
  }, []);

  const handleWorkspaceClick = (workspace: Workspace) => {
    // Navigate directly to main branch of the workspace
    navigate(`/workspace/${workspace.id}/branch/main`);
  };

  const handleCreateWorkspace = (type: string) => {
    setIsModalOpen(false);
    const newId = `new-${Date.now()}`;
    const newWorkspace: Workspace = {
      id: newId,
      title: `New ${type} Workspace`,
      lastActive: "Just now",
      branchCount: 1,
      tags: [type],
    };
    
    // Save to localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    const existing = saved ? JSON.parse(saved) : [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newWorkspace, ...existing]));
    
    setWorkspaces(prev => [newWorkspace, ...prev]);
    
    toast({
      title: "Workspace created",
      description: `Your new ${type} workspace is ready.`,
    });
    
    navigate(`/workspace/${newId}/branch/main`);
  };

  const handleRenameWorkspace = (workspace: Workspace) => {
    setWorkspaceToRename(workspace);
    setIsRenameModalOpen(true);
  };

  const handleRenameConfirm = (newName: string) => {
    if (!workspaceToRename) return;
    
    // Update state
    setWorkspaces(prev => prev.map(w => 
      w.id === workspaceToRename.id ? { ...w, title: newName } : w
    ));
    
    // Update localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const existing = JSON.parse(saved);
      const updated = existing.map((w: Workspace) => 
        w.id === workspaceToRename.id ? { ...w, title: newName } : w
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    
    setIsRenameModalOpen(false);
    setWorkspaceToRename(null);
    
    toast({
      title: "Workspace renamed",
      description: `Renamed to "${newName}"`,
    });
  };

  const handleDeleteWorkspace = (workspace: Workspace) => {
    // Remove from state
    setWorkspaces(prev => prev.filter(w => w.id !== workspace.id));
    
    // Remove from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const existing = JSON.parse(saved);
      const updated = existing.filter((w: Workspace) => w.id !== workspace.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    
    toast({
      title: "Workspace deleted",
      description: `"${workspace.title}" has been deleted.`,
      variant: "destructive",
    });
  };

  const filteredWorkspaces = workspaces.filter((w) =>
    w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background flex">
      <CollapsibleLeftRail onNewWorkspace={() => setIsModalOpen(true)} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8 animate-fade-up flex items-center gap-3">
            <FolderKanban className="h-6 w-6 text-muted-foreground" />
            <div>
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                Workspaces
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                All your thinking spaces in one place.
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6 animate-fade-up" style={{ animationDelay: "50ms" }}>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search workspaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          {/* Workspaces Grid */}
          {filteredWorkspaces.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No workspaces found"
              description={searchQuery ? "Try adjusting your search." : "Create your first workspace to get started."}
              actionLabel="Create Workspace"
              onAction={() => setIsModalOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWorkspaces.map((workspace, index) => (
                <div
                  key={workspace.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${(index + 1) * 50}ms` }}
                >
                  <div
                    className="workspace-card group cursor-pointer hover:border-accent/30"
                    onClick={() => handleWorkspaceClick(workspace)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-foreground text-sm line-clamp-1 flex-1">
                        {workspace.title}
                      </h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          onClick={(e) => e.stopPropagation()}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 -mr-1 rounded hover:bg-surface-hover"
                        >
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleRenameWorkspace(workspace);
                          }}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteWorkspace(workspace);
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <GitBranch className="h-3.5 w-3.5" />
                        {workspace.branchCount} {workspace.branchCount === 1 ? "branch" : "branches"}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {workspace.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-secondary text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {workspace.lastActive}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <NewWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateWorkspace}
      />

      <RenameWorkspaceModal
        isOpen={isRenameModalOpen}
        currentName={workspaceToRename?.title || ""}
        onClose={() => {
          setIsRenameModalOpen(false);
          setWorkspaceToRename(null);
        }}
        onRename={handleRenameConfirm}
      />
    </div>
  );
}
