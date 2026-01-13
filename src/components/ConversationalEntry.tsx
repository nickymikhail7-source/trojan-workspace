import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Target, Bug, PenTool, FileText, ArrowUp, Plus, Paperclip, ImagePlus, Link, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkModeSelector, type WorkMode } from "./chat/WorkModeSelector";
import { setPendingPrompt } from "@/lib/pendingPrompt";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Attachment {
  id: string;
  type: 'file' | 'image' | 'link';
  name: string;
  preview?: string;
}

const quickActions = [
  {
    id: "gtm",
    icon: Target,
    label: "Plan strategy",
    prompt: "Help me plan a go-to-market strategy for my product.",
  },
  {
    id: "debug",
    icon: Bug,
    label: "Debug issue",
    prompt: "I need help debugging an issue in my application.",
  },
  {
    id: "write",
    icon: PenTool,
    label: "Write content",
    prompt: "Help me write professional content.",
  },
  {
    id: "review",
    icon: FileText,
    label: "Review docs",
    prompt: "I'd like you to review and help me improve a document.",
  },
];

const placeholderMap: Record<WorkMode, string> = {
  quick: "Ask a quick question...",
  think: "What would you like to think about?",
  research: "What should we research?",
  create: "What would you like to create?",
};

const attachmentOptions = [
  {
    id: "file",
    icon: Paperclip,
    label: "Upload file",
    helper: "PDFs, documents, or text files",
    accept: ".pdf,.doc,.docx,.txt,.md,.csv,.json",
  },
  {
    id: "image",
    icon: ImagePlus,
    label: "Upload image",
    helper: "Screenshots, photos, or diagrams",
    accept: "image/*",
  },
  {
    id: "link",
    icon: Link,
    label: "Paste link",
    helper: "Add a URL for reference",
  },
];

