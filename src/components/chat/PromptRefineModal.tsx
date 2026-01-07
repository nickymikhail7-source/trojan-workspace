import * as React from "react";
import { 
  RefreshCw, 
  X, 
  Send, 
  Copy, 
  Check, 
  RotateCcw,
  Sparkles,
  MessageCircleQuestion
} from "lucide-react";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface RefineOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface PromptRefineModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalPrompt: string;
  refineType: RefineOption | null;
  onReplace: (refinedPrompt: string) => void;
  onReplaceAndSend: (refinedPrompt: string) => void;
}

// Simulated refinement function
function generateRefinedPrompt(original: string, type: string): string {
  const refinements: Record<string, (p: string) => string> = {
    clarify: (p) =>
      `I need help with the following specific task:\n\n${p}\n\nPlease provide a clear, focused response that directly addresses my request.`,
    context: (p) =>
      `Context: I'm working on a project and need assistance.\n\nBackground: This is for professional use.\n\nRequest: ${p}\n\nPlease consider this context in your response.`,
    structure: (p) =>
      `Please help me with:\n\n**Objective:** ${p}\n\n**Expected format:**\n1. Summary\n2. Detailed explanation\n3. Next steps`,
    constraints: (p) =>
      `${p}\n\n**Constraints:**\n- Keep the response concise (under 500 words)\n- Use simple, clear language\n- Focus on actionable insights`,
    optimize: (p) =>
      `**Goal:** ${p}\n\n**Success criteria:**\n- Clear and actionable\n- Well-organized\n- Comprehensive yet concise\n\nPlease provide your best response.`,
    advanced: (p) => p,
  };

  return refinements[type]?.(original) || original;
}

// Simulated changes summary
function generateChanges(type: string): string[] {
  const changes: Record<string, string[]> = {
    clarify: [
      "Clarified primary objective",
      "Removed ambiguous language",
      "Added specific outcome request",
    ],
    context: [
      "Added project context",
      "Specified use case (professional)",
      "Included background information",
    ],
    structure: [
      "Organized into clear sections",
      "Added expected format",
      "Included summary request",
    ],
    constraints: [
      "Added word limit constraint",
      "Specified language preference",
      "Focused on actionable output",
    ],
    optimize: [
      "Defined success criteria",
      "Improved clarity and organization",
      "Made request more comprehensive",
    ],
    advanced: ["Applied custom refinements"],
  };
  return changes[type] || ["Improved overall clarity"];
}

