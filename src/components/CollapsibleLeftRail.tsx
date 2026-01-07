import { useState, useEffect } from "react";
import { 
  Home, 
  FolderKanban, 
  Clock, 
  LayoutTemplate, 
  Library, 
  Plus, 
  Settings, 
  PanelLeftClose,
  PanelLeft,
  Sparkles,
  UserCircle,
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
  action?: "new-workspace";
};

const mainNavItems: NavItem[] = [
  { icon: Home, label: "Home", id: "home", path: "/" },
  { icon: FolderKanban, label: "Workspaces", id: "workspaces", path: "/workspaces" },
  { icon: Clock, label: "Recent", id: "recent", path: "/recent" },
  { icon: LayoutTemplate, label: "Templates", id: "templates", path: "/templates" },
  { icon: Library, label: "Library", id: "library", path: "/library" },
];

const actionItems: NavItem[] = [
  { icon: Plus, label: "New Workspace", id: "new", action: "new-workspace" },
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
    if (path === "/") return "home";
    if (path.startsWith("/workspace")) return "workspaces";
    if (path === "/recent") return "recent";
    if (path === "/templates") return "templates";
    if (path === "/library") return "library";
    return "home";
  };

  const activeItem = getActiveItem();

  const handleItemClick = (item: NavItem) => {
    if (item.action === "new-workspace") {
      onNewWorkspace?.();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const NavButton = ({ item }: { item: NavItem }) => {
    const isActive = activeItem === item.id;
    const Icon = item.icon;
    const isNewWorkspace = item.action === "new-workspace";

    const button = (
      <button
        onClick={() => handleItemClick(item)}
        className={cn(
          "w-full flex items-center gap-3 rounded-lg transition-all duration-150",
          isExpanded ? "px-3 py-2.5" : "px-0 py-2.5 justify-center",
          isNewWorkspace
            ? "bg-accent text-accent-foreground hover:bg-accent/90"
            : isActive 
              ? "bg-secondary/80 text-foreground" 
              : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {isExpanded && (
          <span className="text-sm font-medium truncate">{item.label}</span>
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
            {item.label}
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
        isExpanded ? "w-56" : "w-14"
      )}>
        {/* Header - Logo & Toggle */}
        <div className={cn(
          "h-14 flex items-center shrink-0 border-b border-border",
          isExpanded ? "px-4 justify-between" : "px-0 justify-center"
        )}>
          {isExpanded && <TrojanLogo showText={true} size="sm" />}
          
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

        {/* Main Nav */}
        <div className={cn("flex-1 py-3 space-y-1", isExpanded ? "px-3" : "px-2")}>
          {mainNavItems.map((item) => (
            <NavButton key={item.id} item={item} />
          ))}
          
          <div className="pt-2">
            {actionItems.map((item) => (
              <NavButton key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className={cn("py-3 border-t border-border", isExpanded ? "px-3" : "px-2")}>
          <Popover open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg transition-all duration-150 text-foreground hover:bg-secondary/50",
                  isExpanded ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"
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
