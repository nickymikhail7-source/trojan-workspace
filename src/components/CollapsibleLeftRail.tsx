import { useState, useEffect } from "react";
import { 
  Home, 
  FolderKanban, 
  Clock, 
  LayoutTemplate, 
  Library, 
  Plus, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { TrojanLogo } from "./TrojanLogo";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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

const bottomNavItems: NavItem[] = [
  { icon: Settings, label: "Settings", id: "settings", path: "/settings" },
];

interface CollapsibleLeftRailProps {
  onNewWorkspace?: () => void;
}

export function CollapsibleLeftRail({ onNewWorkspace }: CollapsibleLeftRailProps) {
  const [isExpanded, setIsExpanded] = useState(() => {
    const stored = localStorage.getItem("trojan-sidebar-expanded");
    return stored ? JSON.parse(stored) : true;
  });
  
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
    if (path === "/settings") return "settings";
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
              ? "bg-sidebar-accent text-accent" 
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        <Icon className={cn("shrink-0", isExpanded ? "h-5 w-5" : "h-5 w-5")} />
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
    <nav className={cn(
      "border-r border-sidebar-border bg-sidebar flex flex-col shrink-0 transition-all duration-200",
      isExpanded ? "w-56" : "w-14"
    )}>
      {/* Logo */}
      <div className={cn(
        "h-14 flex items-center border-b border-sidebar-border shrink-0",
        isExpanded ? "px-4" : "justify-center"
      )}>
        <TrojanLogo showText={isExpanded} size="sm" />
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

      {/* Bottom Nav */}
      <div className={cn("py-3 border-t border-sidebar-border space-y-1", isExpanded ? "px-3" : "px-2")}>
        {bottomNavItems.map((item) => (
          <NavButton key={item.id} item={item} />
        ))}
        
        {/* User Profile */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={() => navigate("/settings")}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg transition-all duration-150 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isExpanded ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"
              )}
            >
              <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              {isExpanded && (
                <span className="text-sm font-medium truncate">Profile</span>
              )}
            </button>
          </TooltipTrigger>
          {!isExpanded && (
            <TooltipContent side="right" sideOffset={8}>
              Profile
            </TooltipContent>
          )}
        </Tooltip>
        
        {/* Collapse Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg transition-all duration-150 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mt-2",
            isExpanded ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"
          )}
        >
          {isExpanded ? (
            <>
              <ChevronLeft className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium">Collapse</span>
            </>
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </div>
    </nav>
  );
}
