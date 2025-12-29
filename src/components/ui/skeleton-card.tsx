import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonCardProps {
  className?: string;
  variant?: "default" | "compact";
}

export function SkeletonCard({ className, variant = "default" }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "workspace-card",
        variant === "compact" ? "min-w-[240px] max-w-[280px]" : "",
        className
      )}
    >
      <div className="space-y-3">
        <div>
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-6 w-6 rounded" />
        </div>
      </div>
    </div>
  );
}