export function ConversationalEntry() {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [workMode, setWorkMode] = useState<WorkMode>("think");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 160)}px`;
    }
  }, [inputValue]);

  // Focus link input when adding link
  useEffect(() => {
    if (isAddingLink && linkInputRef.current) {
      linkInputRef.current.focus();
    }
  }, [isAddingLink]);

  const handleCreateWorkspace = (prompt: string) => {
    const newId = `new-${Date.now()}`;
    
    // Use pending prompt system with workMode metadata
    setPendingPrompt({
      content: prompt,
      meta: {
        workMode,
        timestamp: Date.now(),
        attachments: attachments.length > 0 ? attachments : undefined,
      },
    });
    
    navigate(`/workspace/${newId}/branch/main`);
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    handleCreateWorkspace(action.prompt);
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    handleCreateWorkspace(inputValue.trim());
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = Array.from(files).map((file) => ({
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      name: file.name,
      preview: type === 'image' ? URL.createObjectURL(file) : undefined,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
    
    // Reset input
    e.target.value = '';
  };

  const handleAddLink = () => {
    if (!linkValue.trim()) {
      setIsAddingLink(false);
      return;
    }

    // Simple URL validation
    let url = linkValue.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    try {
      new URL(url);
      const hostname = new URL(url).hostname;
      
      setAttachments((prev) => [
        ...prev,
        {
          id: `link-${Date.now()}`,
          type: 'link',
          name: hostname,
          preview: url,
        },
      ]);
      setLinkValue("");
      setIsAddingLink(false);
    } catch {
      // Invalid URL, just close
      setLinkValue("");
      setIsAddingLink(false);
    }
  };

  const handleLinkKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddLink();
    } else if (e.key === "Escape") {
      setLinkValue("");
      setIsAddingLink(false);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const handleOptionClick = (optionId: string) => {
    setIsPopoverOpen(false);
    
    if (optionId === 'file') {
      fileInputRef.current?.click();
    } else if (optionId === 'image') {
      imageInputRef.current?.click();
    } else if (optionId === 'link') {
      setIsAddingLink(true);
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-8">
      <div className="w-full max-w-2xl animate-fade-up">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
            What's on your mind today?
          </h1>
        </div>

        {/* Chatbox Container */}
        <div
          className={cn(
            "relative rounded-2xl border backdrop-blur-sm transition-all duration-300 overflow-hidden",
            "bg-gradient-to-b from-card via-card to-secondary/20",
            isFocused
              ? "border-primary/40 shadow-xl shadow-primary/10 ring-2 ring-primary/20"
              : "border-border/50 hover:border-border hover:shadow-lg hover:shadow-primary/5"
          )}
        >
          {/* Subtle gradient overlay */}
          <div 
            className={cn(
              "absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-300 pointer-events-none",
              isFocused && "opacity-100"
            )} 
          />

          {/* Attachment Chips */}
          {(attachments.length > 0 || isAddingLink) && (
            <div className="relative px-4 pt-3 pb-1 flex flex-wrap gap-1.5">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-1.5 bg-secondary/60 rounded-lg px-2 py-1 text-xs text-muted-foreground group"
                >
                  {att.type === 'image' && att.preview && (
                    <img 
                      src={att.preview} 
                      alt={att.name}
                      className="h-4 w-4 rounded object-cover" 
                    />
                  )}
                  {att.type === 'link' && (
                    <Globe className="h-3 w-3" />
                  )}
                  {att.type === 'file' && (
                    <Paperclip className="h-3 w-3" />
                  )}
                  <span className="max-w-[120px] truncate">{att.name}</span>
                  <button
                    onClick={() => removeAttachment(att.id)}
                    className="h-4 w-4 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                    aria-label={`Remove ${att.name}`}
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
              
              {/* Inline Link Input */}
              {isAddingLink && (
                <div className="flex items-center gap-1.5 bg-secondary/60 rounded-lg px-2 py-1">
                  <Globe className="h-3 w-3 text-muted-foreground" />
                  <input
                    ref={linkInputRef}
                    type="text"
                    value={linkValue}
                    onChange={(e) => setLinkValue(e.target.value)}
                    onKeyDown={handleLinkKeyDown}
                    onBlur={handleAddLink}
                    placeholder="Paste URL..."
                    className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none w-[140px]"
                  />
                </div>
              )}
            </div>
          )}
          
          {/* Input Row */}
          <div className="relative p-4 pb-2">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder={placeholderMap[workMode]}
              rows={1}
              className={cn(
                "w-full resize-none bg-transparent text-foreground",
                "placeholder:text-muted-foreground/50 focus:outline-none",
                "text-sm leading-relaxed min-h-[24px] max-h-[120px]",
                "transition-colors duration-200"
              )}
            />
          </div>

          {/* Simplified Toolbar Row */}
          <div className="relative flex items-center justify-between px-3 py-2 border-t border-border/30">
            {/* Left Side: Add Button + WorkMode Selector */}
            <div className="flex items-center gap-1">
              {/* + Attachment Button */}
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center",
                      "text-muted-foreground hover:text-foreground hover:bg-secondary/80",
                      "transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                    )}
                    aria-label="Add attachment"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent 
                  align="start" 
                  className="w-56 p-2"
                  sideOffset={8}
                >
                  <div className="space-y-0.5">
                    {attachmentOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleOptionClick(option.id)}
                          className={cn(
                            "w-full flex items-start gap-3 p-2.5 rounded-md",
                            "hover:bg-muted/50 transition-colors text-left"
                          )}
                        >
                          <Icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium text-foreground">{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.helper}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>

              <WorkModeSelector value={workMode} onChange={setWorkMode} />
            </div>

            {/* Right Side: Send Button */}
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center",
                "transition-colors focus:outline-none",
                inputValue.trim()
                  ? "bg-accent text-accent-foreground hover:bg-accent/90"
                  : "bg-secondary text-muted-foreground/50"
              )}
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.md,.csv,.json"
          onChange={(e) => handleFileChange(e, 'file')}
          className="hidden"
          multiple
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, 'image')}
          className="hidden"
          multiple
        />

        {/* Subtle Quick Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md",
                  "text-[11px] text-muted-foreground/60 hover:text-muted-foreground",
                  "hover:bg-secondary/40 transition-colors"
                )}
              >
                <Icon className="h-3 w-3" />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
