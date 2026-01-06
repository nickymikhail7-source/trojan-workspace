import * as React from "react";
import { 
  RefreshCw, 
  MessageCircleQuestion, 
  X, 
  Send, 
  Replace, 
  Copy, 
  Check, 
  RotateCcw,
  Sparkles,
  Eye
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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

// Simulated refinement function - in production this would call an AI
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
  const [showDifferences, setShowDifferences] = React.useState(false);
  const [copiedOriginal, setCopiedOriginal] = React.useState(false);
  const [copiedRefined, setCopiedRefined] = React.useState(false);
  const [initialRefinedPrompt, setInitialRefinedPrompt] = React.useState("");
  const [mobileTab, setMobileTab] = React.useState("original");
  const isMobile = useIsMobile();

  const changes = React.useMemo(
    () => (refineType ? generateChanges(refineType.id) : []),
    [refineType]
  );

  React.useEffect(() => {
    if (isOpen && refineType) {
      setIsRefining(true);
      setOriginalEditable(originalPrompt);
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

  const handleAskQuestions = () => {
    setRefinedPrompt(
      `Before I proceed, I'd like to clarify a few things about your request:\n\n"${originalEditable}"\n\n1. What is the primary goal you're trying to achieve?\n2. Are there any specific constraints I should be aware of?\n3. What format would be most helpful for the response?`
    );
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

  // Mobile Layout
  if (isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm" />
          <div className="fixed inset-0 z-50 flex flex-col bg-background animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
              <div className="flex-1">
                <h2 className="text-base font-semibold text-foreground">Refine your prompt</h2>
                {refineType && (
                  <span className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
                    <Sparkles className="h-3 w-3" />
                    {refineType.label}
                  </span>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Tabs */}
            <Tabs value={mobileTab} onValueChange={setMobileTab} className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="w-full justify-start px-4 pt-2 bg-transparent border-b border-border rounded-none h-auto gap-0">
                <TabsTrigger 
                  value="original" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Original
                </TabsTrigger>
                <TabsTrigger 
                  value="refined" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Refined
                </TabsTrigger>
                <TabsTrigger 
                  value="changes" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Changes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="original" className="flex-1 p-4 overflow-auto mt-0">
                <Textarea
                  value={originalEditable}
                  onChange={(e) => setOriginalEditable(e.target.value)}
                  className="h-full min-h-[200px] resize-none text-base leading-relaxed"
                  placeholder="Your original prompt..."
                />
              </TabsContent>

              <TabsContent value="refined" className="flex-1 p-4 overflow-auto mt-0">
                {isRefining ? (
                  <div className="space-y-3 p-4 rounded-lg border border-border bg-muted/20">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Refining your prompt...</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted/50 rounded animate-pulse" />
                      <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4" />
                      <div className="h-4 bg-muted/50 rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ) : (
                  <Textarea
                    value={refinedPrompt}
                    onChange={(e) => setRefinedPrompt(e.target.value)}
                    className="h-full min-h-[200px] resize-none text-base leading-relaxed"
                    placeholder="Your refined prompt will appear here..."
                  />
                )}
              </TabsContent>

              <TabsContent value="changes" className="flex-1 p-4 overflow-auto mt-0">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-foreground">What changed</h3>
                  <ul className="space-y-2">
                    {changes.map((change, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-border bg-card space-y-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefineAgain}
                  disabled={isRefining}
                  className="text-muted-foreground"
                >
                  <RefreshCw className="h-4 w-4 mr-1.5" />
                  Refine again
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" className="flex-1" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onReplace(refinedPrompt)}
                  disabled={isRefining || !refinedPrompt.trim()}
                >
                  Apply
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => onReplaceAndSend(refinedPrompt)}
                  disabled={isRefining || !refinedPrompt.trim()}
                >
                  <Send className="h-4 w-4 mr-1.5" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </DialogPortal>
      </Dialog>
    );
  }

  // Desktop Layout
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-foreground/15 backdrop-blur-sm" />
        <div
          className={cn(
            "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
            "w-[min(1100px,92vw)] h-[min(720px,88vh)]",
            "flex flex-col",
            "bg-background rounded-2xl border border-border",
            "shadow-modal overflow-hidden",
            "animate-in fade-in-0 zoom-in-95 duration-300"
          )}
        >
          {/* Sticky Header */}
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
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium">
                  <Sparkles className="h-3.5 w-3.5" />
                  {refineType.label}
                </span>
              )}
              <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9 -mr-2">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-[1fr_1fr_280px] h-full">
              {/* Original Panel */}
              <div className="p-6 border-r border-border bg-muted/20">
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
                <div className="relative">
                  <Textarea
                    value={originalEditable}
                    onChange={(e) => setOriginalEditable(e.target.value)}
                    className={cn(
                      "min-h-[380px] resize-none",
                      "text-base leading-relaxed",
                      "bg-muted/40 border-muted/60",
                      "focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-border"
                    )}
                    placeholder="Your original prompt..."
                  />
                </div>
              </div>

              {/* Refined Panel */}
              <div className="p-6 border-r border-border bg-background">
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
                  <div className="min-h-[380px] p-4 rounded-lg border border-border bg-muted/10">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Refining your prompt...</span>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-muted/50 rounded animate-pulse" />
                      <div className="h-4 bg-muted/50 rounded animate-pulse w-[90%]" />
                      <div className="h-4 bg-muted/50 rounded animate-pulse w-[75%]" />
                      <div className="h-4 bg-muted/50 rounded animate-pulse w-[85%]" />
                      <div className="h-4 bg-muted/50 rounded animate-pulse w-[60%]" />
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <Textarea
                      value={refinedPrompt}
                      onChange={(e) => setRefinedPrompt(e.target.value)}
                      className={cn(
                        "min-h-[380px] resize-none",
                        "text-base leading-relaxed",
                        "bg-background border-border",
                        "focus-visible:ring-1 focus-visible:ring-ring",
                        showDifferences && "bg-emerald-50/30 dark:bg-emerald-950/10"
                      )}
                      placeholder="Your refined prompt will appear here..."
                    />
                  </div>
                )}

                {/* Improvements indicator */}
                {!isRefining && refinedPrompt !== originalPrompt && (
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-sm text-muted-foreground">
                        Trojan suggested improvements
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDifferences(!showDifferences)}
                      className={cn(
                        "h-7 px-2 text-xs gap-1.5",
                        showDifferences && "bg-accent/10 text-accent"
                      )}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {showDifferences ? "Hide differences" : "View differences"}
                    </Button>
                  </div>
                )}
              </div>

              {/* Changes Panel */}
              <div className="p-6 bg-muted/10">
                <div className="mb-4">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    What Changed
                  </span>
                </div>
                <div className="space-y-3">
                  {changes.map((change, i) => (
                    <div 
                      key={i} 
                      className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border/50"
                    >
                      <div className="h-2 w-2 rounded-full bg-accent mt-1 shrink-0" />
                      <span className="text-sm text-foreground leading-relaxed">
                        {change}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Quick actions in changes panel */}
                <div className="mt-6 pt-6 border-t border-border/50 space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefineAgain}
                    disabled={isRefining}
                    className="w-full justify-start text-muted-foreground hover:text-foreground"
                  >
                    <RefreshCw className={cn("h-4 w-4 mr-2", isRefining && "animate-spin")} />
                    Refine again
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAskQuestions}
                    disabled={isRefining}
                    className="w-full justify-start text-muted-foreground hover:text-foreground"
                  >
                    <MessageCircleQuestion className="h-4 w-4 mr-2" />
                    Ask clarifying questions
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="shrink-0 flex items-center justify-between px-8 py-5 border-t border-border bg-card/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="ask-questions"
                  onCheckedChange={(checked) => checked && handleAskQuestions()}
                />
                <label htmlFor="ask-questions" className="text-sm text-muted-foreground cursor-pointer">
                  Ask clarifying questions instead
                </label>
              </div>
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
                <Replace className="h-4 w-4 mr-2" />
                Apply
              </Button>
              <Button
                onClick={() => onReplaceAndSend(refinedPrompt)}
                disabled={isRefining || !refinedPrompt.trim()}
                className="px-6"
              >
                <Send className="h-4 w-4 mr-2" />
                Replace & Send
              </Button>
            </div>
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
