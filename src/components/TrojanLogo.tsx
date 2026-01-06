import { cn } from "@/lib/utils";

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

  const textSizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Custom Trojan Shield Icon */}
      <div className={cn(
        "relative flex items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80",
        sizeClasses[size]
      )}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-[60%] w-[60%] text-primary-foreground"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Shield shape with T */}
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" opacity="0.2" />
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          {/* T letter inside */}
          <path d="M8 8h8M12 8v8" strokeWidth="2.5" />
        </svg>
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
