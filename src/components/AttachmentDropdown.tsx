import { Plus, ImagePlus, Paperclip, Camera } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AttachmentDropdownProps {
  onUploadPhoto?: () => void;
  onUploadFile?: () => void;
  onTakeScreenshot?: () => void;
  disabled?: boolean;
}

export function AttachmentDropdown({
  onUploadPhoto,
  onUploadFile,
  onTakeScreenshot,
  disabled,
}: AttachmentDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center",
            "text-muted-foreground hover:text-foreground hover:bg-secondary/80",
            "transition-colors focus:outline-none",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <Plus className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem onClick={onUploadPhoto} className="gap-2">
          <ImagePlus className="h-4 w-4" />
          <span>Upload Photo</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onUploadFile} className="gap-2">
          <Paperclip className="h-4 w-4" />
          <span>Upload File</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onTakeScreenshot} className="gap-2">
          <Camera className="h-4 w-4" />
          <span>Take Screenshot</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
