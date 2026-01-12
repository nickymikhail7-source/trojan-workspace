import { useState, useEffect } from "react";
import { 
  Home, 
  FolderKanban, 
  Clock, 
  LayoutTemplate, 
  Bookmark, 
  Plus, 
  Settings, 
  PanelLeftClose,
  PanelLeft,
  HelpCircle,
  LogOut,
  ChevronRight,
  ChevronDown,
  Moon
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { TrojanLogo } from "./TrojanLogo";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type NavItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  id: string;
  path?: string;
  action?: "new-project";
};

// Primary navigation - always visible
const primaryNavItems: NavItem[] = [
  { icon: Home, label: "Home", id: "home", path: "/" },
  { icon: Clock, label: "Recent", id: "recent", path: "/recent" },
];

// Secondary navigation - inside collapsible "Organize" section
const organizeNavItems: NavItem[] = [
  { icon: FolderKanban, label: "Projects", id: "projects", path: "/workspaces" },
  { icon: Bookmark, label: "Saved", id: "saved", path: "/library" },
  { icon: LayoutTemplate, label: "Templates", id: "templates", path: "/templates" },
];

// Utility navigation - Help & Settings
const utilityNavItems: NavItem[] = [
  { icon: HelpCircle, label: "Help", id: "help" },
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
  const [isOrganizeOpen, setIsOrganizeOpen] = useState(() => {
    const stored = localStorage.getItem("trojan-organize-open");
    return stored ? JSON.parse(stored) : false;
  });
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem("trojan-dark-mode");
    if (stored !== null) return JSON.parse(stored);
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("trojan-sidebar-expanded", JSON.stringify(isExpanded));
  }, [isExpanded]);

  useEffect(() => {
    localStorage.setItem("trojan-organize-open", JSON.stringify(isOrganizeOpen));
  }, [isOrganizeOpen]);

  useEffect(() => {
    localStorage.setItem("trojan-dark-mode", JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const getActiveItem = () => {
    const path = location.pathname;
    if (path === "/") return "home";
    if (path.startsWith("/workspace")) return "projects";
    if (path === "/recent") return "recent";
    if (path === "/templates") return "templates";
    if (path === "/library") return "saved";
    if (path === "/settings") return "settings";
    return "home";
  };

  const activeItem = getActiveItem();

  const handleItemClick = (item: NavItem) => {
    if (item.action === "new-project") {
      onNewWorkspace?.();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const NavButton = ({ item, isSecondary = false }: { item: NavItem; isSecondary?: boolean }) => {
    const isActive = activeItem === item.id;
    const Icon = item.icon;

    const button = (
      <button
        onClick={() => handleItemClick(item)}
        className={cn(
          "w-full flex items-center gap-3 rounded-lg transition-all duration-150 relative",
          isExpanded ? "px-3 py-2" : "px-0 py-2 justify-center",
          isSecondary && isExpanded && "pl-6",
          isActive 
            ? "bg-accent/10 text-foreground" 
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        )}
      >
        {/* Active indicator bar */}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full" />
        )}
        <Icon className={cn("h-4 w-4 shrink-0", isActive && "text-foreground")} />
        {isExpanded && (
          <span className={cn(
            "text-sm truncate",
            isActive ? "font-medium" : "font-normal"
          )}>
            {item.label}
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
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  };

  const ActionButton = () => {
    const button = (
      <button
        onClick={() => onNewWorkspace?.()}
        className={cn(
          "w-full flex items-center gap-3 rounded-lg transition-all duration-150",
          isExpanded ? "px-3 py-2" : "px-0 py-2 justify-center",
          "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        )}
      >
        <Plus className="h-4 w-4 shrink-0" />
        {isExpanded && (
          <span className="text-sm font-normal">New Project</span>
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
            New Project
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
                className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
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
        <div className={cn("flex-1 py-4 flex flex-col", isExpanded ? "px-3" : "px-2")}>
          {/* Primary Nav - Always Visible */}
          <div className="space-y-1">
            {primaryNavItems.map((item) => (
              <NavButton key={item.id} item={item} />
            ))}
          </div>
          
          {/* Organize Section - Collapsible */}
          <div className="mt-6">
            {isExpanded ? (
              <Collapsible open={isOrganizeOpen} onOpenChange={setIsOrganizeOpen}>
                <CollapsibleTrigger className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground/60 hover:text-muted-foreground transition-colors">
                  {isOrganizeOpen ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                  <span>Organize</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 mt-1">
                  {organizeNavItems.map((item) => (
                    <NavButton key={item.id} item={item} isSecondary />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              // When collapsed, show organize items as regular items with separator
              <div className="space-y-1 pt-2 border-t border-border/50">
                {organizeNavItems.map((item) => (
                  <NavButton key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* New Project - Secondary Action */}
          <div className="pt-4 border-t border-border/50">
            <ActionButton />
          </div>

          {/* Utility Section - Help & Settings */}
          <div className="pt-4 space-y-1">
            {utilityNavItems.map((item) => (
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
                  "w-full flex items-center gap-3 rounded-lg transition-all duration-150 text-foreground hover:bg-muted/50",
                  isExpanded ? "px-3 py-2" : "px-0 py-2 justify-center"
                )}
              >
                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0 text-muted-foreground font-medium text-xs">
                  N
                </div>
                {isExpanded && (
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-sm font-medium truncate">Nikhil Devlapur</div>
                    <div className="text-xs text-muted-foreground">Free Plan</div>
                  </div>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent 
              side={isExpanded ? "top" : "right"} 
              align="start"
              className="w-56 p-0 bg-popover border-border shadow-lg"
            >
              {/* Simplified Menu - Dark Mode & Logout Only */}
              <div className="py-2">
                <div className="w-full flex items-center justify-between px-4 py-2 text-sm text-foreground">
                  <div className="flex items-center gap-3">
                    <Moon className="h-4 w-4 text-muted-foreground" />
                    <span>Dark mode</span>
                  </div>
                  <Switch 
                    checked={isDarkMode} 
                    onCheckedChange={setIsDarkMode}
                  />
                </div>
              </div>

              <div className="border-t border-border py-2">
                <button 
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
                >
                  <LogOut className="h-4 w-4 text-muted-foreground" />
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
