import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Extract language from className (e.g., "language-javascript" -> "javascript")
  const lang = language?.replace(/^language-/, "") || "text";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative group my-3 rounded-lg overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 border-b border-zinc-700">
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
          {lang}
        </span>
        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium transition-colors",
            copied 
              ? "text-emerald-400" 
              : "text-zinc-400 hover:text-zinc-200"
          )}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="bg-zinc-900 overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed">
          <code className="text-zinc-100 font-mono">{code}</code>
        </pre>
      </div>
    </div>
  );
}
