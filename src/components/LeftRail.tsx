import { Home, Clock, LayoutTemplate, Library, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  id: string;
};

const navItems: NavItem[] = [
  { icon: Home, label: "Home", id: "home" },
  { icon: Clock, label: "Recent", id: "recent" },
  { icon: LayoutTemplate, label: "Templates", id: "templates" },
  { icon: Library, label: "Library", id: "library" },
  { icon: Settings, label: "Settings", id: "settings" },
];

interface LeftRailProps {
  activeItem?: string;
  onItemClick?: (id: string) => void;
}

export function LeftRail({ activeItem = "home", onItemClick }: LeftRailProps) {
  return (
    <nav className="w-14 border-r border-border bg-sidebar flex flex-col items-center py-4 gap-1 shrink-0">
      {navItems.map((item) => {
        const isActive = activeItem === item.id;
        const Icon = item.icon;
        
        return (
          <button
            key={item.id}
            onClick={() => onItemClick?.(item.id)}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 group relative",
              isActive 
                ? "bg-sidebar-accent text-accent" 
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
            title={item.label}
          >
            <Icon className="h-5 w-5" />
            
            {/* Tooltip */}
            <span className="absolute left-full ml-2 px-2 py-1 bg-foreground text-primary-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none z-50">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
