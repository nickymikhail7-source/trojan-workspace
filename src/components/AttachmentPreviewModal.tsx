import { X, ExternalLink, FileText, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Attachment {
  id: string;
  type: 'file' | 'image' | 'link';
  name: string;
  preview?: string;
  size?: number;
  file?: File;
}

interface AttachmentPreviewModalProps {
  attachment: Attachment | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(name: string): string {
  const parts = name.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'FILE';
}

export function AttachmentPreviewModal({ attachment, isOpen, onClose }: AttachmentPreviewModalProps) {
  if (!attachment) return null;

  const handleOpenLink = () => {
    if (attachment.type === 'link' && attachment.preview) {
      window.open(attachment.preview, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownload = () => {
    if (attachment.type === 'image' && attachment.preview) {
      const link = document.createElement('a');
      link.href = attachment.preview;
      link.download = attachment.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            {attachment.type === 'image' ? 'Image Preview' : 
             attachment.type === 'link' ? 'Link Details' : 'File Details'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image Preview */}
          {attachment.type === 'image' && attachment.preview && (
            <div className="relative rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center">
              <img
                src={attachment.preview}
                alt={attachment.name}
                className="max-h-[300px] w-auto object-contain"
              />
            </div>
          )}

          {/* File Preview */}
          {attachment.type === 'file' && (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-3">
                <div className="h-16 w-16 rounded-xl bg-secondary flex items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">{attachment.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {getFileExtension(attachment.name)} • {formatFileSize(attachment.size)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Link Preview */}
          {attachment.type === 'link' && (
            <div className="flex flex-col gap-3 p-4 rounded-lg bg-secondary/30">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <ExternalLink className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{attachment.name}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {attachment.preview}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleOpenLink}
                className="w-full gap-2"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open Link
              </Button>
            </div>
          )}

          {/* Details Section */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="text-xs text-muted-foreground">
              {attachment.type === 'image' && attachment.size && formatFileSize(attachment.size)}
              {attachment.type === 'file' && formatFileSize(attachment.size)}
              {attachment.type === 'link' && 'External link'}
            </div>
            
            {attachment.type === 'image' && attachment.preview && (
              <Button variant="ghost" size="sm" onClick={handleDownload} className="gap-1.5 h-7 text-xs">
                <Download className="h-3 w-3" />
                Download
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
