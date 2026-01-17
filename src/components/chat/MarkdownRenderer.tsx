import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      className={cn("prose prose-sm dark:prose-invert max-w-none", className)}
      remarkPlugins={[remarkGfm]}
      components={{
        // Headers
        h1: ({ children }) => (
          <h1 className="text-xl font-semibold text-foreground mt-6 mb-3 first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-lg font-semibold text-foreground mt-5 mb-2 first:mt-0">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-base font-semibold text-foreground mt-4 mb-2 first:mt-0">
            {children}
          </h3>
        ),

        // Paragraphs
        p: ({ children }) => (
          <p className="text-foreground/90 leading-relaxed mb-3 last:mb-0">
            {children}
          </p>
        ),

        // Lists
        ul: ({ children }) => (
          <ul className="list-disc pl-6 mb-3 space-y-1.5 text-foreground/90">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-6 mb-3 space-y-1.5 text-foreground/90">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed">{children}</li>
        ),

        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
          >
            {children}
            <ExternalLink className="h-3 w-3 ml-0.5" />
          </a>
        ),

        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-primary/50 pl-4 py-1 my-3 text-muted-foreground italic">
            {children}
          </blockquote>
        ),

        // Code
        code: ({ className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "");
          const isInline = !match && !className;
          const codeContent = String(children).replace(/\n$/, "");

          if (isInline) {
            return (
              <code
                className="bg-secondary/80 text-foreground px-1.5 py-0.5 rounded text-[13px] font-mono"
                {...props}
              >
                {children}
              </code>
            );
          }

          return (
            <CodeBlock
              code={codeContent}
              language={match?.[1] || className}
            />
          );
        },

        // Pre (wrapper for code blocks - we handle this in code component)
        pre: ({ children }) => <>{children}</>,

        // Tables
        table: ({ children }) => (
          <div className="overflow-x-auto my-3">
            <table className="min-w-full border-collapse text-sm">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="border-b border-border bg-muted/50">
            {children}
          </thead>
        ),
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => (
          <tr className="border-b border-border/50 last:border-0">
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th className="px-3 py-2 text-left font-medium text-foreground">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2 text-foreground/90">{children}</td>
        ),

        // Horizontal rule
        hr: () => <hr className="my-4 border-border/50" />,

        // Strong and emphasis
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic">{children}</em>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
