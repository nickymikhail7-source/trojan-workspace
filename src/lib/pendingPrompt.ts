import type { WorkMode } from "@/components/chat/WorkModeSelector";

const STORAGE_KEY = "trojan-pending-prompt";

export interface PendingPromptMeta {
  workMode: WorkMode;
  timestamp: number;
}

export interface PendingPrompt {
  content: string;
  meta: PendingPromptMeta;
}

export function setPendingPrompt(prompt: PendingPrompt): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompt));
  } catch {
    // Storage full or unavailable
  }
}

export function getPendingPrompt(): PendingPrompt | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    
    const parsed = JSON.parse(saved) as PendingPrompt;
    
    // Validate structure
    if (!parsed.content || !parsed.meta?.workMode) {
      return null;
    }
    
    // Check if prompt is stale (older than 5 minutes)
    const age = Date.now() - parsed.meta.timestamp;
    if (age > 5 * 60 * 1000) {
      clearPendingPrompt();
      return null;
    }
    
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingPrompt(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
