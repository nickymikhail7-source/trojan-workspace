import { useState, useEffect } from "react";
import { 
  PenSquare,
  Search,
  ImageIcon,
  LayoutGrid,
  Code,
  Bot,
  FolderPlus,
  Folder,
  MessageSquare,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
  UserCircle,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { TrojanLogo } from "./TrojanLogo";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type NavItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  id: string;
  path?: string;
  badge?: string;
  action?: string;
};

const mainNavItems: NavItem[] = [
  { icon: PenSquare, label: "New chat", id: "new-chat", path: "/" },
  { icon: Search, label: "Search chats", id: "search", path: "/search" },
  { icon: ImageIcon, label: "Images", id: "images", path: "/images", badge: "NEW" },
  { icon: LayoutGrid, label: "Apps", id: "apps", path: "/apps" },
  { icon: Code, label: "Codex", id: "codex", path: "/codex" },
  { icon: Bot, label: "GPTs", id: "gpts", path: "/gpts" },
];

const sampleProjects = [
  { id: "kloudfarm", name: "Kloudfarm" },
  { id: "convo", name: "Convo" },
];

const sampleChats = [
  { id: "chat-1", name: "Trojan AI Misadventures", active: true },
  { id: "chat-2", name: "Resume review summary", active: false },
  { id: "chat-3", name: "Self-Review Assessment: Skil...", active: false },
];

interface CollapsibleLeftRailProps {
  onNewWorkspace?: () => void;
}

export function CollapsibleLeftRail({ onNewWorkspace }: CollapsibleLeftRailProps) {
  const [isExpanded, setIsExpanded] = useState(() => {
    const stored = localStorage.getItem("trojan-sidebar-expanded");
    return stored ? JSON.parse(stored) : true;
  });
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("trojan-sidebar-expanded", JSON.stringify(isExpanded));
  }, [isExpanded]);

  const getActiveItem = () => {
    const path = location.pathname;
    if (path === "/") return "new-chat";
    if (path.startsWith("/search")) return "search";
    if (path.startsWith("/images")) return "images";
    if (path.startsWith("/apps")) return "apps";
    if (path.startsWith("/codex")) return "codex";
    if (path.startsWith("/gpts")) return "gpts";
    return "";
  };

  const activeItem = getActiveItem();

  const handleNavClick = (item: NavItem) => {
    if (item.path) {
      navigate(item.path);
    }
  };

  const NavButton = ({ item }: { item: NavItem }) => {
    const isActive = activeItem === item.id;
    const Icon = item.icon;

    const button = (
      <button
        onClick={() => handleNavClick(item)}
        className={cn(
          "w-full flex items-center gap-3 rounded-lg transition-all duration-150",
          isExpanded ? "px-3 py-2" : "px-0 py-2 justify-center",
          isActive 
            ? "bg-secondary/80 text-foreground" 
            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {isExpanded && (
          <span className="text-sm truncate flex-1 text-left">{item.label}</span>
        )}
        {isExpanded && item.badge && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
            {item.badge}
          </span>
        )}
      </button>
    );

    if (!isExpanded) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            <div className="flex items-center gap-2">
              {item.label}
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary">
                  {item.badge}
                </span>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  };

  return (
    <TooltipProvider>
      <nav className={cn(
        "border-r border-border bg-background flex flex-col shrink-0 transition-all duration-200 h-screen",
        isExpanded ? "w-64" : "w-14"
      )}>
        {/* Header - Logo & Toggle */}
        <div className={cn(
          "h-14 flex items-center justify-between shrink-0",
          isExpanded ? "px-4" : "px-2"
        )}>
          <TrojanLogo showText={false} size="sm" />
          
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              >
                {isExpanded ? (
                  <PanelLeftClose className="h-5 w-5" />
                ) : (
                  <PanelLeft className="h-5 w-5" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {isExpanded ? "Close sidebar" : "Open sidebar"}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Main Navigation */}
        <div className={cn("py-2 space-y-0.5", isExpanded ? "px-3" : "px-2")}>
          {mainNavItems.map((item) => (
            <NavButton key={item.id} item={item} />
          ))}
        </div>

        {/* Projects Section */}
        {isExpanded && (
          <div className="px-3 py-4">
            <h3 className="text-xs font-medium text-muted-foreground px-3 mb-2">
              Projects
            </h3>
            <div className="space-y-0.5">
              <button
                onClick={onNewWorkspace}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
              >
                <FolderPlus className="h-5 w-5 shrink-0" />
                <span className="text-sm">New project</span>
              </button>
              {sampleProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => navigate(`/workspace/${project.id}`)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
                >
                  <Folder className="h-5 w-5 shrink-0" />
                  <span className="text-sm truncate">{project.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Your Chats Section */}
        {isExpanded && (
          <div className="flex-1 px-3 py-2 overflow-y-auto">
            <h3 className="text-xs font-medium text-muted-foreground px-3 mb-2">
              Your chats
            </h3>
            <div className="space-y-0.5">
              {sampleChats.map((chat) => (
                <button
                  key={chat.id}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left",
                    chat.active
                      ? "bg-secondary/80 text-foreground"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  <MessageSquare className="h-4 w-4 shrink-0 opacity-0" />
                  <span className="text-sm truncate">{chat.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Collapsed state - show icon-only for projects/chats */}
        {!isExpanded && (
          <div className="flex-1 py-2 px-2 space-y-0.5">
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={onNewWorkspace}
                  className="w-full flex items-center justify-center py-2 rounded-lg text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
                >
                  <FolderPlus className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">New project</TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* User Profile */}
        <div className={cn("py-3 border-t border-border", isExpanded ? "px-3" : "px-2")}>
          <Popover open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg transition-all duration-150 text-foreground hover:bg-secondary/50",
                  isExpanded ? "px-3 py-2" : "px-0 py-2 justify-center"
                )}
              >
                <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center shrink-0 text-white font-medium text-sm">
                  N
                </div>
                {isExpanded && (
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-sm font-medium truncate">Nikhil Devlapur</div>
                    <div className="text-xs text-muted-foreground">Plus</div>
                  </div>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent 
              side={isExpanded ? "top" : "right"} 
              align="start"
              className="w-64 p-0 bg-popover border-border"
            >
              {/* User Info Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-medium">
                    ND
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">Nikhil Devlapur</div>
                    <div className="text-xs text-muted-foreground">@devlapurnikhil</div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/50 transition-colors">
                  <Sparkles className="h-4 w-4" />
                  <span>Upgrade plan</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/50 transition-colors">
                  <UserCircle className="h-4 w-4" />
                  <span>Personalization</span>
                </button>
                <button 
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate("/settings");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/50 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
              </div>

              <div className="border-t border-border py-2">
                <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-foreground hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-4 w-4" />
                    <span>Help</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/50 transition-colors">
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </nav>
    </TooltipProvider>
  );
}
