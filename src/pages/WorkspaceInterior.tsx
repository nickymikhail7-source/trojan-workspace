import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, Share2, MoreHorizontal, PanelLeftClose, PanelRightClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BranchPanel } from "@/components/workspace/BranchPanel";
import { ChatInterface } from "@/components/workspace/ChatInterface";
import { ArtifactsPanel } from "@/components/workspace/ArtifactsPanel";
import { useToast } from "@/hooks/use-toast";

// Sample data
const sampleBranches = [
  { id: "1", title: "Main Thread", isActive: true, messageCount: 12 },
  { id: "2", title: "Pricing Discussion", isActive: false, messageCount: 5 },
  { id: "3", title: "Technical Spec", isActive: false, messageCount: 8 },
];

const sampleArtifacts = [
  { id: "1", type: "doc" as const, title: "Product Requirements", updatedAt: "2 hours ago" },
  { id: "2", type: "diagram" as const, title: "System Architecture", updatedAt: "Yesterday" },
  { id: "3", type: "idea" as const, title: "Pricing Models", updatedAt: "3 days ago" },
  { id: "4", type: "decision" as const, title: "Tech Stack Choice", updatedAt: "1 week ago" },
];

const sampleMessages = [
  { id: "1", role: "user" as const, content: "Let's explore the key features for our MVP.", timestamp: "10:30 AM", status: "complete" as const },
  { id: "2", role: "assistant" as const, content: "I'd suggest focusing on three core features for the MVP:\n\n1. **User Authentication** - Essential for personalization and security\n2. **Core Workspace** - The main canvas for thinking and collaboration\n3. **Basic Artifacts** - Documents and diagrams to capture insights\n\nWould you like to dive deeper into any of these?", timestamp: "10:31 AM", status: "complete" as const },
  { id: "3", role: "user" as const, content: "Yes, let's start with the workspace design.", timestamp: "10:33 AM", status: "complete" as const },
];

export default function WorkspaceInterior() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeBranchId, setActiveBranchId] = useState("1");
  const [messages, setMessages] = useState(sampleMessages);
  const [chatStatus, setChatStatus] = useState<"idle" | "streaming" | "stopped" | "error">("idle");
  const [showBranches, setShowBranches] = useState(true);
  const [showArtifacts, setShowArtifacts] = useState(true);

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "complete" as const,
    };
    setMessages([...messages, newMessage]);
    
    // Simulate AI response
    setChatStatus("streaming");
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: "I'm thinking about your message. This is a simulated response to demonstrate the chat interface. In a real implementation, this would be connected to an AI backend.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "complete" as const,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setChatStatus("idle");
    }, 1500);
  };

  const handleNewBranch = () => {
    toast({
      title: "New branch",
      description: "Branch creation coming soon.",
    });
  };

  const handleNewArtifact = () => {
    toast({
      title: "New artifact",
      description: "Artifact creation coming soon.",
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <header className="h-12 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-4 w-px bg-border" />
          <h1 className="text-sm font-medium text-foreground">Q1 Product Strategy</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowBranches(!showBranches)}>
            <PanelLeftClose className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowArtifacts(!showArtifacts)}>
            <PanelRightClose className="h-4 w-4" />
          </Button>
          <div className="h-4 w-px bg-border" />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Branch Panel */}
        {showBranches && (
          <BranchPanel
            branches={sampleBranches}
            activeBranchId={activeBranchId}
            onBranchSelect={setActiveBranchId}
            onNewBranch={handleNewBranch}
          />
        )}

        {/* Chat Area */}
        <ChatInterface
          messages={messages}
          status={chatStatus}
          onSendMessage={handleSendMessage}
          onStopGeneration={() => setChatStatus("stopped")}
          onRetry={() => setChatStatus("idle")}
        />

        {/* Artifacts Panel */}
        {showArtifacts && (
          <ArtifactsPanel
            artifacts={sampleArtifacts}
            onArtifactSelect={(id) => toast({ title: "Opening artifact", description: `Artifact ${id} selected.` })}
            onNewArtifact={handleNewArtifact}
          />
        )}
      </div>
    </div>
  );
}
