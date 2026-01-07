import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConversationalEntry } from "@/components/ConversationalEntry";
import { CollapsibleLeftRail } from "@/components/CollapsibleLeftRail";
import { NewWorkspaceModal } from "@/components/NewWorkspaceModal";
import { useToast } from "@/hooks/use-toast";

// Sample recent workspaces data
const recentWorkspaces = [
  {
    id: "1",
    title: "Q1 Product Strategy",
    lastActive: "3 hours ago",
    preview: "Let's break down the key priorities for Q1...",
  },
  {
    id: "2",
    title: "Series A Pitch Deck",
    lastActive: "Yesterday",
    preview: "Here's my analysis of your pitch structure...",
  },
  {
    id: "3",
    title: "API Architecture Review",
    lastActive: "2 days ago",
    preview: "The core challenge is finding the right balance...",
  },
  {
    id: "4",
    title: "User Research: Onboarding",
    lastActive: "3 days ago",
    preview: "Based on the user interviews, I see patterns...",
  },
];

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
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
    navigate("/workspace/new");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <CollapsibleLeftRail onNewWorkspace={() => setIsModalOpen(true)} />
      
      {/* Main Content - Conversational Entry */}
      <main className="flex-1 overflow-y-auto">
        <ConversationalEntry />
      </main>

      <NewWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateWorkspace}
      />
    </div>
  );
}
