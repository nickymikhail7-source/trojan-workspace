import { cn } from "@/lib/utils";
import { Hexagon } from "lucide-react";

interface TrojanLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function TrojanLogo({ className, showText = true, size = "md" }: TrojanLogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const textSizes = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  };

  const textSizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Hex T Icon */}
      <div className={cn("relative flex items-center justify-center", sizeClasses[size])}>
        <Hexagon 
          className={cn("text-foreground", iconSizes[size])} 
          strokeWidth={1.5} 
        />
        <span className={cn(
          "absolute inset-0 flex items-center justify-center font-bold text-foreground",
          textSizes[size]
        )}>
          T
        </span>
      </div>
      
      {showText && (
        <span className={cn(
          "font-semibold tracking-tight text-foreground",
          textSizeClasses[size]
        )}>
          Trojan
        </span>
      )}
    </div>
  );
}
