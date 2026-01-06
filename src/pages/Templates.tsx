import { useState } from "react";
import { LayoutTemplate, FileText, Presentation, Code, BookOpen, Target, Lightbulb } from "lucide-react";
import { CollapsibleLeftRail } from "@/components/CollapsibleLeftRail";
import { NewWorkspaceModal } from "@/components/NewWorkspaceModal";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: LucideIcon;
}

const templates: Template[] = [
  {
    id: "pitch",
    title: "Pitch Deck",
    description: "Structure your investor pitch with clear narrative and supporting data.",
    category: "Business",
    icon: Presentation,
  },
  {
    id: "prd",
    title: "Product Requirements",
    description: "Define features, user stories, and success metrics for your product.",
    category: "Product",
    icon: FileText,
  },
  {
    id: "architecture",
    title: "System Architecture",
    description: "Plan technical architecture, APIs, and infrastructure decisions.",
    category: "Engineering",
    icon: Code,
  },
  {
    id: "research",
    title: "User Research",
    description: "Organize interview notes, insights, and synthesis.",
    category: "Research",
    icon: BookOpen,
  },
  {
    id: "okr",
    title: "OKRs & Goals",
    description: "Set objectives and key results for your team or project.",
    category: "Planning",
    icon: Target,
  },
  {
    id: "brainstorm",
    title: "Brainstorming Session",
    description: "Free-form ideation with AI assistance to explore possibilities.",
    category: "Creative",
    icon: Lightbulb,
  },
];

const categories = ["All", "Business", "Product", "Engineering", "Research", "Planning", "Creative"];

export default function Templates() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleTemplateClick = (template: Template) => {
    toast({
      title: `Using "${template.title}" template`,
      description: "Creating workspace from template...",
    });
    // Would navigate to new workspace with template
  };

  const handleCreateWorkspace = (type: string) => {
    setIsModalOpen(false);
    toast({
      title: "Workspace created",
      description: `Your new ${type} workspace is ready.`,
    });
  };

  const filteredTemplates = selectedCategory === "All" 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background flex">
      <CollapsibleLeftRail onNewWorkspace={() => setIsModalOpen(true)} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8 animate-fade-up flex items-center gap-3">
            <LayoutTemplate className="h-6 w-6 text-muted-foreground" />
            <div>
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                Templates
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Start with a proven structure.
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-6 animate-fade-up overflow-x-auto pb-2" style={{ animationDelay: "50ms" }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 whitespace-nowrap",
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template, index) => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  className="workspace-card text-left group animate-fade-up hover:border-accent/30"
                  style={{ animationDelay: `${(index + 1) * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors duration-200">
                      <Icon className="h-6 w-6 text-muted-foreground group-hover:text-accent transition-colors duration-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground text-sm">{template.title}</h3>
                        <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-secondary text-muted-foreground">
                          {template.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <NewWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateWorkspace}
      />
    </div>
  );
}
