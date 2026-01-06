import { GitBranch, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BranchEmptyStateProps {
  branchName: string;
  parentBranchName?: string;
  parentMessagePreview?: string;
  onShowParentContext?: () => void;
}

export function BranchEmptyState({ 
  branchName, 
  parentBranchName = "Main",
  parentMessagePreview,
  onShowParentContext 
}: BranchEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 max-w-md mx-auto text-center">
      {/* Branch Icon */}
      <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
        <GitBranch className="h-7 w-7 text-accent" />
      </div>
      
      {/* Title */}
      <h2 className="text-lg font-semibold text-foreground mb-2">
        New Branch: "{branchName}"
      </h2>
      
      {/* Context */}
      <p className="text-sm text-muted-foreground mb-4">
        Branched from <span className="font-medium text-foreground">{parentBranchName}</span>
        {parentMessagePreview && (
          <>
            {" "}at: <span className="italic">"{parentMessagePreview.slice(0, 50)}..."</span>
          </>
        )}
      </p>
      
      {/* Parent Context Button */}
      {onShowParentContext && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onShowParentContext}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Show parent context
        </Button>
      )}
      
      {/* Instructions */}
      <div className="bg-secondary/50 rounded-xl p-4 text-left w-full">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Start typing below</span> to continue this line of thinking. 
          This branch has its own conversation thread while maintaining the context from where you branched.
        </p>
      </div>
    </div>
  );
}
