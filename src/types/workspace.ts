import { LucideIcon } from "lucide-react";

export interface Artifact {
  id: string;
  type: "doc" | "diagram" | "idea" | "decision" | "note";
  title: string;
  icon: LucideIcon;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  title: string;
  isActive: boolean;
  messageCount: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  status?: "streaming" | "complete" | "error";
}

export interface Workspace {
  id: string;
  title: string;
  lastActive: string;
  tags: string[];
  artifacts?: { type: string; icon: LucideIcon }[];
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: LucideIcon;
}
