import * as React from "react";
import { RefreshCw, MessageCircleQuestion, X, Send, Replace } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

export function PromptRefineModal({
  isOpen,
  onClose,
  originalPrompt,
  refineType,
  onReplace,
  onReplaceAndSend,
}: PromptRefineModalProps) {
  const [refinedPrompt, setRefinedPrompt] = React.useState("");
  const [isRefining, setIsRefining] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && refineType) {
      setIsRefining(true);
      // Simulate AI refinement delay
      const timer = setTimeout(() => {
        setRefinedPrompt(generateRefinedPrompt(originalPrompt, refineType.id));
        setIsRefining(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen, refineType, originalPrompt]);

  const handleRefineAgain = () => {
    setIsRefining(true);
    setTimeout(() => {
      setRefinedPrompt((prev) => prev + "\n\n[Further refined for clarity]");
      setIsRefining(false);
    }, 600);
  };

  const handleAskQuestions = () => {
    setRefinedPrompt(
      `Before I proceed, I'd like to clarify a few things about your request:\n\n"${originalPrompt}"\n\n1. What is the primary goal you're trying to achieve?\n2. Are there any specific constraints I should be aware of?\n3. What format would be most helpful for the response?`
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <DialogTitle className="text-lg font-semibold">
            Refine your prompt
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Review and adjust how Trojan understands your request
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-0 min-h-[300px]">
          {/* Original Prompt Panel */}
          <div className="p-4 bg-muted/30 border-r border-border">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Original
              </span>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {originalPrompt}
              </p>
            </div>
          </div>

          {/* Refined Prompt Panel */}
          <div className="p-4 bg-background">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium text-foreground uppercase tracking-wide">
                Refined
              </span>
              {refineType && (
                <span className="text-xs text-muted-foreground">
                  ({refineType.label})
                </span>
              )}
            </div>
            {isRefining ? (
              <div className="p-3 rounded-lg border border-border bg-muted/20">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Refining your prompt...</span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="h-4 bg-muted/50 rounded animate-pulse" />
                  <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-muted/50 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ) : (
              <Textarea
                value={refinedPrompt}
                onChange={(e) => setRefinedPrompt(e.target.value)}
                className="min-h-[200px] resize-none border-border bg-background focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Your refined prompt will appear here..."
              />
            )}
            
            {/* Highlight improvements indicator */}
            {!isRefining && refinedPrompt !== originalPrompt && (
              <div className="mt-2 flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500/70" />
                <span className="text-xs text-muted-foreground">
                  Improvements highlighted
                </span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="p-4 border-t border-border bg-muted/20">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefineAgain}
                disabled={isRefining}
                className="text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="h-4 w-4 mr-1.5" />
                Refine again
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAskQuestions}
                disabled={isRefining}
                className="text-muted-foreground hover:text-foreground"
              >
                <MessageCircleQuestion className="h-4 w-4 mr-1.5" />
                Ask questions instead
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReplace(refinedPrompt)}
                disabled={isRefining || !refinedPrompt.trim()}
              >
                <Replace className="h-4 w-4 mr-1.5" />
                Replace only
              </Button>
              <Button
                size="sm"
                onClick={() => onReplaceAndSend(refinedPrompt)}
                disabled={isRefining || !refinedPrompt.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="h-4 w-4 mr-1.5" />
                Replace & Send
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
