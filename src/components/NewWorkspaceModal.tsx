import { X, FileText, LayoutTemplate, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NewWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (type: string) => void;
}

type WorkspaceOption = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
};

const options: WorkspaceOption[] = [
  {
    id: "blank",
    title: "Blank Workspace",
    subtitle: "Start without constraints.",
    icon: FileText,
  },
  {
    id: "template",
    title: "From Template",
    subtitle: "Pitch, PRD, Architecture, Learning.",
    icon: LayoutTemplate,
  },
  {
    id: "import",
    title: "Import",
    subtitle: "Paste notes or upload a document.",
    icon: Upload,
  },
];

export function NewWorkspaceModal({ isOpen, onClose, onCreate }: NewWorkspaceModalProps) {
  const [selected, setSelected] = useState<string>("blank");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="modal-backdrop animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-card rounded-xl border border-border modal-content animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Create Workspace</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-secondary transition-colors duration-150"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Options */}
        <div className="p-5 space-y-3">
          {options.map((option) => {
            const Icon = option.icon;
            const isSelected = selected === option.id;
            
            return (
              <button
                key={option.id}
                onClick={() => setSelected(option.id)}
                className={cn(
                  "w-full flex items-start gap-4 p-4 rounded-lg border transition-all duration-200 text-left",
                  isSelected
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-border/80 hover:bg-surface-hover"
                )}
              >
                <div className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200",
                  isSelected ? "bg-accent/10" : "bg-secondary"
                )}>
                  <Icon className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    isSelected ? "text-accent" : "text-muted-foreground"
                  )} />
                </div>
                
                <div>
                  <h3 className={cn(
                    "font-medium text-sm transition-colors duration-200",
                    isSelected ? "text-foreground" : "text-foreground"
                  )}>
                    {option.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {option.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onCreate(selected)}>
            Create Workspace
          </Button>
        </div>
      </div>
    </div>
  );
}