export function PromptRefineModal({
  isOpen,
  onClose,
  originalPrompt,
  refineType,
  onReplace,
  onReplaceAndSend,
}: PromptRefineModalProps) {
  const [refinedPrompt, setRefinedPrompt] = React.useState("");
  const [originalEditable, setOriginalEditable] = React.useState(originalPrompt);
  const [isRefining, setIsRefining] = React.useState(false);
  const [copiedOriginal, setCopiedOriginal] = React.useState(false);
  const [copiedRefined, setCopiedRefined] = React.useState(false);
  const [initialRefinedPrompt, setInitialRefinedPrompt] = React.useState("");
  const [askQuestionsMode, setAskQuestionsMode] = React.useState(false);

  const changes = React.useMemo(
    () => (refineType ? generateChanges(refineType.id) : []),
    [refineType]
  );

  React.useEffect(() => {
    if (isOpen && refineType) {
      setIsRefining(true);
      setOriginalEditable(originalPrompt);
      setAskQuestionsMode(false);
      const timer = setTimeout(() => {
        const refined = generateRefinedPrompt(originalPrompt, refineType.id);
        setRefinedPrompt(refined);
        setInitialRefinedPrompt(refined);
        setIsRefining(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen, refineType, originalPrompt]);

  const handleRefineAgain = () => {
    setIsRefining(true);
    setTimeout(() => {
      const refined = generateRefinedPrompt(originalEditable, refineType?.id || "optimize");
      setRefinedPrompt(refined);
      setInitialRefinedPrompt(refined);
      setIsRefining(false);
    }, 600);
  };

  const handleCopy = async (text: string, type: "original" | "refined") => {
    await navigator.clipboard.writeText(text);
    if (type === "original") {
      setCopiedOriginal(true);
      setTimeout(() => setCopiedOriginal(false), 2000);
    } else {
      setCopiedRefined(true);
      setTimeout(() => setCopiedRefined(false), 2000);
    }
  };

  const handleReset = () => {
    setRefinedPrompt(initialRefinedPrompt);
  };

  const hasRefinedChanged = refinedPrompt !== initialRefinedPrompt;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm" />
        <div
          className={cn(
            "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
            "w-[min(1200px,95vw)] h-[min(700px,90vh)]",
            "flex flex-col",
            "bg-background rounded-2xl border border-border",
            "shadow-modal overflow-hidden",
            "animate-in fade-in-0 zoom-in-95 duration-300"
          )}
        >
          {/* Header */}
          <div className="shrink-0 flex items-start justify-between px-8 py-6 border-b border-border bg-card/50">
            <div className="space-y-1.5">
              <h2 className="text-xl font-semibold text-foreground">
                Refine your prompt
              </h2>
              <p className="text-sm text-muted-foreground">
                Review and adjust how Trojan understands your request.
              </p>
            </div>
            <div className="flex items-center gap-4">
              {refineType && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Sparkles className="h-3.5 w-3.5" />
                  {refineType.label}
                </span>
              )}
              <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9 -mr-2">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Three-Column Body */}
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-3 h-full divide-x divide-border">
              {/* Column 1: Original */}
              <div className="flex flex-col p-6 bg-muted/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Original
                    </span>
                    <span className="text-xs text-muted-foreground/70">Editable</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(originalEditable, "original")}
                    className="h-7 px-2 text-muted-foreground hover:text-foreground"
                  >
                    {copiedOriginal ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
                <Textarea
                  value={originalEditable}
                  onChange={(e) => setOriginalEditable(e.target.value)}
                  className={cn(
                    "flex-1 resize-none",
                    "text-sm leading-relaxed",
                    "bg-muted/40 border-muted/60",
                    "focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-border"
                  )}
                  placeholder="Your original prompt..."
                />
              </div>

              {/* Column 2: Refined */}
              <div className="flex flex-col p-6 bg-background">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                      Refined
                    </span>
                    <span className="text-xs text-muted-foreground/70">Editable</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {hasRefinedChanged && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="h-7 px-2 text-muted-foreground hover:text-foreground"
                        title="Reset to Trojan's suggestion"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(refinedPrompt, "refined")}
                      className="h-7 px-2 text-muted-foreground hover:text-foreground"
                    >
                      {copiedRefined ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </div>

                {isRefining ? (
                  <div className="flex-1 p-4 rounded-lg border border-border bg-muted/10">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Refining your prompt...</span>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-muted/50 rounded animate-pulse" />
                      <div className="h-4 bg-muted/50 rounded animate-pulse w-[90%]" />
                      <div className="h-4 bg-muted/50 rounded animate-pulse w-[75%]" />
                      <div className="h-4 bg-muted/50 rounded animate-pulse w-[85%]" />
                    </div>
                  </div>
                ) : (
                  <Textarea
                    value={refinedPrompt}
                    onChange={(e) => setRefinedPrompt(e.target.value)}
                    className={cn(
                      "flex-1 resize-none",
                      "text-sm leading-relaxed",
                      "bg-primary/5 border-primary/20",
                      "focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/40"
                    )}
                    placeholder="Your refined prompt will appear here..."
                  />
                )}
              </div>

              {/* Column 3: What Changed */}
              <div className="flex flex-col p-6 bg-muted/10">
                <div className="mb-4">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    What changed
                  </span>
                </div>
                
                <div className="flex-1 space-y-4">
                  {isRefining ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4" />
                      <div className="h-4 bg-muted/50 rounded animate-pulse w-2/3" />
                      <div className="h-4 bg-muted/50 rounded animate-pulse w-4/5" />
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {changes.map((change, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                          <span className="text-sm text-foreground">{change}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Refine Again Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefineAgain}
                  disabled={isRefining}
                  className="mt-4"
                >
                  <RefreshCw className={cn("h-3.5 w-3.5 mr-2", isRefining && "animate-spin")} />
                  Refine again
                </Button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 flex items-center justify-between px-8 py-4 border-t border-border bg-card/50">
            <div className="flex items-center gap-3">
              <Switch
                id="ask-questions"
                checked={askQuestionsMode}
                onCheckedChange={setAskQuestionsMode}
              />
              <label 
                htmlFor="ask-questions" 
                className="text-sm text-muted-foreground cursor-pointer flex items-center gap-2"
              >
                <MessageCircleQuestion className="h-4 w-4" />
                Ask clarifying questions instead
              </label>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={() => onReplace(refinedPrompt)}
                disabled={isRefining || !refinedPrompt.trim()}
              >
                Apply
              </Button>
              <Button
                onClick={() => onReplaceAndSend(refinedPrompt)}
                disabled={isRefining || !refinedPrompt.trim()}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Replace & Send
              </Button>
            </div>
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  );
}