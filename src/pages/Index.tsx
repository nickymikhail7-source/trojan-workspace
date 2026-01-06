import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User } from "lucide-react";
import { ConversationalEntry } from "@/components/ConversationalEntry";

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal Top Bar */}
      <header className="h-14 border-b border-border/50 bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
        {/* Left: Wordmark */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Trojan
          </span>
        </div>

        {/* Center: Search (compact) */}
        <div className="hidden sm:flex flex-1 max-w-sm mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-9 pl-9 pr-4 bg-muted/50 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-muted transition-all duration-150"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right: Avatar */}
        <button className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors duration-150">
          <User className="h-4 w-4 text-muted-foreground" />
        </button>
      </header>
      
      {/* Main Content - Conversational Entry */}
      <main className="flex-1">
        <ConversationalEntry 
          userName="there" 
          recentWorkspaces={recentWorkspaces}
        />
      </main>
    </div>
  );
}
